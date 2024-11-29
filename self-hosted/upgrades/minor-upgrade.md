---
title: Minor TimescaleDB upgrades
excerpt: Upgrade self-hosted TimescaleDB to a new minor version
products: [self_hosted]
keywords: [upgrades]
---

import PlanUpgrade from "versionContent/_partials/_plan_upgrade.mdx";
import ConsiderCloud from "versionContent/_partials/_consider-cloud.mdx";
import CheckVersions from "versionContent/_partials/_migrate_self_postgres_check_versions.mdx";
import PlanMigrationPath from "versionContent/_partials/_migrate_self_postgres_plan_migration_path.mdx";
import ImplementMigrationPath from "versionContent/_partials/_migrate_self_postgres_implement_migration_path.mdx";

# Upgrade TimescaleDB to a minor version

A minor upgrade is when you update from TimescaleDB `<major version>.x`, to TimescaleDB `<major version>.y`. 
A major upgrade is when you update from TimescaleDB `X.<minor version>` to `Y.<minor version>`.  
You can run different versions of TimescaleDB on different databases within the same PostgreSQL instance.
This process uses the PostgreSQL `ALTER EXTENSION` function to upgrade TimescaleDB independently on different 
databases.

<ConsiderCloud />

This page shows you how to perform a minor upgrade, for major upgrades, see [Upgrade TimescaleDB to a major version][upgrade-major].

## Prerequisites

- Install the PostgreSQL client tools on your migration machine. This includes `psql`, and `pg_dump`.
- Read [the release notes][relnotes] for the version of TimescaleDB that you are upgrading to.
- Backup your database. Although TimescaleDB and PostgreSQL upgrades are performed in-place, upgrading is an 
    intrusive operation. In case of disaster, [create a database backup][backup], and ensure that the backup 
    is readable.

## Check the TimescaleDB and PostgreSQL versions

<CheckVersions />

## Plan your upgrade path

<PlanMigrationPath />

## Implement your upgrade path

<ImplementMigrationPath />

You have completed the upgrade process.

[relnotes]: https://github.com/timescale/timescaledb/releases
[upgrade-pg]: /self-hosted/:currentVersion:/upgrades/upgrade-pg/#upgrade-postgresql
[upgrade-major]: /self-hosted/:currentVersion:/upgrades/major-upgrade/
[backup]: /self-hosted/:currentVersion:/backup-and-restore/
