---
title: Downgrade to a previous version of TimescaleDB
excerpt: Roll back to an older version of TimescaleDB
products: [self_hosted]
keywords: [upgrades]
---

import ConsiderCloud from "versionContent/_partials/_consider-cloud.mdx";

# Downgrade to a previous version of TimescaleDB

If you upgrade to a new TimescaleDB version and encounter problems, you can roll
back to a previously installed version. This works in the same way as a minor
upgrade.

Downgrading is not supported for all versions. Generally, downgrades between
patch versions and between consecutive minor versions are supported. For
example, you can downgrade from TimescaleDB 2.5.2 to 2.5.1, or from 2.5.0 to
2.4.2. To check whether you can downgrade from a specific version, see the
[release notes][relnotes].

<ConsiderCloud />

## Plan your downgrade

You can downgrade your on-premise TimescaleDB installation in-place. This means
that you do not need to dump and restore your data. However, it is still
important that you plan for your downgrade ahead of time.

Before you downgrade:

*   Read [the release notes][relnotes] for the TimescaleDB version you are
  downgrading to.
*   Check which PostgreSQL version you are currently running. You might need to
  [upgrade to the latest PostgreSQL version][upgrade-pg]
  before you begin your TimescaleDB downgrade.
*   [Perform a backup][backup] of your database. While TimescaleDB
  downgrades are performed in-place, downgrading is an intrusive operation.
  Always make sure you have a backup on hand, and that the backup is readable in
  the case of disaster.

## Downgrade TimescaleDB to a previous minor version

This downgrade uses the PostgreSQL `ALTER EXTENSION` function to downgrade to
the latest version of the TimescaleDB extension. TimescaleDB supports having
different extension versions on different databases within the same PostgreSQL
instance. This allows you to upgrade and downgrade extensions independently on
different databases. Run the `ALTER EXTENSION` function on each database to
downgrade them individually.

<Highlight type="important">
The downgrade script is tested and supported for single-step downgrades. That
is, downgrading from the current version, to the previous minor version.
Downgrading might not work if you have made changes to your database between
upgrading and downgrading.
</Highlight>

<Procedure>

### Downgrading the TimescaleDB extension

1.  Connect to psql using the `-X` flag. This prevents any `.psqlrc` commands
   from accidentally triggering the load of a previous TimescaleDB version on
   session startup.
1.  At the psql prompt, downgrade the TimescaleDB extension. This must be the
   first command you execute in the current session:

    ```sql
    ALTER EXTENSION timescaledb UPDATE TO '<PREVIOUS_VERSION>';
    ```

    For example:

    ```sql
    ALTER EXTENSION timescaledb UPDATE TO '2.5.1';
    ```

1.  Check that you have downgraded to the correct version of the extension with
   the `\dx` command. The output should show the downgraded version number.

    ```sql
    \dx timescaledb
    ```

</Procedure>

[backup]: /self-hosted/:currentVersion:/backup-and-restore/
[relnotes]: /about/:currentVersion:/release-notes/
[upgrade-pg]: /self-hosted/:currentVersion:/upgrades/upgrade-pg/
