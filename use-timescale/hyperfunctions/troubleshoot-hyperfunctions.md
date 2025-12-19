---
title: Troubleshooting hyperfunctions and TimescaleDB Toolkit
excerpt: Troubleshoot common problems experienced with hyperfunctions and TimescaleDB Toolkit
products: [cloud, mst, self_hosted]
keywords: [hyperfunctions, Toolkit, troubleshooting]
---

# Troubleshooting hyperfunctions and $TOOLKIT_LONG

This section contains some ideas for troubleshooting common problems experienced
with hyperfunctions and $TOOLKIT_SHORT.

<!---
* Keep this section in alphabetical order
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
-->

## Updating the $TOOLKIT_SHORT extension fails with an error saying `no update path`

In some cases, when you create the extension, or use the `ALTER EXTENSION timescaledb_toolkit UPDATE` command to
update the $TOOLKIT_SHORT extension, it might fail with an error like this:

```sql
ERROR:  extension "timescaledb_toolkit" has no update path from version "1.2" to version "1.3"
```

This occurs if the list of available extensions does not include the version you
are trying to upgrade to, and it can occur if the package was not installed
correctly in the first place. To correct the problem, install the upgrade
package, restart $PG, verify the version, and then attempt the update
again.

<Procedure>

#### Troubleshooting $TOOLKIT_SHORT setup

1.  If you're installing $TOOLKIT_SHORT from a package, check your package manager's
    local repository list. Make sure the $TIMESCALE_DB repository is available and
    contains $TOOLKIT_SHORT. For instructions on adding the $TIMESCALE_DB repository, see
    the installation guides:
    *   [Debian/Ubuntu installation guide][deb-install]
    *   [RHEL/CentOS installation guide][deb-install]
1.  Update your local repository list with `apt update` or `yum update`.
1.  Restart your $PG service.
1.  Check that the right version of $TOOLKIT_SHORT is among your available extensions:

    ```sql
    SELECT * FROM pg_available_extensions
      WHERE name = 'timescaledb_toolkit';
    ```

    The result should look like this:

    ```
    -[ RECORD 1 ]-----+--------------------------------------------------------------------------------------
    name              | timescaledb_toolkit
    default_version   | 1.6.0
    installed_version | 1.6.0
    comment           | Library of analytical hyperfunctions, time-series pipelining, and other SQL utilities
    ```

1.  Retry `CREATE EXTENSION` or `ALTER EXTENSION`.

</Procedure>

[deb-install]: /self-hosted/:currentVersion:/install/installation-linux/
