# Multi-node configuration
In addition to the [normal configuration for
TimescaleDB][configuration], we recommend the following settings that
are specific to multi-node operation:

* `max_prepared_transactions` must be set to a non-zero value on all
data nodes (if not already set, `150` is recommended).
* `enable_partitionwise_aggregate` should be set to `on` on the access
  node for good query performance. Otherwise, queries will not be
  pushed down to the data nodes.
* `jit` should be set to `off` on the access node as JIT currently
  doesn't work well with distributed queries. JIT can still be enabled
  on the data nodes.
* `statement_timeout` should be disabled on the data nodes and managed
  through the access node configuration if desired. This setting is disabled
  by default in PostgreSQL, but may be worth verifying in your specific
  environment.
* Set the `wal_level` to `logical` or higher on data nodes to 
  [move][move_chunk] or [copy][copy_chunk] chunks between
  data nodes. If you are moving many chunks in parallel, consider 
  increasing `max_wal_senders` and `max_replication_slots`.
* For consistency, if the transaction isolation level is set to `READ COMMITTED` it is
  automatically upgraded to `REPEATABLE READ` whenever a distributed operation
  takes place. If the isolation level is `SERIALIZABLE`, it is not changed.

Each of the above settings parameters can be configured for the
instance in `postgresql.conf`, typically located in the data
directory. If the file isn't there, connect to the node (`psql`) and
get the path with:

```sql
SHOW config_file;
```

Note that it will be necessary to reload the configuration if modified.

```bash
pg_ctl reload
```


## Maintenance tasks

It is highly recommended that the access node is configured to run a
maintenance job that regularly "heals" any non-completed distributed
transactions. A distributed transaction ensures atomic execution
across multiple data nodes and can remain in a non-completed state in
case a data node reboots or experiences temporary issues. The access
node keeps a log of distributed transactions so that nodes that
haven't yet completed their part of the distributed transaction can
later complete it at the access node's request. The log requires
regular cleanup to "garbage collect" transactions that have completed
and heal those that haven't. The maintenance job can be run as a
user-defined action (custom job):


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

It is also possible to schedule this job to run from outside the
database, e.g, via a CRON job. Note that the job must be scheduled
separately for each database that contains distributed hypertables.

[configuration]: /how-to-guides/configuration
[copy_chunk]: /api/:currentVersion:/distributed-hypertables/copy_chunk_experimental
[move_chunk]: /api/:currentVersion:/distributed-hypertables/move_chunk_experimental
