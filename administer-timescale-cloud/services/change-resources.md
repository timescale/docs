---
title: Manually change compute resources
excerpt: Manually adjust your service resources
products: [cloud]
keywords: [services, operation, storage]
tags: [disk space, resources, oom, memory]
cloud_ui:
    path:
        - [services, :serviceId, operations, resources]
---

import UsageBasedStorage from "versionContent/_partials/_usage-based-storage-intro.mdx";

# Resources

<UsageBasedStorage />

Timescale allows you to resize compute (CPU/RAM) resources independently at any
time. You can resize compute in the Timescale console for any service, with a
short downtime.

Because compute changes require an interruption to your service, plan
accordingly so that the settings are applied during an appropriate service
window.

## Compute resources

You can change the CPU and memory allocation for your service at any time, with
minimal downtime, usually less than thirty seconds. The new resources become
available as soon as the service restarts. You can change the CPU and memory
allocation up or down, as frequently as required.

There is momentary downtime while the new compute settings are applied. In most
cases, this downtime is less than 30 seconds.

When you change resource settings, the current and new charges are displayed
immediately so that you can verify how the changes impact your costs.

<Highlight type="warning">
Changing your compute settings usually requires a short downtime. Make sure you
plan for this before you begin.
</Highlight>

<Procedure>

### Changing resource allocations manually

1.  In the Timescale console, from the `Services` list, click the name of
    the service you want to modify.
1.  In the `Service details` page, navigate to the `Operations` tab, and click
    `Compute`.
1.  In the `Change CPU/Memory` field, select the new CPU and memory
    allocation.
1.  Review the new allocations and costs in the comparison chart.
1.  Click `Apply` to save your changes. Your service goes down briefly while the
    changes are applied.

    <img class="main-content__illustration"
    src="https://assets.timescale.com/docs/images/tsc-resources-changed.webp"
    width={1375} height={944}
    alt="Changing Timescale service compute size" />

</Procedure>

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
