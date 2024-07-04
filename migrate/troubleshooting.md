---
title: FAQ and troubleshooting
excerpt: Troubleshooting known issues in database migrations
products: [cloud, self_hosted]
keywords: [backups, restore]
tags: [recovery, logical backup, pg_dump, pg_restore]
---

import OpenSupportRequest from "versionContent/_partials/_migrate_open_support_request.mdx"

# FAQ and troubleshooting

## Unsupported in live migration

Live migration tooling is currently experimental. You may run into the following shortcomings:

- You may experience failure to migrate your database due to incompatibilities
  between the source and target (e.g. tables with generated columns cannot be
  replicated).
- Live migration does not yet support mutable compression (`INSERT`, `UPDATE`,
  `DELETE` on compressed data).
- By default, numeric fields containing `NaN`/`+Inf`/`-Inf` values are not
  correctly replicated, and will be converted to `NULL`. A workaround is
  available, but is not enabled by default.

Should you run into any problems, please open a support request before losing
any time debugging issues.
<OpenSupportRequest />

## Where can I find logs for processes running during live migration?

Live migration involves several background processes to manage different stages of
the migration. The logs of these processes can be helpful for troubleshooting
unexpected behavior. You can find these logs in the `<volume_mount>/logs` directory.


## Source and target databases have different TimescaleDB versions

When you migrate a [self-hosted][self hosted] or [Managed Service for TimescaleDB (MST)][mst]
database to Timescale, the source database and the destination
[Timescale Service][timescale-service] must run the same version of TimescaleDB.

Before you start [live migration][live migration]:


1. Check the version of TimescaleDB running on the source database and the
   target Timescale Service:
    ```sql
    select extversion from pg_extension where extname = 'timescaledb';
    ```

1. If the version of TimescaleDB on the source database is lower than your Timescale Service, either:
    - **Downgrade**: reinstall an older version of TimescaleDB on your Timescale
      Service that matches the source database:

        1. Connect to your Timescale Service and check the versions of TimescaleDB available:
           ```sql
           SELECT version FROM pg_available_extension_versions WHERE name = 'timescaledb' ORDER BY 1 DESC;
           ```

        2. If an available TimescaleDB release matches your source database:

            1. Uninstall TimescaleDB from your Timescale Service:
               ```sql
               DROP EXTENSION timescaledb;
               ```

            1. Reinstall the correct version of TimescaleDB:
               ```sql
               CREATE EXTENSION timescaledb VERSION '<version>';
               ```

           <Highlight type="note">
           You may need to reconnect to your Timescale Service using `psql -X` when you're creating the TimescaleDB extension.
           </Highlight>

    - **Upgrade**: for self-hosted databases,
      [upgrade TimescaleDB][self hosted upgrade] to match your Timescale Service.

[live migration]: /migrate/:currentVersion:/live-migration/
[self hosted]: /self-hosted/:currentVersion:/
[self hosted upgrade]: /self-hosted/:currentVersion:/upgrades/
[mst]: /mst/:currentVersion:/
[timescale-service]: https://console.cloud.timescale.com/dashboard/services


## Why does live migration log "no tuple identifier" warning?

Live migration logs a warning `WARNING: no tuple identifier for UPDATE in table`
when it cannot determine which specific rows should be updated after receiving an
`UPDATE` statement from the source database during replication. This occurs when tables
in the source database that receive `UPDATE` statements lack either a `PRIMARY KEY` or
a `REPLICA IDENTITY` setting. For live migration to successfully replicate `UPDATE` and
`DELETE` statements, tables must have either a `PRIMARY KEY` or `REPLICA IDENTITY` set
as a prerequisite.


## Set REPLICA IDENTITY on PostgreSQL partitioned tables

If your PostgreSQL tables use native partitioning, setting `REPLICA IDENTITY` on the
root (parent) table will not automatically apply it to the partitioned child tables.
You must manually set `REPLICA IDENTITY` on each partitioned child table.


## Can I use read/failover replicas as source database for live migration?

Live migration does not support replication from read or failover replicas. You must
provide a connection string that points directly to your source database for
live migration.


## Can I use live migration with a Postgres connection pooler like PgBouncer?

Live migration does not support connection poolers. You must provide a
connection string that points directly to your source and target databases
for live migration to work smoothly.


## Can I use Timescale Cloud instance as source for live migration?

No, Timescale Cloud cannot be used as a source database for live migration.


## How can I exclude a schema/table from being replicated in live migration?

At present, live migration does not allow for excluding schemas or tables from
replication, but this feature is expected to be added in future releases.
However, a workaround is available for skipping table data using the `--skip-table-data` flag.
For more information, please refer to the help text under the `migrate` subcommand.


## "target_replay_rate" is 0B/s even after waiting for several minutes

This is a known issue with live migration. In some cases, live migration may log the
following progress information.

```sh
WARNING: live-replay not keeping up with source load (source_wal_rate: 2.0MiB/s, target_replay_rate: 0B/s, replay_lag: 288MiB)
```

This means that live migration is not replicating changes to the target, causing the
replay lag to keep increasing. If you see the `target_replay_rate` at `0B/s` for more
than 10 minutes, a workaround is to stop the live migration using `CTRL + C` and
resume it using the resume flag: `./live-migration migrate --resume`.
This will restart the `migrate` process from where it left, and the `target_replay_rate` should no
longer be `0B/s`. If the issue persists, please reach out to the Timescale migration team
or share it in the `#migration` channel on Timescale community Slack.


## Large migrations blocked

Timescale's platform automatically manages the underlying disk volume. Due to
platform limitations, it is only possible to resize the disk once every six
hours. Depending on the rate at which you're able to copy data, you may be
affected by this restriction. Affected instances are unable to accept new data
and error with: `FATAL: terminating connection due to administrator command`.

If you intend on migrating more than 400&nbspGB of data to Timescale, open a
support request requesting the required storage to be pre-allocated in your
Timescale instance.

<OpenSupportRequest />

## Dumping and locks

When `pg_dump` starts, it takes an `ACCESS SHARE` lock on all tables which it
dumps. This ensures that tables aren't dropped before `pg_dump` is able to drop
them. A side effect of this is that any query which tries to take an
`ACCESS EXCLUSIVE` lock on a table is be blocked by the `ACCESS SHARE` lock.

A number of timescale-internal processes require taking `ACCESS EXCLUSIVE`
locks to ensure consistency of the data. The following is a non-exhaustive list
of potentially affected operations:

- compress/decompress/recompress chunk
- continuous aggregate refresh (before 2.12)
- create hypertable with foreign keys, truncate hypertable
- enable compression on hypertable
- drop chunks

The most likely impact of the above is that background jobs for retention
policies, compression policies, and continuous aggregate refresh policies are
blocked for the duration of the `pg_dump` command. This may have unintended
consequences for your database performance.

## Dumping with concurrency

When using the `pg_dump` directory format, it is possible to use concurrency to
use multiple connections to the source database to dump data. This speeds up
the dump process. Due to the fact that there are multiple connections, it is
possible for `pg_dump` to end up in a deadlock situation. When it detects a
deadlock it aborts the dump.

In principle, any query which takes an `ACCESS EXCLUSIVE` lock on a table
causes such a deadlock. As mentioned above, some common operations which take
an `ACCESS EXCLUSIVE` lock are:
- retention policies
- compression policies
- continuous aggregate refresh policies

If you would like to use concurrency nonetheless, turn off all background jobs
in the source database before running `pg_dump`, and turn them on once the dump
is complete. If the dump procedure takes longer than the continuous aggregate
refresh policy's window, you must manually refresh the continuous aggregate in
the correct time range. For more information, consult the
[refresh policies documentation].

To turn off the jobs:
```sql
SELECT public.alter_job(id::integer, scheduled=>false)
FROM _timescaledb_config.bgw_job
WHERE id >= 1000; 
```

To turn on the jobs:
```sql
SELECT public.alter_job(id::integer, scheduled=>true)
FROM _timescaledb_config.bgw_job
WHERE id >= 1000; 
```

[refresh policies documentation]: /use-timescale/:currentVersion:/continuous-aggregates/refresh-policies/

## Restoring with concurrency

If the directory format is used for `pg_dump` and `pg_restore`, concurrency can be
employed to speed up the process. Unfortunately, loading the tables in the 
`timescaledb_catalog` schema concurrently causes errors. Furthermore, the
`tsdbadmin` user does not have sufficient privileges to turn off triggers in
this schema. To get around this limitation, load this schema serially, and then
load the rest of the database concurrently.

```bash
# first, serially load JUST the _timescaledb_catalog
pg_restore -d "$TARGET" \
    --format=directory \
    --schema='_timescaledb_catalog' \
    --exit-on-error \
    --no-tablespaces \
    --no-owner \
    --no-privileges \
    dump

# next, concurrently load everything EXCEPT the _timescaledb_catalog 
pg_restore -d "$TARGET" \
    --format=directory \
    --jobs=8 \
    --exclude-schema='_timescaledb_catalog' \
    --exit-on-error \
    --disable-triggers \
    --no-tablespaces \
    --no-owner \
    --no-privileges \
    dump
```

## Ownership of background jobs

The `_timescaledb_config.bgw_jobs` table is used to manage background jobs.
This includes both user-defined actions, compression policies, retention
policies, and continuous aggregate refresh policies. On Timescale, this table
has a trigger which ensures that no database user can create or modify jobs
owned by another database user. This trigger can provide an obstacle for migrations.

If the `--no-owner` flag is used with `pg_dump` and `pg_restore`, all
objects in the target database are owned by the user that ran
`pg_restore`, likely `tsdbadmin`.

If all the background jobs in the source database were owned by a user of the
same name as the user running the restore (again likely `tsdbadmin`), then
loading the `_timescaledb_config.bgw_jobs` table should work.

If the background jobs in the source were owned by the `postgres` user, they
are be automatically changed to be owned by the `tsdbadmin` user. In this case,
one just needs to verify that the jobs do not make use of privileges that the
`tsdbadmin` user does not possess.

If background jobs are owned by one or more users other than the user
employed in restoring, then there could be issues. To work around this
issue, do not dump this table with `pg_dump`. Provide either
`--exclude-table-data='_timescaledb_config.bgw_job'` or
`--exclude-table='_timescaledb_config.bgw_job'` to `pg_dump` to skip
this table.  Then, use `psql` and the `COPY` command to dump and
restore this table with modified values for the `owner` column.

```bash
# dump the _timescaledb_config.bgw_job table to a csv file replacing the owner 
# values with tsdbadmin
psql -d "$SOURCE" -X -v ON_ERROR_STOP=1 --echo-errors -f - <<'EOF'
begin;
select string_agg
( case attname
    when 'owner' then $$'tsdbadmin' as "owner"$$
    else format('%I', attname)
  end
, ', '
) as cols
from pg_namespace n
inner join pg_class c
on (n.nspname = '_timescaledb_config'
and n.oid = c.relnamespace
and c.relname = 'bgw_job')
inner join pg_attribute a
on (c.oid = a.attrelid and a.attnum > 0)
\gset
copy
(
    select :cols 
    from _timescaledb_config.bgw_job
    where id >= 1000
) to stdout with (format csv, header true)
\g bgw_job.csv
rollback;
\q
EOF

# copy the csv file into the target's _timescaledb_config.bgw_job
psql -X -d "$TARGET" -v ON_ERROR_STOP=1 --echo-errors \
    -c "\copy _timescaledb_config.bgw_job from 'bgw_job.csv' with (format csv, header match)"
```

Once the table has been loaded and the restore completed, you may then use SQL
to adjust the ownership of the jobs and/or the associated stored procedures and 
functions as you wish.

## Extension availability

There are a vast number of PostgreSQL extensions available in the wild. 
Timescale supports many of the most popular extensions, but not all extensions.
Before migrating, check that the extensions you are using are supported on
Timescale. Consult the [list of supported extensions].

[list of supported extensions]: /use-timescale/:currentVersion:/extensions/

## Timescaledb extension in the public schema

When self-hosting, the timescaledb extension may be installed in an arbitrary
schema. Timescale only supports installing the timescaledb extension in the
`public` schema. How to go about resolving this depends heavily on the 
particular details of the source schema and the migration approach chosen.

## Tablespaces

Timescale does not support using custom tablespaces. Providing the
`--no-tablespaces` flag to `pg_dump` and `pg_restore` when
dumping/restoring the schema results in all objects being in the
default tablespace as desired.

## Only one database per instance

While PostgreSQL clusters can contain many databases, Timescale instances are 
limited to a single database. When migrating a cluster with multiple databases
to Timescale, one can either migrate each source database to a separate 
Timescale instance or "merge" source databases to target schemas.

## Superuser privileges

The `tsdbadmin` database user is the most powerful available on Timescale, but it
is not a true superuser. Review your application for use of superuser privileged
operations and mitigate before migrating.

## Migrate partial continuous aggregates

In order to improve the performance and compatibility of continuous aggregates, 
[TimescaleDB v2.7][release-270] replaces _partial_ continuous aggregates with 
_finalized_ continuous aggregates.

To test your database for partial continuous aggregates, run the following query:

```SQL
SELECT exists (SELECT 1 FROM timescaledb_information.continuous_aggregates WHERE NOT finalized);
```

If you have partial continuous aggregates in your database, [migrate them][migrate] 
from partial to finalized before you migrate your database.

If you accidentally migrate partial continuous aggregates across PostgreSQL
versions, you see the following error when you query any continuous aggregates:

```
ERROR:  insufficient data left in message.
```

[migrate]: /migrate/:currentVersion:/live-migration/
[release-270]: /about/:currentVersion:/release-notes/past-releases/#270-2022-05-24

