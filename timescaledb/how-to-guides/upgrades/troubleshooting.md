---
title: Troubleshooting TimescaleDB updates
excerpt: Troubleshoot common problems experienced with upgrading your TimescaleDB installation
keywords: [upgrade, troubleshooting]
---

# Troubleshooting TimescaleDB updates
This section contains some ideas for troubleshooting common problems experienced
with updating your TimescaleDB installation.

<!---
* Keep this section in alphabetical order
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
-->

## Upgrading fails with an error saying `no update path`
In some cases, when you use the `ALTER EXTENSION timescaledb UPDATE` command to
upgrade, it might fail with an error like this:

```sql
ERROR: extension "timescaledb" has no update path from version "2.5.2" to version "2.6.1"
```

This occurs if the list of available extensions does not include the version you
are trying to upgrade to, and it can occur if the package was not installed
correctly in the first place. To correct the problem, install the upgrade
package, restart PostgreSQL, verify the version, and then attempt the upgrade
again.

## Upgrading fails with an error that reads `old version has already been loaded`
When you use the `ALTER EXTENSION timescaledb UPDATE` command to upgrade, and an
error appears that reads:

```sql
ERROR: extension "timescaledb" cannot be updated after the old version has already been loaded
```
This error occurs sometimes when you do not run `ALTER EXTENSION timescaledb
UPDATE` command as the first command after starting a new session using psql
or if you use tab completion when running the command. Tab completion triggers
metadata queries in the background which prevents the alter extension from being
the first command.

To correct the problem, start a new session using psql and run this command:

``sql
psql -X -c 'ALTER EXTENSION timescaledb UPDATE;'
```