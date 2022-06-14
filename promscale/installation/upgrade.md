# Upgrade Promscale
Promscale consists of the Promscale Connector, and the Promscale Database. The
Promscale Database is PostgreSQL with the TimescaleDB and the Promscale
extensions. When you upgrade your Promscale installation, you need to check both
the Connector and the Database. This section contains important information
about upgrading.

The process for updating your Promscale installation is:

1.  Check that the most recent required versions of PostgreSQL, TimescaleDB and
the Promscale extension are available.
1.  Stop all Promscale Connector instances connected to the database.
1.  Start one instance with the new version of the Promscale Connector.
1.  Start all other Promscale Connector instances.

## Upgrade to Promscale 0.11.0
Promscale 0.11.0 contains significant changes, and the upgrade drops any
previous tracing data you have stored. Make a backup of your installation, and
test the new version, before you go ahead with this upgrade.

Upgrading to Promscale 0.11.0 could take up to 5-10 minutes on very large
databases. During the upgrade, Promscale does not ingest or query data.

The upgrade process modifies a lot of database objects. On large deployments,
you might need to increase the PostgreSQL `max_locks_per_transaction` parameter
before you start the upgrade. For more information, see [Transaction
locks][transaction-locks].

<highlight type="warning"> When you upgrade to Promscale 0.11.0, all previous
tracing data is dropped. Make a backup of your installation, and test the new
version before you upgrade. </highlight>

<procedure>

### Upgrading to Promscale 0.11.0
To upgrade to Promscale 0.11.0 you must have installed PostgreSQL 12 or later,
TimescaleDB 2.6.1 or later, and Promscale extension version 0.5.0 or later. 

1. Check the version of PostgreSQL that is installed:
   ```sql
   SHOW server_version;
   ``` 
1. Check the version of TimescaleDB and Promscale that is installed:
   ```sql
   SELECT extname, extversion FROM pg_extension WHERE extname IN ('timescaledb', 'promscale');
   ```
   For information about upgrading TimescaleDB and PostgreSQL, see [Update TimescaleDB][update-timescaledb] and [Upgrade PostgreSQL][upgrade-postgresql].
1. Stop all Promscale Connector instances connected to the database.
1. Update the Promscale extension on one instance using the Promscale Connector.
   For more information, see the [Promscale installation
   instructions][install-promscale] for various installation method.
   <highlight type="note"> Do not use the `ALTER EXTENSION promscale UPDATE;` command. to update the extension.
   </highlight>
1. Start one instance with the latest version of the Promscale Connector. The migration happens automatically. After the migration is completed, upgrade the remaining Promscale Connector instances.
1. Start the other instances of Promscale Connector.

</procedure>

Upgrading to Promscale 0.11.0 creates a lock on your tables. If you have been
using Promscale for a while, and you have a large number of metrics, this could
result in locking a large number of tables. If PostgreSQL has not been correctly
configured for this, the process could fail with an error similar to:

```yml
ERROR: out of shared memory (SQLSTATE 53200)`.
```

This error occurs because PostgreSQL has a limited amount of shared memory
available to store locks on objects. You can increase the amount of shared
memory available by increasing the `max_locks_per_transaction` parameter. When
you have completed the upgrade, you can set the value back to what it was before
the upgrade. For more information about tuning this parameter, see
[troubleshooting Promscale][max-locks-config].

[install-promscale]: promscale/:currentVersion:/installation
[max-locks-config]: promscale/:currentVersion:/troubleshooting/#data-is-occupying-too-much-space
[transaction-locks]: timescaledb/:currentVersion:/how-to-guides/configuration/about-configuration/#transaction-locks
[update-timescaledb]: timescaledb/:currentVersion:/how-to-guides/update-timescaledb/#update-timescaledb
[upgrade-postgresql]: timescaledb/:currentVersion:/how-to-guides/update-timescaledb/upgrade-postgresql/