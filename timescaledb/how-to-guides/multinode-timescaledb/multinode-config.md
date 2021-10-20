# Multi-node configuration
In addition to the
[regular TimescaleDB configuration][timescaledb-configuration], we recommend
that you also configure additional settings specific to multi-node operation.

## Update settings
Each of these settings can be configured in the `postgresql.conf` file on the
individual node. The `postgresql.conf` file is usually in the `data` directory,
but you can locate the correct path by connecting to the node with `psql` and
giving this command:
```sql
SHOW config_file;
```

After you have modified the `postgresql.conf` file, reload the configuration to
see your changes:
```bash
pg_ctl reload
```

<!--these need a better structure --LKB 2021-10-20-->
### `max_prepared_transactions`
If not already set, ensure that `max_prepared_transactions` is a non-zero value
on all data nodes. We recommend setting it to `150` as a starting point.

### `enable_partitionwise_aggregate`
On the access node, set the `enable_partitionwise_aggregate` parameter to `on`.
This ensures that queries are pushed down to the data nodes, and improves query
performance.

### `jit`
On the access node, set `jit` to `off`. Currently, JIT does not work well with
distributed queries. However, you can enable JIT on the data nodes succssfully.

### `statement_timeout`
On the data nodes, disable `statement_timeout`. If you need to enable this,
enable and configure it on the access node only. This setting is disabled by
default in PostgreSQL, but can be useful if your specific environment is suited.

### `wal_level`
On the data nodes, set the `wal_level` to `logical` or higher to
[move][move_chunk] or [copy][copy_chunk] chunks between data nodes. If you
are moving many chunks in parallel, consider increasing `max_wal_senders` and
`max_replication_slots` as well.

### Transaction isolation level
For consistency, if the transaction isolation level is set to `READ COMMITTED`
it is automatically upgraded to `REPEATABLE READ` whenever a distributed
operation occurs. If the isolation level is `SERIALIZABLE`, it is not changed.

## Maintenance tasks
A distributed transaction runs across multiple data nodes, and can remain in a
non-completed state if a data node reboots or experiences temporary issues. The
access node keeps a log of distributed transactions so that nodes that haven't
completed their part of the distributed transaction can complete it later when
they become available. This transaction log requires regular cleanup to remove
transactions that have completed, and complete those that haven't.

We highly recommended that you configure the access node to run a maintenance
job that regularly cleans up any unfinished distributed transactions.

The custom maintenance job can be run as a user-defined action. For example:
```sql
CREATE OR REPLACE PROCEDURE data_node_maintenance(job_id int, config jsonb)
LANGUAGE SQL AS
$$
    SELECT _timescaledb_internal.remote_txn_heal_data_node(fs.oid)
    FROM pg_foreign_server fs, pg_foreign_data_wrapper fdw
    WHERE fs.srvfdw = fdw.oid
    AND fdw.fdwname = 'timescaledb_fdw';
$$;

SELECT add_job('data_node_maintenance', '5m');
```

You can use `cron` or another scheduling system outside the database to run
the maintenance job on a regular schedule. Make sure that the job is scheduled
separately for each database that contains distributed hypertables.


[timescaledb-configuration]: /how-to-guides/configuration/
[copy_chunk]: /api/:currentVersion:/distributed-hypertables/copy_chunk_experimental
[move_chunk]: /api/:currentVersion:/distributed-hypertables/move_chunk_experimental
