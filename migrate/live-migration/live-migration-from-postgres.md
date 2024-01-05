---
title: Migrate from PostgreSQL using live migration
excerpt: Migrate from a PostgreSQL database using the low-downtime live migration method
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

# Live migration from PostgreSQL database

This document provides instructions to migrate data from your
PostgreSQL database to a Timescale instance with minimal downtime (on the order
of a few minutes) of your production applications, using the [live migration]
strategy. To simplify the migration, we provide you with a docker image
containing all the tools and scripts that you need to perform the live
migration.

You should provision a dedicated instance to run the migration steps from.
Ideally an AWS EC2 instance that's in the same region as the Timescale target
service. For an ingestion load of 10,000 transactions/s, and assuming that the
historical data of size 2 TB, we recommend 4 CPUs with 4 to 8 GiB of RAM
and 1.2 TiB of storage, this approximates takes 24 hours to complete the migration.

In detail, the migration process consists of the following steps:

1. Set up a target database instance in Timescale.
1. Prepare the source database for live migration.
1. Run the live migration docker image.
1. Validate the data in target database and use it as new primary.

<GettingHelp />

<StepOne />

## 2. Prepare the source database for live migration

<LiveMigrationStep2 />

Next, you need to ensure that your source tables have either a primary key
or `REPLICA IDENTITY` set. This is important as it is a requirement for replicating `DELETE` and
`UPDATE` operations. Replica identity assists the replication process in identifying the rows
being modified. It defaults to using the table's primary key.

If a table doesn't have a primary key, you'll have to manually set the replica identity.
One option is to use a unique, non-partial, non-deferrable index that includes only columns
marked as `NOT NULL`. This can be set as the replica identity:

```sh
ALTER TABLE {table_name} REPLICA IDENTITY USING INDEX {_index_name}
```

If there's no primary key or viable unique index to use, you have to set `REPLICA IDENTITY`
to `FULL`. If you are expecting a large number of `UPDATE` or `DELETE` operations on the table,
using `FULL` is not recommended. For each `UPDATE` or `DELETE` statement, PostgreSQL reads the
whole table to find all matching rows, resulting in significantly slower replication.

```sh
ALTER TABLE {table_name} REPLICA IDENTITY FULL
```

## 3. Run the live migration docker image

First, set the database URIs as environment variables:

```sh
export SOURCE=""
export TARGET=""
```

Next, download and run the live migration docker image:

```sh
docker run --rm -dit --name live-migration \
  -e PGCOPYDB_SOURCE_PGURI=$SOURCE \
  -e PGCOPYDB_TARGET_PGURI=$TARGET \
  -v ~/live-migration:/opt/timescale/ts_cdc \
  timescale/live-migration:v0.0.1
```

<Highlight type="note">
The above command runs in background may take a while to complete.
You can use `docker attach` to interact with the migration image.

Ensure `/live-migration` directory has sufficient space available.
Ideally, 1.5 times the source database size should be good.
</Highlight>

The command will take a snapshot of your source database and migrate the schema
to the target database. After migrating the schema, it will prompt you to create
hypertables in the target database.

Ideally, tables that contain time-series data should be converted to Hypertables.
You need to run `create_hypertable()` for each table that you want to convert to
a Hypertable in the target database. For more information, see [Hypertable docs].

Once you have finished creating Hypertables, you need to signal "continue" to proceed.
You can do it by pressing the `c` key.

Next, the live migration image will migrate the existing data in the source database
to target database and start streaming live transactions (live replay) received on
the source side to the target. During this process, it will display the lag between
the source and target databases in terms of WAL offset size.

```sh
[WATCH] Source DB - Target DB => 126MB
```

When the lag between the source and target database is less than 30 megabytes,
it will start `ANALYZE` on the target database. This updates statistics in the
target database, which is necessary for optimal querying performance in the
target database. Wait for `ANALYZE` to complete.

## 4. Validate the data in target database and use it as new primary

Once the lag between the databases is below 130 megabytes, we recommend performing data integrity checks. There are two ways to do this:

1. With downtime: Stop database operations from your application, which will result in downtime. This allows the live migration to catch up on the lag between the source and target databases, enabling the validation checks to be performed. The downtime will last until the lag is eliminated and the data integrity checks are completed.
2. Without downtime: Since the difference between the source and target databases is less than 130 MB, you can perform data integrity checks, excluding the latest data that is still being written. This approach does not require taking your application down.

Now that the data integrity checks are complete, it's time to switch your target database to become the primary one. If you have selected option 2 for data integrity checks, stop writing to the source database and immediately start writing to the target database from the application. This will minimize application downtime to as low as application restart. It allows the live migration process to complete replicating data to the target database, as the source will no longer receive any new transactions. You will know the process is complete when the replication lag reduces to 0 megabytes. If you have chosen option 1 for data integrity checks, start your application to write data to the target database.

Once the replication lag is 0, wait for a few minutes and then provide the
signal to proceed by pressing key `c`.

```sh
[WATCH] Source DB - Target DB => 0MB. Press "c" (and ENTER) to proceed
Syncing last LSN in Source DB to Target DB ...
```

The live migration image will continue the remaining work that includes
migrating sequences and cleaning up resources. You should see the following
message if all the mentioned steps were successful.

```sh
Migration successfully completed
```

[Hypertable docs]: /use-timescale/:currentVersion:/hypertables/
[live migration]: https://docs.timescale.com/migrate/latest/live-migration/