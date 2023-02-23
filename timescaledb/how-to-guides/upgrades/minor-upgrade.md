---
title: Minor TimescaleDB upgrades
excerpt: Upgrade within the same major version of TimescaleDB
keywords: [upgrades]
---

import PlanUpgrade from 'versionContent/_partials/_plan_upgrade.mdx';

# Minor TimescaleDB upgrades

A minor upgrade is when you upgrade within your current major version of
TimescaleDB. For example, when you upgrade from TimescaleDB&nbsp;2.5, to
TimescaleDB&nbsp;2.6.

For upgrading to a new major version, for example upgrading from
TimescaleDB&nbsp;1 to TimescaleDB&nbsp;2, see the
[major upgrades section][upgrade-major].

## Plan your upgrade

<PlanUpgrade />

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

</Procedure>

[upgrade-major]: /timescaledb/:currentVersion:/how-to-guides/upgrades/major-upgrade/
