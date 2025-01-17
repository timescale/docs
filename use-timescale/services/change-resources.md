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

# Manually change compute resources

<UsageBasedStorage />

You use [$CONSOLE][cloud-login] to resize the compute (CPU/RAM) resources available to your
$SERVICE_LONGs at any time, with a short downtime.

## Update compute resources for a $SERVICE_LONG

You can change the CPU and memory allocation for your $SERVICE_LONG at any time with
minimal downtime, usually less than a minute. The new resources become available as soon as 
the service restarts. You can change the CPU and memory allocation up or down, as frequently as required. 

![Change resources](https://assets.timescale.com/docs/images/console-update-resources.png)

There is momentary downtime while the new compute settings are applied. In most cases, this is 
less than a minute. However, Before making changes to your service, best practice
is to enable [HA replication][high-availability] on the service. When you resize a service with HA enabled,
$CLOUD_LONG:

1. Resizes the replica.
1. Waits for the replica to catch up.
1. Performs a switchover to the resized replica.
1. Restarts the primary.

HA reduce downtime in the case of resizes or maintenance window restarts, from a minute or so to a couple of seconds.

When you change resource settings, the current and new charges are displayed
immediately so that you can verify how the changes impact your costs.

<Highlight type="warning">

Because compute changes require an interruption to your $SERVICE_LONGs, plan accordingly so that the
settings are applied during an appropriate service window.

</Highlight>

<Procedure>

1. In [$CONSOLE][services-portal], choose the $SERVICE_SHORT to modify.
1. Click `Operations`, then click `Compute`.
1. Select the new `CPU / Memory` allocation.
    You see the allocation and costs in the comparison chart
1. Click `Apply`. 
    Your service goes down briefly while the changes are applied.

</Procedure>

## Out of memory errors

If you run intensive queries on your $SERVICE_LONGs, you might
encounter out of memory (OOM) errors. This occurs if your query consumes more
memory than is available.

When this happens, an `OOM killer` process shuts down PostgreSQL processes using
`SIGKILL` commands until the memory usage falls below the upper limit. Because
this kills the entire server process, it usually requires a restart. 

To prevent service disruption caused by OOM errors, $CLOUD_LONG attempts to
shut down only the query that caused the problem. This means that the
problematic query does not run, but that your $SERVICE_LONG continues to
operate normally.

* If the normal OOM killer is triggered, the error log looks like this:

   ```yml
   2021-09-09 18:15:08 UTC [560567]:TimescaleDB: LOG: server process (PID 2351983) was terminated by signal 9: Killed
   ```
   
   Wait for the $SERVICE_LONG to come back online before reconnecting.

* $CLOUD_LONG shuts the client connection only 
  
  If $CLOUD_LONG successfully guards the $SERVICE_SHORT against the OOM killer, it shuts
  down only the client connection that was using too much memory. This prevents
  the entire $SERVICE_LONG from shutting down, so you can reconnect immediately. The error log looks like this:

   ```yml
   2022-02-03 17:12:04 UTC [2253150]:TimescaleDB: tsdbadmin@tsdb,app=psql [53200] ERROR: out of memory
   ```

[cloud-login]: https://console.cloud.timescale.com/
[high-availability]: /use-timescale/:currentVersion:/ha-replicas/high-availability/
[services-portal]: https://console.cloud.timescale.com/dashboard/services
