---
title: Migrate from Multi-node to TimescaleDB
excerpt: Migrate an entire multi-node deployment to a TimescaleDB instance with downtime using COPY
products: [cloud]
keywords: [migration, downtime]
tags: [migration, multi-node, timescaledb]
---

import SourceTargetNote from "versionContent/_partials/_migrate_source_target_note.mdx";
import SetupSourceTarget from "versionContent/_partials/_migrate_set_up_source_and_target.mdx";
import OpenSupportRequest from "versionContent/_partials/_migrate_open_support_request.mdx"
import DumpDatabaseRoles from "versionContent/_partials/_migrate_dual_write_dump_database_roles.mdx";
import UsingParallelCopy from "versionContent/_partials/_migrate_using_parallel_copy.mdx";
import UsingPostgresCopy from "versionContent/_partials/_migrate_using_postgres_copy.mdx";
import PostSchemaEtal from "versionContent/_partials/_migrate_post_schema_caggs_etal.mdx";

# Migrate from Multi-node to TimescaleDB

The following instructions show you how to move your data from a self-hosted
TimescaleDB Multi-node deployment to a Timescale instance using `pg_dump` and `psql`.
To not lose any data, applications which connect to the database should be taken
offline. The duration of the migration is proportional to the amount of data
stored in your database. Should you wish to migrate more than 400 GB of data with
this method, open a support request to ensure that enough disk is pre-provisioned
on your Timescale instance.

<OpenSupportRequest />

<SourceTargetNote />

## Prerequisites

For minimal downtime, the `pg_dump` and `psql` commands should be run from a machine
with a low-latency, high-throughput link to the database that they are connected to.

Before you begin, ensure that you have:

- Installed the PostgreSQL client libraries on the machine that you will
  perform the migration from, you will require `pg_dump` and `psql`.
- [Created a database service in Timescale].
- Checked that all PostgreSQL extensions you use are available on Timescale.
  For more information, see the [list of compatible extensions].
- Checked that the version of PostgreSQL in your target database is greater
  than or equal to that of the source database.
- Checked that you're running the exact same version of Timescale on both your
  target and source databases (the major/minor/patch version must all be the
  same). For more information, see the [upgrade instructions] for self-hosted
  TimescaleDB.

[Created a database service in Timescale]: /use-timescale/:currentVersion:/services/create-a-service/
[list of compatible extensions]: /use-timescale/:currentVersion:/extensions/
[upgrade instructions]: /self-hosted/:currentVersion:/upgrades/about-upgrades/

## Migrate roles from source to target

<DumpDatabaseRoles />

<SetupSourceTarget />

## Migrate schema pre-data

Migrate your pre-data from your source database to TimescaleDB instance. This
includes table and schema definitions, as well as information on sequences,
owners, and settings. This doesn't include Timescale-specific schemas.

<Procedure>

### Migrating schema pre-data

1.  Dump the schema pre-data from your source database into a `dump_pre_data.dump` file, using
    your source database connection details. Exclude Timescale-specific schemas.
    If you are prompted for a password, use your source database credentials:

    ```bash
    pg_dump -U <SOURCE_DB_USERNAME> -W \
    -h <SOURCE_DB_HOST> -p <SOURCE_DB_PORT> -Fc -v \
    --section=pre-data --exclude-schema="_timescaledb*" \
    -f dump_pre_data.dump <DATABASE_NAME>
    ```

1.  Restore the dumped data from the `dump_pre_data.dump` file into your Timescale
    database, using your Timescale connection details. To avoid
    permissions errors, include the `--no-owner` flag:

    ```bash
    pg_restore -U tsdbadmin -W \
    -h <HOST> -p <PORT> --no-owner -Fc \
    -v -d tsdb dump_pre_data.dump
    ```

</Procedure>

## Restore hypertables in TimescaleDB instance

After pre-data migration, your distributed hypertables from your source database
become regular PostgreSQL tables. Recreate them as regular hypertables
in TimescaleDB instance to restore them. 

<Highlight type="note">
Distributed hypertables are typically created with additional
[space dimensions][space-partitioning]. While they might make sense to allow
distribution of data across data nodes these additional dimensions might not be
useful in standard single node deployments. So, it might be worthwhile to
consider dropping these space dimensions when converting distributed hypertables
into regular hypertables.
</Highlight>

<Procedure>

### Restoring hypertables in Timescale

1.  Connect to your Timescale database:

    ```bash
    psql "postgres://tsdbadmin:<PASSWORD>@<HOST>:<PORT>/tsdb?sslmode=require"
    ```

1.  Restore the hypertable:

    ```sql
    SELECT create_hypertable(
       '<TABLE_NAME>', '<TIME_COLUMN_NAME>',
        chunk_time_interval =>
            INTERVAL '<CHUNK_TIME_INTERVAL>');
    ```

</Procedure>

## Copy data from the source database

After restoring your hypertables, return to your source database to copy your
data, table by table.

<Procedure>

### Copying data from your source database

1.  Connect to your source database:

    ```bash
    psql "postgres://<SOURCE_DB_USERNAME>:<SOURCE_DB_PASSWORD>@<SOURCE_DB_HOST>:<SOURCE_DB_PORT>/<SOURCE_DB_NAME>?sslmode=require"
    ```

1.  Dump the data from the first table into a `.csv` file:

    ```sql
    \copy (SELECT * FROM <TABLE_NAME>) TO <TABLE_NAME>.csv CSV
    ```

    Repeat for each table and distributed hypertable you want to migrate.

</Procedure>

<Highlight type="note">
If your distributed hypertables are very large, you can migrate each distributed
hypertable in multiple pieces. Split each distributed hypertable by time range,
and copy each range individually. For example:

```sql
\copy (SELECT * FROM <TABLE_NAME> WHERE time > '2021-11-01' AND time < '2011-11-02') TO <TABLE_NAME_DATE_RANGE>.csv CSV
```

</Highlight>

## Restore data into TimescaleDB instance

When you have copied your data into `.csv` files, you can restore it to
TimescaleDB instance by copying from the `.csv` files. There are two methods: using
regular PostgreSQL [`COPY`][copy], or using the TimescaleDB
[`timescaledb-parallel-copy`][timescaledb-parallel-copy] function. The `timescaledb-parallel-copy`
tool is not included by default. You must install the tool.

<UsingParallelCopy />

<UsingPostgresCopy />

<PostSchemaEtal />

[space-partitioning]: /use-timescale/:currentVersion:/hypertables/about-hypertables#space-partitioning
[copy]: https://www.postgresql.org/docs/9.2/sql-copy.html
[extensions]: /use-timescale/:currentVersion:/extensions/
[install-selfhosted]: /self-hosted/:currentVersion:/install/
[pg_dump]: https://www.postgresql.org/docs/current/app-pgdump.html
[pg_restore]: https://www.postgresql.org/docs/current/app-pgrestore.html
[psql]: /use-timescale/:currentVersion:/integrations/query-admin/about-psql/
[timescaledb-parallel-copy]: https://github.com/timescale/timescaledb-parallel-copy
[upgrading-postgresql]: https://kb-managed.timescale.com/en/articles/5368016-perform-a-postgresql-major-version-upgrade
[upgrading-postgresql-self-hosted]: /self-hosted/:currentVersion:/upgrades/upgrade-pg/
[upgrading-timescaledb]: /self-hosted/:currentVersion:/upgrades/major-upgrade/
