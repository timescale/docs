---
title: Multi-node maintenance tasks
excerpt: How to maintain your multi-node instance
products: [self_hosted]
keywords: [multi-node, maintenance]
tags: [manage]
---

# Multi-node maintenance tasks

Various maintenance activities need to be carried out for effective
upkeep of the distributed multi-node setup. You can use `cron` or
another scheduling system outside the database to run these below
maintenance jobs on a regular schedule if you prefer. Also make sure
that the jobs are scheduled separately for each database that contains
distributed hypertables.

## Maintaining distributed transactions

A distributed transaction runs across multiple data nodes, and can remain in a
non-completed state if a data node reboots or experiences temporary issues. The
access node keeps a log of distributed transactions so that nodes that haven't
completed their part of the distributed transaction can complete it later when
they become available. This transaction log requires regular cleanup to remove
transactions that have completed, and complete those that haven't.
We highly recommended that you configure the access node to run a maintenance
job that regularly cleans up any unfinished distributed transactions.

The custom maintenance job can be run as a user-defined action. For example:

<Tabs title="Custom Maintenance Job">
<Tab title="TimescaleDB >= 2.12">

```sql
CREATE OR REPLACE PROCEDURE data_node_maintenance(job_id int, config jsonb)
LANGUAGE SQL AS
$$
    SELECT _timescaledb_functions.remote_txn_heal_data_node(fs.oid)
    FROM pg_foreign_server fs, pg_foreign_data_wrapper fdw
    WHERE fs.srvfdw = fdw.oid
    AND fdw.fdwname = 'timescaledb_fdw';
$$;

SELECT add_job('data_node_maintenance', '5m');
```

</Tab>

<Tab title="TimescaleDB < 2.12">

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

</Tab>
</Tabs>

## Statistics for distributed hypertables

On distributed hypertables, the table statistics need to be kept updated.
This allows you to efficiently plan your queries. Because of the nature of
distributed hypertables, you can't use the `auto-vacuum` tool to gather
statistics. Instead, you can explicitly ANALYZE the distributed hypertable
periodically using a maintenance job, like this:

```sql
CREATE OR REPLACE PROCEDURE distributed_hypertables_analyze(job_id int, config jsonb)
LANGUAGE plpgsql AS
$$
DECLARE r record;
BEGIN
FOR r IN SELECT hypertable_schema, hypertable_name
              FROM timescaledb_information.hypertables
              WHERE is_distributed ORDER BY 1, 2
LOOP
EXECUTE format('ANALYZE %I.%I', r.hypertable_schema, r.hypertable_name);
END LOOP;
END
$$;

SELECT add_job('distributed_hypertables_analyze', '12h');
```

You can merge the jobs in this example into a single maintenance job
if you prefer. However, analyzing distributed hypertables should be
done less frequently than remote transaction healing activity. This
is because the former could analyze a large number of remote chunks
everytime and can be expensive if called too frequently.
