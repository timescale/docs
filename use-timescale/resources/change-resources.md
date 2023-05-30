---
title: Manually change resources
excerpt: Manually adjust your service resources
products: [cloud]
keywords: [services, operation, storage]
tags: [disk space, resources, oom, memory]
cloud_ui:
    path:
        - [services, :serviceId, operations, resources]
---

# Manually change resources

You can manually change both storage and compute resources.

## Storage resources

When you change the disk size, the changes are applied with no downtime. The
new size generally becomes available within a few seconds. You can only increase
your disk size, not decrease it, up to a maximum of 16&nbsp;TB.

Though your new storage is available within seconds, it needs to be optimized
behind the scenes. Optimization takes anywhere from 6 to 24 hours for each
terabyte of data. Allow enough time for optimization to finish before scaling
your service again. You must wait at least 6 hours, even if your service is
smaller than 1&nbsp;TB.

<Highlight type="warning">
If you resize your service again while your previous resize is still optimizing,
the second resize fails. For more information on storage optimization, see the
[Amazon Elastic Block Store](https://aws.amazon.com/premiumsupport/knowledge-center/ebs-volume-stuck-optimizing-on-modification/)
documentation. To prevent this, wait for the recommended time between resizes.
</Highlight>

## Compute resources

You can change the CPU and memory allocation for your service at any time, with
minimal downtime, usually less than thirty seconds. The new resources become
available as soon as the service restarts. You can change the CPU and memory
allocation up or down, as frequently as required.

<Highlight type="warning">
Changing your compute settings usually requires a short downtime. Make sure you
plan for this before you begin!
</Highlight>

<Procedure>

### Changing resource allocations manually

1.  In the Timescale console, from the `Services` list, click the name of
    the service you want to modify.
1.  In the `Service details` page, navigate to the `Operations` tab, and click
    `Resources`.
1.  In the `Resize CPU / memory` field, select the new CPU and memory
    allocation.
1.  In the `Increase disk size` field, adjust the slider to the new disk size.
1.  Review the new allocations and costs in the comparison chart.
1.  Click `Apply` to save your changes. If you have changed the CPU and memory
    allocation, your service goes down briefly while the changes are applied.
    <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-resources-changed-apply.png" alt="Configure resource allocations"/>

</Procedure>

## Storage recovery

If you have reached the maximum size allowable in your Timescale service,
read-only mode is automatically applied. If you need to perform actions on your
database to reduce your data usage, you can turn off read-only mode. For
example, you need read-write access if you want to compress data, delete rows or
tables, or drop old data using data retention policies.

<Highlight type="warning">
Do not manually enable read-write access on a database that is over 99%
capacity. Increase the disk size before you enable read-write access.
Alternatively, you can enable read-write access on an individual session, while
leaving the database in read-only mode.
</Highlight>

<Procedure>

### Enabling read-write access on an individual session

1.  Connect to your database using `psql` and turn off read-only protection
    for the current session:

    ```sql
    SET default_transaction_read_only TO off;
    ```

1.  Create a data retention policy to only retain, for example, data for 90
    days. This starts working immediately on old data:

    ```sql
    SELECT add_retention_policy('<table_name>', interval '90 days');
    ```

1.  Turn on compression:

    ```sql
    ALTER TABLE <table_name> SET (
      timescaledb.compress,
      timescaledb.compress_segmentby = '<type>'
    );
    SELECT add_compression_policy('<table_name>', interval '1 day');
    ```

</Procedure>

As soon as the storage consumption drops below the threshold, the read-only
protection is automatically removed, and you can start writing data again.

## Out of memory errors

If you run intensive queries on your Timescale services, you might
encounter out of memory (OOM) errors. This occurs if your query consumes more
memory than is available.

When this happens, an `OOM killer` process shuts down PostgreSQL processes using
`SIGKILL` commands, until the memory usage falls below the upper limit. Because
this kills the entire server process, it usually requires a restart. To
prevent service disruption caused by OOM errors, Timescale attempts to
shut down only the query that caused the problem. This means that the
problematic query does not run, but that your PostgreSQL service continues to
operate normally.

If the normal OOM killer is triggered, the error log looks like this:

```yml
2021-09-09 18:15:08 UTC [560567]:TimescaleDB: LOG: server process (PID 2351983) was terminated by signal 9: Killed
```

Wait for the entire service to come back online before reconnecting.

If Timescale successfully guards the service against the OOM killer, it shuts
down only the client connection that was using too much memory. This prevents
the entire PostgreSQL service from shutting down, so you can reconnect
immediately. The error log looks like this:

```yml
2022-02-03 17:12:04 UTC [2253150]:TimescaleDB: tsdbadmin@tsdb,app=psql [53200] ERROR: out of memory
```

[autoscaling]: /use-timescale/:currentVersion:/services/autoscaling/
