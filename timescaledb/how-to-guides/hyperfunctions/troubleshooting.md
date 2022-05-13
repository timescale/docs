# Troubleshooting hyperfunctions and TimescaleDB Toolkit
Learn how to troubleshoot errors with hyperfunctions and TimescaleDB Toolkit.

## Common errors
Find solutions for common errors.

### Problem setting up TimescaleDB Toolkit
If `CREATE EXTENSION timescaledb_toolkit` or `ALTER EXTENSION
timescaledb_toolkit` fails, try:

<procedure>

#### Troubleshooting TimescaleDB Toolkit setup
1.  If you're installing Toolkit from a package, check your package manager's
    local repository list. Make sure the TimescaleDB repository is available and
    contains Toolkit. For instructions on adding the TimescaleDB repository, see
    the installation guides:
    *   [Debian/Ubuntu installation guide][deb-install]
    *   [RHEL/CentOS installation guide][rhel-install]
1.  Update your local repository list with `apt update` or `yum update`.
1.  Restart your PostgreSQL service.
1.  Check that the right version of Toolkit is among your available extensions:
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

</procedure>

[deb-install]: /install/:currentVersion:/self-hosted/installation-debian/
[rhel-install]: /install/:currentVersion:/self-hosted/installation-redhat/
