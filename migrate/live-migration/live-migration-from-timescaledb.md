---
title: Migrate from TimescaleDB using live migration
excerpt: Migrate from a TimescaleDB database using the low-downtime live migration method
products: [cloud]
keywords: [migration, low-downtime]
tags: [migration, logical backup, replication]
---

import GettingHelp from "versionContent/_partials/_migrate_dual_write_backfill_getting_help.mdx";
import SourceTargetNote from "versionContent/_partials/_migrate_source_target_note.mdx";
import StepOne from "versionContent/_partials/_migrate_dual_write_step1.mdx";
import DumpDatabaseRoles from "versionContent/_partials/_migrate_dual_write_dump_database_roles.mdx";
import DumpPreDataSourceSchema from "versionContent/_partials/_migrate_pre_data_dump_source_schema.mdx";
import DumpPostDataSourceSchema from "versionContent/_partials/_migrate_post_data_dump_source_schema.mdx";
import LiveMigrationStep2 from "versionContent/_partials/_migrate_live_migration_step2.mdx";

# Live migration from TimescaleDB database with pgcopydb

This document provides detailed instructions on how to perform a database migration
from a production TimescaleDB that is either a [Managed Service for TimescaleDB] or
self-hosted instance to Timescale in a way that requires minimal downtime
(in the order of few minutes) of your production applications.

The migration process will be carried out using the [live migration] strategy. You
will use a live migration image that streamlines the process of replicating live
transactions from your source database to Timescale.

You should provision a dedicated instance to run the migration steps from.
Ideally an AWS EC2 instance that's in the same region as the Timescale target service.
For an ingestion load of 10,000 transactions/s, and assuming that the historical
data copy takes 2 days, we recommend 4 CPUs with 4 to 8 GiB of RAM and 1.2 TiB of storage.

<SourceTargetNote />

In detail, the migration process consists of the following steps:
1. Set up a target database instance in Timescale.
2. Prepare the source database for live migration.
3. Run the live migration image.
4. Validate the data in target database and promote as new primary.

<GettingHelp />

<StepOne />

## 2. Prepare the source database for live migration

<LiveMigrationStep2 />

Next, you will need to ensure that your source tables and hypertables have either a primary key
or `REPLICA IDENTITY` set. This is important as it is a requirement for replicating `DELETE` and
`UPDATE` operations. Replica identity assists the replication process in identifying the rows
being modified. It defaults to using the table's primary key.

If a table doesn't have a primary key, you'll have to manually set the replica identity.
One option is to use a unique, non-partial, non-deferrable index that includes only columns
marked as `NOT NULL`. This can be set as the replica identity:

```sh
ALTER TABLE {table_name} REPLICA IDENTITY USING INDEX {_index_name}
```

If there's no primary key or viable unique index to use, you will have to set `REPLICA IDENTITY`
to `FULL`. If you are expecting a large number of `UPDATE` or `DELETE` operations on the table,
we do not recommend using `FULL`. For each `UPDATE` or `DELETE` statement, Postgres will have
to read the whole table to find all matching rows, which will result in significantly slower replication.

<Highlight type="important">
TimescaleDB 2.12 and above allows setting `REPLICA IDENTITY` on hypertables. However,
if you're using a version below 2.12, it’s important that your hypertables have primary keys.
If they don't, you will need to upgrade your TimescaleDB instance. This is because, without a
primary key or `REPLICA IDENTITY`, operations such as `DELETE` and `UPDATE` will not be replicated,
which will impact the consistency of your data post migration.
</Highlight>

## 3. Run live migration image

First, set the database URIs as environment variables:

```sh
export SOURCE=""
export TARGET=""
```

Next, download and run the live migration image:

```sh
docker run --rm -it \
  -e PGCOPYDB_SOURCE_PGURI=$SOURCE \
  -e PGCOPYDB_TARGET_PGURI=$TARGET \
  timescale/live-migration:0.0.1
```

This command may take a while to complete. It’s recommended to run it in the background
or use terminal multiplexers like `screen` or `tmux`.

The command will take a snapshot of your source database, migrate existing data to the
target, and stream live transactions from the source to the target. During this process,
it will display the lag between the source and target databases in terms of WAL offset size.

```sh
[WATCH] Source DB - Target DB => 126MB
```

When the lag between the source and target database is less than 30 megabytes, it will
start `ANALYZE` on the target database. This updates statistics in the target database,
which is necessary for optimal querying performance in the target database. Wait for
`ANALYZE` to complete.

<Highlight type="note">
Application downtime begins here.
</Highlight>

When you're _ready to take downtime_ (i.e., stop normal operations) on your production
applications that are dependent on your source database and the _lag between the databases is below 30 megabytes_,
you should stop your applications that perform DML queries on your source database.
This is the downtime phase and will last until you have completed the validation step (4).
Be sure to go through the validation step (4) and prepare the validation queries before
you enter the downtime phase to keep the overall downtime minimal.

Stopping DML queries on your source database allows the live migration image to make
the target database even with the source. This will be evident when the lag outputs
0 megabytes.

When the lag between the two databases shows 0 megabytes, wait for a few minutes and
then provide the signal to stop the live replay by pressing key `s` or giving a
`SIGUSR1` signal, as per your log. You should see `Stopped` message.

```sh
[WATCH] Source DB - Target DB => 0MB. Press 's' (and ENTER) to stop live-replay
Stopped
```

Now, compare tables in the target against those in the source to ensure that
both have the same data.


Once you are confident that the tables in the source are identical to the target,
you need to signal "continue". This is done either by pressing key `c` or giving a `SIGUSR1`
signal, as mentioned in your log.

```sh
[ACTION NEEDED] Now, you should check the integrity of your data. Once you are confident, press 'c' (and ENTER) to continue
Continuing ...
Syncing last LSN in Source DB to Target DB ...
```

The live migration image will continue the remaining work under live replay,
copy TimescaleDB metadata, sequences, and run policies. You should see the
following message if all the mentioned steps were successful.

```sh
Migration successfully completed
```

## 4. Validate the data in target database and promote as new primary

Now that all data has been migrated, the contents of both databases should be the
same. How exactly this should best be validated is dependent on your application.
You could compare the number of rows or an aggregate of columns to validate that
the target database matches with the source.

<Highlight type="note">
Application downtime ends here.
</Highlight>

Once you are confident with the validation perspective, the final step is to
promote the target database as your new production database by using the target
database's URI in your production application.

[Managed Service for TimescaleDB]: https://www.timescale.com/mst-signup/
[live migration]: https://docs.timescale.com/migrate/latest/live-migration/