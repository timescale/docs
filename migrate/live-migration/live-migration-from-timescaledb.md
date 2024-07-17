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
import LiveMigrationDockerSubcommand from "versionContent/_partials/_migrate_live_migration_docker_subcommand.mdx";
import LiveMigrationDockerCleanup from "versionContent/_partials/_migrate_live_migration_cleanup.mdx";

# Live migration from TimescaleDB database with pgcopydb

This document provides detailed instructions to migrate data from your
TimescaleDB database (self-hosted or on [Managed Service for TimescaleDB]) to a
Timescale instance with minimal downtime (on the order of a few minutes) of
your production applications, using the [live migration] strategy. To simplify
the migration, we provide you with a docker image containing all the tools and
scripts that you need to perform the live migration.

You should provision a dedicated instance to run the migration steps from.
This instance should have sufficient space available to contain the
buffered changes which occur while the data is being copied. This is
approximately proportional to the amount of new data (uncompressed) being
written to the database during this period. As a general rule of thumb,
something between 100&nbsp;GB and 500&nbsp;GB should suffice.

<SourceTargetNote />

In detail, the migration process consists of the following steps:
1. Set up a target database instance in Timescale.
1. Prepare the source database for live migration.
1. Run the live migration docker image.
1. Validate the data in target database and use it as new primary.

<GettingHelp />

<StepOne />

## 2. Prepare the source database for live migration

<LiveMigrationStep2 />

Next, you need to ensure that your source tables and hypertables have either a primary key
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

<Highlight type="important">
TimescaleDB 2.12 and above allows setting `REPLICA IDENTITY` on hypertables. However,
if you're using a version below 2.12, it’s important that your hypertables have primary keys.
If they don't, you will need to upgrade your TimescaleDB instance. This is because, without a
primary key or `REPLICA IDENTITY`, operations such as `DELETE` and `UPDATE` will not be replicated,
which will impact the consistency of your data post migration.
</Highlight>

## 3. Run live migration docker image

<LiveMigrationDockerSubcommand />

The `migrate` command utilizes the snapshot created in the previous step and
migrates existing data to the target. It then streams transactions from the
source to the target. During this process, you see the replay process status:

```sh
Live-replay will complete in 1 minute 38.631 seconds (source_wal_rate: 106.0B/s, target_replay_rate: 589.0KiB/s, replay_lag: 56MiB)
```

If the live replay is not able to keep up with the load on the source database, you
see a message like:

```sh
WARN live-replay not keeping up with source load (source_wal_rate: 3.0MiB/s, target_replay_rate: 462.0KiB/s, replay_lag: 73MiB)
```

Once the live replay has caught up, live migration surfaces this:

```sh
Target has caught up with source (source_wal_rate: 751.0B/s, target_replay_rate: 0B/s, replay_lag: 7KiB)
    To stop replication, hit 'c' and then ENTER
```

<Highlight type="important">
Application downtime begins here. Ensure that you have a strategy to validate
the data in your target database before taking your applications offline, to
keep the overall downtime minimal.
</Highlight>

Once the live replay has caught up, and you're ready to take your applications
offline, stop all applications which are writing to the source database. This
marks the beginning of the downtime phase, which lasts until you have
[validated] the data in the target database.

[validated]: #4-validate-the-data-in-target-database-and-use-it-as-new-primary


Stopping writes to the source database allows the live migration process to
finish replicating data to the target database.

When you see the `Target has caught up with source` message, and your
applications are not writing to the database, press `c` followed by ENTER to
stop replication.

```sh
Target has caught up with source (source_wal_rate: 46.0B/s, target_replay_rate: 0B/s, replay_lag: 221KiB)
    To stop replication, hit 'c' and then ENTER
```

The live migration tool continues the remaining work, which includes copying
TimescaleDB metadata, sequences, and run policies. When the migration completes,
you see the following message:

```sh
Migration successfully completed
```

## 4. Validate the data in target database and use it as new primary

Now that all data has been migrated, the contents of both databases should be the
same. How exactly this should best be validated is dependent on your application.
You could compare the number of rows or an aggregate of columns to validate that
the target database matches with the source.

<Highlight type="important">
Application downtime ends here.
</Highlight>

Once you are confident with the data validation, the final step is to configure
your applications to use the target database.

<LiveMigrationDockerCleanup />

[Managed Service for TimescaleDB]: https://www.timescale.com/mst-signup/
[live migration]: https://docs.timescale.com/migrate/latest/live-migration/