# Upgrade Promscale
Promscale consists of the Promscale Connector, and the Promscale Database. The Promscale Database
is PostgreSQL with the TimescaleDB and the Promscale extensions. When you upgrade your Promscale installation, you need to check both
components. This section contains important information about upgrading.

The process for updating your Promscale installation is:

1.  Check that the most recent required version of the Promscale extension is
    available.
1.  Stop all Promscale Connector instances connected to the database.
1.  Perform the upgrade.
1.  Start the new version of the Promscale Connector, and wait for it to begin
    ingesting data.
1.  Start all other Promscale Connector instances.

## Upgrade to Promscale 0.11.0
Promscale&nbsp;0.11.0 contains significant changes, and the upgrade drops any
previous tracing data you have stored. Make a backup of your installation, and
test the new version, before you go ahead with this upgrade.

Upgrading to Promscale&nbsp;0.11.0 could take up to 5-10 minutes on very large
databases. During the upgrade, Promscale is not able to ingest or query data.

The upgrade process modifies a lot of database objects. On large deployments,
you might need to increase the PostgreSQL `max_locks_per_transaction` parameter
before you start the upgrade.

<highlight type="warning">
When you upgrade to Promscale&nbsp;0.11.0, all previous tracing data is
dropped. Make a backup of your installation, and test the new version
before you upgrade.
</highlight>

You must have installed PostgreSQL 12 or later and TimescaleDB 2.6.1 or later.

The Promscale extension is now mandatory. You must be using version 0.5.0 or
later. Before you start the upgrade, make sure that you have made the most
recent version of the Promscale extension available to PostgresSQL. You must use
the Promscale Connector to update the extension, do not use the
`ALTER EXTENSION promscale UPDATE;` command. For more information on how to do
this, see the [Promscale installation instructions][install-promscale] for your
preferred installation method.

Upgrading to Promscale&nbsp;0.11.0 requires creating a lock on your tables. If
you have been using Promscale for a while, and you have a large number of
metrics, this could result in locking a large number of tables. If PostgreSQL
has not been correctly configured for this, the process could fail with an error
like this:

```yml
ERROR: out of shared memory (SQLSTATE 53200)`.
```

This error occurs because PostgreSQL has a limited amount of shared memory
available to store locks on objects. You can increase the amount of shared
memory available by increasing the `max_locks_per_transaction` parameter. When
you have completed the upgrade, you can set the value back to what it was before
the upgrade. For more information about tuning this parameter, see
[troubleshooting Promscale][max-locks-config].

<procedure>

### Upgrading to Promscale&nbsp;0.11.0
<!--- Insert procedure here -->

</procedure>


[install-promscale]: promscale/:currentVersion:/installation
[max-locks-config]: promscale/:currentVersion:/troubleshooting/#data-is-occupying-too-much-space
