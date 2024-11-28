---
title: Minor TimescaleDB upgrades
excerpt: Upgrade within the same major version of TimescaleDB
products: [self_hosted]
keywords: [upgrades]
---

import PlanUpgrade from "versionContent/_partials/_plan_upgrade.mdx";
import ConsiderCloud from "versionContent/_partials/_consider-cloud.mdx";
import SupportMatrix from "versionContent/_partials/_migrate-self-postgres-timescaledb-compatibility.mdx";

# Upgrade TimescaleDB to a minor version

A minor upgrade is when you update from TimescaleDB <major version>.x, to TimescaleDB <major version>.y. 
A major upgrade is when you update from TimescaleDB X.<minor version> to Y.<minor version>. This page shows
you how to perform a minor upgrade, for major upgrades, see [Upgrade TimescaleDB to a major version][upgrade-major].

<ConsiderCloud />

## Plan your upgrade

<PlanUpgrade />

## Upgrade to a minor version

1. **Check the versions of TimescaleDB and Postgres that you are currently running**

   1.  Connect to your Postgres deployment:
       ```shell
       export SOURCE=postgres://<user>:<password>@<source host>:<source port>/<db_name>
       psql -d $SOURCE
        ```

   1.  Retrieve the version of Postgres that you are running:
       ```shell
       SELECT version();
       ```
       Postgres returns something like:
       ```shell
       -----------------------------------------------------------------------------------------------------------------------------------------
       PostgreSQL 17.2 (Ubuntu 17.2-1.pgdg22.04+1) on aarch64-unknown-linux-gnu, compiled by gcc (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0, 64-bit
       (1 row)
       ```
       
   1.  Retrieve the version of TimescaleDB that you are running:
       ```sql
       \dx timescaledb
       ```
       Postgres returns something like:
       ```shell
           Name     | Version |   Schema   |                             Description
       -------------+---------+------------+---------------------------------------------------------------------
       timescaledb | x.y.z   | public     | Enables scalable inserts and complex queries for time-series data
       (1 row)
       ```       

1. Choose your migration path. 

   Check the following support matrix and choose your upgrade path. For example, to 
   upgrade from TimescaleDB 2.13 on PostgreSQL 13 to TimescaleDB 2.17 you need to upgrade
   TimescaleDB to v2.16, then upgrade PostgreSQL to v14 or higher, then upgrade TimescaleDB
   to v2.17. 


1. Upgrade to your chosen version of TimescaleDB

  1. Upgrade TimescaleDB to the desired version in your current PostgreSQL installation.
     ```sql
     psql -X -d $SOURCE -c "ALTER EXTENSION timescaledb UPDATE TO '<version number>';"
     ```
  1. If necessary, upgrade PostgreSQL to the desired version.
  1. If necessary, upgrade TimescaleDB to the desired version

## Upgrade TimescaleDB to the next minor version

This upgrade uses the PostgreSQL `ALTER EXTENSION` function to upgrade to the
latest version of the TimescaleDB extension. TimescaleDB supports having
different extension versions on different databases within the same PostgreSQL
instance. This allows you to upgrade extensions independently on different
databases. Run the `ALTER EXTENSION` function on each database to upgrade them
individually.

<Procedure>

### Upgrading the TimescaleDB extension

1.  Connect to psql using the `-X` flag. This prevents any `.psqlrc` commands
   from accidentally triggering the load of a previous TimescaleDB version on
   session startup.
1.  At the psql prompt, upgrade the TimescaleDB extension. This must be the first
   command you execute in the current session:

    ```sql
    ALTER EXTENSION timescaledb UPDATE;
    ```

1.  Check that you have upgraded to the latest version of the extension with the
   `\dx` command. The output should show the upgraded version number.

    ```sql
    \dx timescaledb
    ```

   <Highlight type="note">
    To upgrade TimescaleDB in a Docker container, see the
    [Docker container upgrades](/self-hosted/latest/upgrades/upgrade-docker) 
    section.
   </Highlight>

</Procedure>

[upgrade-major]: /self-hosted/:currentVersion:/upgrades/major-upgrade/
