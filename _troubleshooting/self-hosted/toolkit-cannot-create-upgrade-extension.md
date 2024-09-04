---
title: Install or upgrade of TimescaleDB Toolkit fails
section: troubleshooting
products: [self_hosted]
topics: [installation, hyperfunctions, upgrades]
errors:
  - language: sql
    message: |-
      ERROR: extension "timescaledb_toolkit" has no update path from version "1.2" to version "1.3"
keywords: [hyperfunctions, Toolkit, installation, upgrades, updates]
---

{/*
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
*/}

In some cases, when you create the TimescaleDB Toolkit extension, or upgrade it
with the `ALTER EXTENSION timescaledb_toolkit UPDATE` command, it might fail
with the above error.

This occurs if the list of available extensions does not include the version you
are trying to upgrade to, and it can occur if the package was not installed
correctly in the first place. To correct the problem, install the upgrade
package, restart PostgreSQL, verify the version, and then attempt the update
again.

<Procedure>

### Troubleshooting TimescaleDB Toolkit setup

1.  If you're installing Toolkit from a package, check your package manager's
    local repository list. Make sure the TimescaleDB repository is available and
    contains Toolkit. For instructions on adding the TimescaleDB repository, see
    the installation guides:
    *   [Linux installation guide][linux-install]
1.  Update your local repository list with `apt update` or `yum update`.
1.  Restart your PostgreSQL service.
1.  Check that the right version of Toolkit is among your available extensions:

    ```sql
    SELECT * FROM pg_available_extensions
      WHERE name = 'timescaledb_toolkit';
    ```

    The result should look like this:

    ```bash
    -[ RECORD 1 ]-----+--------------------------------------------------------------------------------------
    name              | timescaledb_toolkit
    default_version   | 1.6.0
    installed_version | 1.6.0
    comment           | Library of analytical hyperfunctions, time-series pipelining, and other SQL utilities
    ```

1.  Retry `CREATE EXTENSION` or `ALTER EXTENSION`.

</Procedure>

[linux-install]: /self-hosted/latest/install/installation-linux/
