---
title: Uninstall TimescaleDB
excerpt: Uninstall TimescaleDB
products: [self_hosted]
keywords: [uninstall]
---

# Uninstall TimescaleDB

PostgreSQL is designed to be easily extensible. The extensions loaded into the
database can function just like features that are built in. TimescaleDB extends
PostgreSQL for time-series data, giving PostgreSQL the high-performance,
scalability, and analytical capabilities required by modern data-intensive
applications. If you installed TimescaleDB with Homebrew or MacPorts, you can
uninstall it without having to uninstall PostgreSQL.

<Procedure>

## Uninstalling TimescaleDB using Homebrew

1.  At the `psql` prompt, remove the TimescaleDB extension:

    ```sql
    DROP EXTENSION timescaledb;
    ```

1.  At the command prompt, remove `timescaledb` from `shared_preload_libraries`
    in the `postgresql.conf` configuration file:

    ```bash
    nano /opt/homebrew/var/postgresql@14/postgresql.conf
    shared_preload_libraries = ''
    ```

1.  Save the changes to the `postgresql.conf` file.

1.  Restart PostgreSQL:

    ```bash
    brew services restart postgresql
    ```

1.  Check that the TimescaleDB extension is uninstalled by using the `\dx`
    command at the `psql` prompt. Output is similar to:

    ```sql
    tsdb-# \dx
                                          List of installed extensions
        Name     | Version |   Schema   |                            Description
    -------------+---------+------------+-------------------------------------------------------------------
     plpgsql     | 1.0     | pg_catalog | PL/pgSQL procedural language
    (1 row)
    ```

1.  Uninstall TimescaleDB:

    ```bash
    brew uninstall timescaledb
    ```

1.  Remove all the dependencies and related files:

    ```bash
    brew remove timescaledb
    ```

</Procedure>

<Procedure>

## Uninstalling TimescaleDB using MacPorts

1.  At the `psql` prompt, remove the TimescaleDB extension:

    ```sql
    DROP EXTENSION timescaledb;
    ```

1.  At the command prompt, remove `timescaledb` from `shared_preload_libraries`
    in the `postgresql.conf` configuration file:

    ```bash
    nano /opt/homebrew/var/postgresql@14/postgresql.conf
    shared_preload_libraries = ''
    ```

1.  Save the changes to the `postgresql.conf` file.

1.  Restart PostgreSQL:

    ```bash
    port reload postgresql
    ```

1.  Check that the TimescaleDB extension is uninstalled by using the `\dx`
    command at the `psql` prompt. Output is similar to:

    ```sql
    tsdb-# \dx
                                          List of installed extensions
        Name     | Version |   Schema   |                            Description
    -------------+---------+------------+-------------------------------------------------------------------
     plpgsql     | 1.0     | pg_catalog | PL/pgSQL procedural language
    (1 row)
    ```

1.  Uninstall TimescaleDB and the related dependencies:

    ```bash
    port uninstall timescaledb --follow-dependencies
    ```

</Procedure>
