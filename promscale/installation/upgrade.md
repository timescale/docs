# Upgrade Promscale

## Generic upgrade notes

Promscale consists of the Promscale Connector, and the Promscale PostgreSQL
extension. You may need to upgrade both of these components. Please refer to 
the upgrade notes for a specific version of the Promscale Connector for more
details.

The general upgrade procedure is as follows:

- Ensure that the most recent required version of the Promscale extension is
  available on your system.
- Stop all Promscale Connector instances which are connected to the database.
- Start the new version of the Promscale Connector, wait for it to begin
  ingesting data.
- Start all other Promscale Connector instances.

## Release-specific upgrade notes

Here we provide additional details and notes for each new version of Promscale.

### Promscale 0.11.0

We've made a number of major changes in Promscale 0.11.0, so upgrading to it
requires additional caution. We've prepared some steps to guide you through
the upgrade process.

<highlight type="note">
This release contains quite a few changes relative to the previous version.
We suggest testing the upgrade and making a backup.
</highlight>

<highlight type="warning">
Previous tracing data will be dropped when you upgrade.
</highlight>

#### Overview

The following is a high-level overview major changes in 0.11.0.

- The Promscale extension is now mandatory, and must be installed at
  version 0.5.0 or above.
- The minimum supported TimescaleDB version is now 2.6.1.
- The upgrade could take up to 5-10 minutes on very large databases. During
  that time Promscale will not be able to ingest or query data.
- This upgrade modifies many database objects. On large deployments, you may 
  need to increase the PostgreSQL `max_locks_per_transaction` parameter before
  starting the upgrade.

#### Promscale PostgreSQL extension

Before starting the upgrade please make sure that you have made version 0.5.0
of the Promscale extension available to PostgresSQL. Follow the Promscale
[installation instructions](install-promscale) for your preferred installation
method. _Do not_ run `ALTER EXTENSION promscale UPDATE;`, the Promscale
Connector must do this.

You will also need TimescaleDB extension version 2.6.1 or above available.

#### Tuning max_locks_per_transaction

If you were already operating Promscale for a while, and have a large number of
metrics then upgrading to Promscale 0.11.0 requires taking a lock on a large
number of tables. If PostgreSQL has not been correctly configured for this, the
process may fail with the following error (as seen in either the PostgreSQL or
Promscale Connector logs): `ERROR: out of shared memory (SQLSTATE 53200)`.

##### Background

This error arises because postgres has a limited amount of shared memory
available to store locks on objects. The size of this memory is determined by:
`max_locks_per_transaction` * (`max_connections` + `max_prepared_transactions`).
By increasing `max_locks_per_transaction`, you increase the amount of shared
memory available to all connections.

Unfortunately, the number of locks which will be taken is not fixed, but is
proportional to the number of metrics ingested, and the time period for which
those metrics are stored (in TimescaleDB parlance, the number of _hypertables_
and _chunks_).

##### Mitigation

<highlight type="note">
These instructions assume that the Promscale Connector running the upgrade
process is the only process connected to the database. Should this not be the
case, you may need to provide some additional headroom by increasing the
suggested value of `max_locks_per_transaction`.
</highlight>

Determine the new minimum value for `max_locks_per_transaction` using the
following query, and configure this value in `postgresql.conf`. Once you have
upgraded to Promscale 0.11.0, you can set the value of
`max_locks_per_transaction` back to what it was before the upgrade.

<highlight type="note">
Modifying `max_locks_per_transaction` requires restarting PostgreSQL.
</highlight>

```SQL
WITH max_objects_touched AS (
        SELECT 400 + count(*) as max_objects_touched
        FROM pg_class
                 JOIN pg_namespace n ON n.oid = pg_class.relnamespace
        WHERE n.nspname <> 'pg_catalog'
          AND n.nspname !~ '^pg_toast'
          AND n.nspname <> 'information_schema'
    ),
    max_conns AS (
        SELECT SUM(setting::INTEGER) as max_conns FROM pg_settings WHERE name IN ('max_connections', 'max_prepared_transactions')
    )
SELECT max_objects_touched/max_conns AS max_locks_per_transaction FROM max_objects_touched, max_conns;
```

[install-promscale]: promscale/:currentVersion:/installation