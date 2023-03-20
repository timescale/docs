---
title: Service operation - Resources
excerpt: Manage your service resources
products: [cloud]
keywords: [services, operation, storage]
tags: [disk space, resources, oom, memory]
cloud_ui:
    path:
        - [services, :serviceID, operations, resources]
---

# Service operation - Resources

Timescale Cloud contains several mechanisms for managing disk space on your
services. There are four key tasks that Cloud performs to handle disk space:

1.  Detect if storage capacity begins to fill up
1.  Notify you about the growth of storage consumption
1.  Automatically activate overload protections
1.  Allow you to return your database to a normal state

By default, Timescale Cloud services have autoscaling enabled. Autoscaling
automatically increases your disk size, up to a maximum amount, as you fill the
disk. For more information about autoscaling, including instructions for setting
the maximum limit, or turning autoscaling off, see the
[autoscaling][autoscaling] section.

<Highlight type="cloud" header="Sign up for Timescale Cloud" button="Try for free">
</Highlight>

## Online storage resizing

You can increase your storage size in the Timescale Cloud console.

<Highlight type="warning">
You can only increase your service's storage once every six hours, and you
cannot currently decrease your storage size once set.
</Highlight>

<Procedure>

### Increasing service resources

1.  In the Timescale Cloud console, navigate to `Services` and click the service
    you want to adjust. Navigate to the `Operations` tab, and go to
    the `Resources` section.
1.  Adjust the sliders for CPU and disk size as required. If you increase the
    disk size past a certain point, you should also consider increasing the CPU
    size to handle the increased disk size, although this is not required.
1.  Review the new sizes and costs in the panel on the right-hand side, and
    click `Restart and apply` when you are happy with the changes.
1.  The resources take a few seconds to increase, and when the increase is
    complete, your database is immediately available on the new resources. If
    your database is in read-only mode, the read-only protection is
    automatically removed, and you can begin writing data immediately.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-resources-changed.png" alt="Timescale Cloud change resources"/>

</Procedure>

## Storage recovery

If you need to perform actions on your database to reduce your data usage, you
can turn off read-only mode. For example, you need read-write access if you want
to compress data, delete rows or tables, or drop old data using data retention
policies.

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

If you run intensive queries on your Timescale Cloud services, you might
encounter out of memory (OOM) errors. This occurs if your query consumes more
memory than is available.

When this happens, an `OOM killer` process shuts down PostgreSQL processes using
`SIGKILL` commands, until the memory usage falls below the upper limit. Because
this kills the entire server process, it usually requires a restart. To
prevent service disruption caused by OOM errors, Timescale Cloud attempts to
shut down only the query that caused the problem. This means that the
problematic query does not run, but that your PostgreSQL service continues to
operate normally.

If the normal OOM killer is triggered, the error log looks like this:

```yml
2021-09-09 18:15:08 UTC [560567]:TimescaleDB: LOG: server process (PID 2351983) was terminated by signal 9: Killed
```

Wait for the entire service to come back online before reconnecting.

If Timescale Cloud successfully guards the service against the OOM killer, it shuts
down only the client connection that was using too much memory. This prevents
the entire PostgreSQL service from shutting down, so you can reconnect
immediately. The error log looks like this:

```yml
2022-02-03 17:12:04 UTC [2253150]:TimescaleDB: tsdbadmin@tsdb,app=psql [53200] ERROR: out of memory
```

[autoscaling]: /use-timescale/:currentVersion:/services/autoscaling/
