---
title: Upgrade PostgreSQL
excerpt: Upgrade PostgreSQL to a new version
products: [self_hosted]
keywords: [upgrades, PostgreSQL, versions, compatibility]
---

import PlanUpgrade from "versionContent/_partials/_plan_upgrade.mdx";
import ConsiderCloud from "versionContent/_partials/_consider-cloud.mdx";
import PlanMigrationPath from "versionContent/_partials/_migrate_self_postgres_plan_migration_path.mdx";

# Upgrade PostgreSQL

TimescaleDB is a PostgreSQL extension. Ensure that you upgrade to compatible versions of TimescaleDB and PostgreSQL. 

<ConsiderCloud />


||PostgreSQL&nbsp;17|PostgreSQL&nbsp;16|PostgreSQL&nbsp;15|PostgreSQL&nbsp;14|PostgreSQL&nbsp;13|PostgreSQL&nbsp;12|PostgreSQL&nbsp;11|PostgreSQL&nbsp;10|PostgreSQL&nbsp;9.6|
|-|-|-|-|-|-|-|-|-|
|TimescaleDB&nbsp;2.17 and higher|&#9989;|&#9989;|&#9989;|&#9989;|&#10060;|&#10060;|&#10060;|&#10060;|&#10060;|
|TimescaleDB&nbsp;2.16 and higher|&#10060;|&#9989;|&#9989;|&#9989;|&#10060;|&#10060;|&#10060;|&#10060;|&#10060;|&#10060;|
|TimescaleDB&nbsp;2.15 and higher|&#10060;|&#9989;|&#9989;|&#9989;|&#9989;|&#10060;|&#10060;|&#10060;|&#10060;|&#10060;|
|TimescaleDB&nbsp;2.14 and higher|&#10060;|&#9989;|&#9989;|&#9989;|&#9989;|&#10060;|&#10060;|&#10060;|&#10060;|&#10060;|
|TimescaleDB&nbsp;2.13 and higher|&#10060;|&#9989;|&#9989;|&#9989;|&#9989;|&#10060;|&#10060;|&#10060;|&#10060;|
|TimescaleDB&nbsp;2.12 and higher|&#10060;|&#10060;|&#9989;|&#9989;|&#9989;|&#10060;|&#10060;|&#10060;|&#10060;|
|TimescaleDB&nbsp;2.10 and higher|&#10060;|&#10060;|&#9989;|&#9989;|&#9989;|&#9989;|&#10060;|&#10060;|&#10060;|
|TimescaleDB&nbsp;2.5 to 2.9|&#10060;|&#10060;|&#10060;|&#9989;|&#9989;|&#9989;|&#10060;|&#10060;|&#10060;|
|TimescaleDB&nbsp;2.4|&#10060;|&#10060;|&#10060;|&#10060;|&#9989;|&#9989;|&#10060;|&#10060;|&#10060;|
|TimescaleDB&nbsp;2.1 to 2.3|&#10060;|&#10060;|&#10060;|&#10060;|&#9989;|&#9989;|&#9989;|&#10060;|&#10060;|
|TimescaleDB&nbsp;2.0|&#10060;|&#10060;|&#10060;|&#10060;|&#10060;|&#9989;|&#9989;|&#10060;|&#10060;
|TimescaleDB&nbsp;1.7|&#10060;|&#10060;|&#10060;|&#10060;|&#10060;|&#9989;|&#9989;|&#9989;|&#9989;|

<PlanUpgrade />

## Plan your upgrade path

<PlanMigrationPath />

## Upgrade your PostgreSQL instance

You use [`pg_upgrade`][pg_upgrade] to upgrade PostgreSQL in-place. `pg_upgrade` allows you to retain
the data files of your current PostgreSQL installation while binding the new PostgreSQL binary runtime 
to them. 

<Procedure>

1. **Find the location of the PostgreSQL binary**

   Set the `OLD_BIN_DIR` environment variable to the folder holding the `postgres` binary. 
   For example, `which postgres` returns something like `/usr/lib/postgresql/16/bin/postgres`.
   ```bash
   export OLD_BIN_DIR=/usr/lib/postgresql/16/bin
   ``` 

1. **Set your connection string**

   This variable holds the connection information for the database to upgrade:

   ```bash
   export SOURCE="postgres://<user>:<password>@<source host>:<source port>/<db_name>"
   ```

1. **Retrieve the location of the PostgreSQL data folder**

    Set the `OLD_DATA_DIR` environment variable to the value returned by the following:
    ```shell
    psql -d "$SOURCE" -c "SHOW data_directory ;" 
    ```
    PostgreSQL returns something like:
    ```shell
    ----------------------------
    /home/postgres/pgdata/data
    (1 row)
    ```        

1. **Choose the new locations for the PostgreSQL binary and data folders**

   For example:
    ```shell
    export NEW_BIN_DIR=/usr/lib/postgresql/17/bin
    export NEW_DATA_DIR=/home/postgres/pgdata/data-17
    ```        
1. Using psql, perform the upgrade:

    ```sql
    pg_upgrade -b $OLD_BIN_DIR -B $NEW_BIN_DIR -d $OLD_DATA_DIR -D $NEW_DATA_DIR
    ```

</Procedure>

If you are moving data to a new physical instance of PostgreSQL, you can use `pg_dump` and `pg_restore`
to dump your data from the old database, and then restore it into the new, upgraded, database. For more 
information, see the [backup and restore section][backup].

[backup]: /self-hosted/:currentVersion:/backup-and-restore/
[pg-relnotes]: https://www.postgresql.org/docs/release/
[pg_upgrade]: https://www.postgresql.org/docs/current/static/pgupgrade.html
[postgres-breaking-change]: https://www.postgresql.org/about/news/postgresql-172-166-1510-1415-1318-and-1222-released-2965/
[upgrade-pg]: /self-hosted/:currentVersion:/upgrades/upgrade-pg/#upgrade-postgresql
