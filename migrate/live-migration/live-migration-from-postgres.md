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
import ExplainPgDumpFlags from "versionContent/_partials/_migrate_explain_pg_dump_flags.mdx";

# Live migration from PostgreSQL database with pgcopydb

This document provides detailed step-by-step instructions to migrate data using
[pgcopydb][pgcopydb] to perform a live migration from a source database which
is using PostgreSQL to Timescale.

It's suggested to provision a dedicated instance to run the migration steps.
Ideally an AWS EC2 instance that's in the same region as the Timescale target
service. For a 10K transactions/s ingestion load, with the assumption of
historical data copy takes 2 days, the recommend is 4 CPU with 4 to 8 GiB of
RAM and a 1.2 TiB of storage.

Before beginning the migration process, ensure that tools `psql`, `pg_dump`,
`pg_dumpall`, and `pgcopydb` are installed and available on the system that
performs the migration.

For Debian and Ubuntu systems, you can install all the tools with:

```
sudo apt update
sudo apt install -y postgresql-common
sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh
sudo apt install -y pgcopydb
```

On other distributions, you can use the following installation instructions:

- `pgcopydb`: Installation instructions can be found in the [official
  repository][install-pgcopydb]. When installing from package managers like
  `apt`, `yum`, or `dnf`, the other required tools are usually also installed
  as dependencies to `pgcopydb`.

- `psql`, `pg_dump`, and `pg_dumpall`: These can be installed by following the
  instructions in the [How to Install psql on Mac, Ubuntu, Debian, Windows][install-psql]
  blog post. Although the instructions specifically mention `psql`, following
  them also installs `pg_dump` and `pg_dumpall`.

<SourceTargetNote />

In detail, the migration process consists of the following steps:

1. Set up a target database instance in Timescale.
1. Prepare the source database for the live migration.
1. Set up a replication slot and snapshot.
1. Migrate roles and schema from source to target.
1. Enable hypertables.
1. Migrate initial data from source to target.
1. Apply the replicated changes from source.
1. Promote target database as new primary.

<GettingHelp />

<StepOne />

## 2. Prepare the source database for the live migration

It's important to ensure that the `old_snapshot_threshold` value is set to the
default value of `-1` in your source database. This prevents PostgreSQL from
treating the data in a snapshot as outdated. If this value is set other than
`-1`, it might affect the existing data migration step.

To check the current value of `old_snapshot_threshold`, run the command:

```sh
psql -X -d $SOURCE -c 'show old_snapshot_threshold'
```

If the query returns something other than `-1`, run the following command
to set it up:

```sh
psql -X -d $SOURCE -c 'alter system set old_snapshot_threshold=-1'
```

Next, you should set `wal_level` to `logical` so that the write-ahead log (WAL)
records information that is needed for logical decoding.

To check the current value of  `wal_level`, run the command:

```sh
psql -X -d $SOURCE -c 'show wal_level'
```

If the query returns something other than `logical`, run the following command
to set it up:

```sh
psql -X -d $SOURCE -c 'alter system set wal_level=logical'
```

You should restart your database for the changes to take effect.

## 3. Set up a replication slot and snapshot

The [replication slot][replication-slot] forms the backbone of the replication
strategy.

> A slot represents a stream of changes that can be replayed to a client in the
order they were made on the origin server.

The stream of changes emitted by the slot are buffered into disk until they are
applied on the target. The instance used to orchestrate the migration (the one
running the commands) should have enough capacity to store the files, and it
should be actively monitored to prevent any issues that might result due to
lack of space.

Before starting, there's an important caveat. To replicate `DELETE` and
`UPDATE` operations, the source table must either have a primary key or
`REPLICA IDENTITY` set. Replica identity assists logical decoding in
identifying the rows being modified. It defaults to using the table's primary
key.

If a table doesn't have a primary key, you'll have to manually set the replica
identity. One option is to use a unique, non-partial, non-deferrable index that
includes only columns marked as `NOT NULL`. This can be set as the replica
identity:

```sql
ALTER TABLE {table_name} REPLICA IDENTITY USING INDEX {_index_name}
```

If there's no primary key or viable unique index to use, you'll have to set it
to full:

```sql
ALTER TABLE {table_name} REPLICA IDENTITY FULL
```

Once you're sure all your tables are properly configured for replication, use
`pgcopydb`'s follow command to create a replication slot:

```sh
pgcopydb follow \
  --source "$SOURCE" \
  --target "$TARGET" \
  --fail-fast \
  --plugin wal2json
```

<SetupSourceTarget />

This command is going to be active during most of the migration process. You
can run it on a separate terminal instance, or start it in the background. To
start it in the background append `> pgcopydb_follow.log 2>&1 &` to the
command. For example:

```sh
pgcopydb follow \
  --source "$SOURCE" \
  --target "$TARGET" \
  --fail-fast \
  --plugin wal2json > pgcopydb_follow.log 2>&1 &
```

The `> pgcopydb_follow.log 2>&1` part redirects all the messages to the
`pgcopydb_follow.log` file, this is optional but recommended. The `pgcopydb
follow` command outputs many messages, if they are not redirected, using the
terminal becomes cumbersome due to the constant pop up of messages.

The `follow` command not only creates the replication slot for streaming
changes, but also exports a [snapshot][snapshot] ID to `/tmp/pgcopydb/snapshot`.
This ID can be used to migrate the data that was stored in the database prior
to the creation of the replication slot.

> A snapshot determines which data is visible to the transaction that is using
the snapshot. Synchronized snapshots are necessary when two or more sessions
need to see identical content in the database.

Before the stream of changes can be applied, the schema and data that existed
prior to the creation of the replication slot must be migrated ([step
4][step-4]). The point that marks the beginning of the replication and
buffering of changes is given by the exported snapshot. The larger the
database, the more time it takes to perform the initial migration, and the
longer the buffered files need to be stored.

## 4. Migrate roles and schema from source to target

### 4a. Dump the database roles from the source database

<DumpDatabaseRoles />

### 4b. Dump the database schema from the source database

```sh
pg_dump -d "$SOURCE" \
  --format=plain \
  --quote-all-identifiers \
  --no-tablespaces \
  --no-owner \
  --no-privileges \
  --schema-only \
  --file=dump.sql \
  --snapshot=$(cat /tmp/pgcopydb/snapshot)
```

- `--schema-only` is used to dump only the object definitions (schema), not
  data.

- `--snapshot` is used to specified the synchronized [snapshot][snapshot] when
  making a dump of the database.

<ExplainPgDumpFlags />

### 4c. Load the roles and schema into the target database

```sh
psql -X -d "$TARGET" \
  -v ON_ERROR_STOP=1 \
  --echo-errors \
  -f roles.sql \
  -f dump.sql
```

## 5. Enable hypertables

This is the ideal point to convert regular tables into hypertables. In simple
terms, you'll want to convert the tables that contain time series data. For
each table that's going to be converted to a Hypertable in the target database,
run the following command:

```sh
psql -X -d "$TARGET" \
  -v ON_ERROR_STOP=1 \
  -c "SELECT create_hypertable('<table name>', '<time column name>')"
```

A more detailed explanation can be found in the [hypertable
documentation][hypertable-docs].

Once the table is converted, you can follow the guides to enable more Timescale
features like [retention][retention-docs] and [compression][compression-docs].

This step is optional. Although it's strongly recommended to perform it at this
point, it can be done after all the data has been migrated, since Hypertables
can be created from tables with existing data.

The disadvantage of converting after inserting all the data is that the table
must be locked while the data is being partitioned. This means that no new data
can be written into the table while the table is being converted. The larger
the table, the longer it is going to remain locked. Conversely, inserting into
an already converted Hypertable is a fast operation that partitions the data
while it's being inserted.

## 6. Migrate initial data from source to target

Use pgcopydb and the snapshot ID obtained in [step 3][step-3]
(/tmp/pgcopydb/snapshot) to copy the data. This action can take a significant
amount of time, up to several days, depending on the size of the source
database. You must wait until it finishes before moving on to the next step. To
start copying data, execute the following command:

```sh
pgcopydb copy table-data \
  --source "$SOURCE" \
  --target "$TARGET" \
  --snapshot $(cat /tmp/pgcopydb/snapshot) \
  --split-tables-larger-than '10 GB'  \
  --table-jobs 8
```

- `--snapshot` specifies the synchronized [snapshot][snapshot] to use when
  retrieving the data. It must be set up to the snapshot exported in
  [step-3][step-3], that guarantees that the only data copied is the one that
  existed on the database prior to the creation of the replication slot.

- `--split-tables-larger-than` defines the table size threshold after which
  more than once process is going be use at the same time to process a single
  source table.

- `--table-jobs` is the number of concurrent `COPY` jobs to run.

## 7. Apply the replicated changes from source

With the schema and initial data loaded, you can now apply the buffered and
live changes emitted by the replication slot:

```sh
pgcopydb stream sentinel set apply --source $SOURCE
```

The replication progress can be monitored by querying the [pg_stat_replication
view][pg-stat-replication-docs]:

```sh
psql $SOURCE \
  -f - <<'EOF'
SELECT replay_lag
FROM pg_stat_replication
WHERE application_name='pgcopydb' AND state='streaming'
EOF
```

- `replay_lag`: Time elapsed between flushing recent WAL locally and receiving
  notification that this standby server has written, flushed and applied it.

## 8. Promote target database as new primary

To proceed with this step, you need to wait until the replication lag is
minimized as much as possible. For instance, you can move forward when the
`replay_lag` is close to just a few seconds. At this point, the source and
target should be almost identical.

Ideally the `replay_lag` should be as close to zero as possible. The next step
is about stopping write traffic to process all the pending changes. The bigger
the replay lag, the longer is going to take to apply the pending changes.
Since ingest has to be turned off to prevent data loss, the longer it takes to
apply the pending changes, the longer the application needs to have write
traffic off. When deciding the moment to perform the switch-over and make target
your new primary database, take into consideration what `replay_lag` value you're
comfortable with and how that value translate in time without ingest.

To continue with the switch-over, stop the write traffic to the source
database. With no new data being ingested the replication slot should not emit
any more changes and `replay_lag` should decrease considerably faster.

With ingest turned off, `pgcopydb` can be instructed to stop when it's done
applying the changes that have been generated up to this point:

```sh
pgcopydb stream sentinel set endpos --current --source $SOURCE
```

Data written to the source database after this point won't be replicated.
That's the reason why you've stop the write traffic.

Changes to sequences are not replicated. Fortunately, `pgcopydb` has a command
to migrate them:

```sh
pgcopydb copy sequences \
  --source "$SOURCE" \
  --target "$TARGET" \
  --resume \
  --not-consistent
```

Wait until the `pgcopydb follow` process from [step 3][step-3] finishes its
execution. The process runs until the end position is reached. If you started
`pgcopydb follow` in the background you can bring it to the foreground with the
`fg` command.

A successful execution of the follow command should have logs stating that the
end position has been reached and the that the process is done.

```
07:58:28.859 119 INFO   Transform reached end position 0/2ECDB58 at 0/2ECDB58
07:58:29.108 120 INFO   Replay reached end position 0/2ECDB58 at 0/2ECDB58
07:58:29.168 120 INFO   Replayed up to replay_lsn 0/1AB61F8, stopping
07:58:29.473 8 INFO   Subprocesses for prefetch, transform, and catchup have now all exited
07:58:29.534 8 INFO   Current sentinel replay_lsn is 0/2ECDB58, endpos is 0/2ECDB58
07:58:29.534 8 INFO   Current endpos 0/2ECDB58 has been reached at 0/2ECDB58
07:58:29.534 8 INFO   Follow mode is now done, reached replay_lsn 0/2ECDB58 with endpos 0/2ECDB58
```

If the command output was redirected to a file the messages won't be shown in
the terminal even if you bring the process to the foreground. In this case,
inspect the log file.

Update the table statistics by running `ANALYZE` on all data:

```sh
psql $TARGET -c "ANALYZE;"
```

Finally, switch the application to use the target database and clean up the
`pgcopydb` artifacts:

```sh
pgcopydb stream cleanup \
  --source "$SOURCE" \
  --target "$TARGET"
```

[pgcopydb]: https://github.com/dimitri/pgcopydb
[install-psql]: https://www.timescale.com/blog/how-to-install-psql-on-mac-ubuntu-debian-windows/
[install-pgcopydb]: https://github.com/dimitri/pgcopydb#installing-pgcopydb
[replication-slot]: https://www.postgresql.org/docs/current/logicaldecoding-explanation.html#LOGICALDECODING-REPLICATION-SLOTS
[snapshot]: https://www.postgresql.org/docs/current/functions-admin.html#FUNCTIONS-SNAPSHOT-SYNCHRONIZATION
[step-4]: #4.-set-up-schema-and-migrate-initial-data-to-target-database
[step-3]: #3.-set-up-a-replication-slot-and-snapshot
[hypertable-docs]: /use-timescale/:currentVersion:/hypertables/
[retention-docs]: /use-timescale/:currentVersion:/data-retention/
[compression-docs]: /use-timescale/:currentVersion:/compression/
[data-tiering-docs]: /use-timescale/:currentVersion:/data-tiering/
[pg-stat-replication-docs]: https://postgresql.org/docs/16/interactive/monitoring-stats.html#MONITORING-PG-STAT-REPLICATION-VIEW
