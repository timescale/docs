# Maintenance tasks

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