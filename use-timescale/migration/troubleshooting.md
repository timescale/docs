---
title: Troubleshooting known issues
excerpt: Troubleshooting known issues in database migrations
products: [cloud, self_hosted]
keywords: [backups, restore]
tags: [recovery, logical backup, pg_dump, pg_restore]
---

# Troubleshooting known issues

## Large migrations blocked

Timescale's platform automatically manages the underlying disk volume. Due to
platform limitations, it is only possible to resize the disk once every six
hours. Depending on the rate at which you're able to copy data, you may be
affected by this restriction. Affected instances will be unable to accept new
data and will error with: TODO error here.

If you intend on migrating more than 400&nbspGB of data to Timescale, please
open a support case in order for the required storage to be pre-allocated in
your database instance.

## Dumping and locks

When `pg_dump` starts, it takes an `ACCESS SHARE` lock on all tables which it
dumps. This ensures that tables aren't dropped before `pg_dump` is able to drop
them. A side effect of this is that any query which tries to take an
`ACCESS EXCLUSIVE` lock on a table will be blocked by the `ACCESS SHARE` lock.

A number of timescale-internal processes require taking `ACCESS EXCLUSIVE`
locks to ensure consistency of the data. The following is a non-exhaustive list
of potentially affected operations:

- compress/decompress/recompress chunk
- continuous aggregate refresh (before 2.12)
- create hypertable with foreign keys, truncate hypertable
- enable compression on hypertable
- drop chunks

The most likely impact of the above is that background jobs for retention
policies, compression policies, and continuous aggregate refresh policies will
be blocked for the duration of the `pg_dump` command. This may have unintended
consequences for your database performance.

## Dumping with concurrency

When using the `pg_dump` directory format, it is possible to use concurrency to
use multiple connections to the source database to dump data. This speeds up
the dump process. Due to the fact that there are multiple connections, it is
possible for `pg_dump` to end up in a deadlock situation. When it detects a
deadlock it aborts the dump.

In principle, any query which takes an `ACCESS EXCLUSIVE` lock on a table will
cause such a deadlock. As mentioned above, some common operations which take an
`ACCESS EXCLUSIVE` lock are:
- retention policies
- compression policies
- continuous aggregate refresh policies

If you would like to use concurrency nonetheless, we recommend that you disable
all background jobs in the source database before running `pg_dump`, and
re-enable them once the dump is complete. If the dump procedure takes longer
than the continuous aggregate refresh policy's window, you will need to
manually refresh the continuous aggregate in the correct time range. For more
information, consult the [refresh policies documentation][refresh-policies].

To disable the jobs:
```sql
SELECT public.alter_job(id::integer, scheduled=>false)
FROM _timescaledb_config.bgw_job
WHERE id >= 1000; 
```

To re-enable the jobs:
```sql
SELECT public.alter_job(id::integer, scheduled=>true)
FROM _timescaledb_config.bgw_job
WHERE id >= 1000; 
```

[refresh-policies]: /use-timescale/:currentVersion:/continuous-aggregates/refresh-policies/

## Restoring with concurrency

If the directory format is used for pg_dump and pg_restore, concurrency can be
employed to speed up the process. Unfortunately, loading the tables in the 
`timescaledb_catalog` schema concurrently will cause errors. Furthermore, the 
`tsdbadmin` does not have sufficient privileges to disable triggers in this 
schema. To get around this limitation, load this schema serially, and then load 
the rest of the database concurrently.

```bash
# first, load JUST the _timescaledb_catalog serially
pg_restore -d "$TARGET" \
    --format=directory \
    --schema='_timescaledb_catalog' \
    --exit-on-error \
    --no-tablespaces \
    --no-owner \
    --no-privileges \
    dump

# next, load everything EXCEPT the _timescaledb_catalog with concurrency
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

The `_timescaledb_config.bgw_jobs` table is used to manage background jobs. This
includes both user-defined actions, compression policies, retention policies,
and continuous aggregate refresh policies. On Timescale, this table has a
trigger which ensures that no database user can create or modify jobs owned by
another database user. This trigger can provide an obstacle for migrations.

If the `--no-owner` flag is used with pg_dump and pg_restore, all objects in the
target database will be owned by the user that ran pg_restore, likely tsdbadmin.

If all the background jobs in the source database were owned by a user of the
same name as the user running pg_restore (again likely tsdbadmin), then loading
the `_timescaledb_config.bgw_jobs` table should work.

If the background jobs in the source were owned by the postgres user, they will 
be automatically changed to be owned by the tsdbadmin. In this case, one just 
needs to verify that the jobs do not make use of privileges that the tsdbadmin
user does not possess.

If background jobs are owned by one or more users other than the user employed 
in restoring, then there could be issues. To work around this issue, do not dump
this table with pg_dump. Provide either
`--exclude-table-data='_timescaledb_config.bgw_job'` or 
`--exclude-table='_timescaledb_config.bgw_job'` to pg_dump to skip this table.
Then, use psql and the COPY command to dump and restore this table with modified
values for the `owner` column.

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

## Extension Availability

There are a vast number of PostgreSQL extensions available in the wild. 
Timescale supports many of the most popular extensions, but not all extensions.
Before migrating, check that the extensions you are using are supported on
Timescale. Use the query below in a Timescale instance to get an up-to-date list
of supported extensions.

```sql
select x.*
from pg_available_extensions x
inner join
(
    select unnest(regexp_split_to_array(setting, ',')) as name
    from pg_settings
    where name = 'extwlist.extensions'
) w on (x.name = w.name)
```

## Timescaledb extension in the public schema

When self-hosting, the timescaledb extension may be installed in an arbitrary
schema. Timescale only supports installing the timescaledb extension in the
`public` schema. How to go about resolving this depends heavily on the 
particular details of the source schema and the migration approach chosen.

## Tablespaces

Timescale does not support using custom tablespaces. Providing the 
`--no-tablespaces` flag to pg_dump and pg_restore when dumping/restoring the
schema will result in all objects being in the default tablespace as desired.

## Only one database per instance

While postgres clusters can contain many databases, Timescale instances are 
limited to a single database. When migrating a cluster with multiple databases
to Timescale, one can either migrate each source database to a separate 
Timescale instance or "merge" source databases to target schemas.

## Superuser privileges

The tsdbadmin database user is the most powerful available on Timescale, but it
is not a true superuser. Review your application for use of superuser privileged
operations and mitigate before migrating.