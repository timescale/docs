# Multi-node maintenance tasks
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
