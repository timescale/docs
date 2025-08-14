---
title: High availability and read replication
excerpt: Tiger Cloud enables you to reduce the risk of service downtime and power read-intensive apps with database replication. Learn about the available replication types
products: [cloud]
keywords: [high availability, replicas]
tags: [failover, replication, ha]
cloud_ui:
    path:
        - [services, :serviceId, operations, replication]
---


# High availability and read replication

In $CLOUD_LONG, replicas are copies of the primary data instance in a $SERVICE_LONG. 
If your primary becomes unavailable, $CLOUD_LONG automatically fails over to your HA replica.

The replication strategies offered by $CLOUD_LONG are:

- [High Availability(HA) replicas][ha-replica]: significantly reduce the risk of downtime and data 
  loss due to system failure, and enable $SERVICE_SHORTs to avoid downtime during routine maintenance.

- [Read replicas][read-replica]: safely scale a $SERVICE_SHORT to power your read-intensive
  apps and business intelligence tooling and remove the load from the primary data instance.
- 
For $MST_SHORT, see [Failover in $MST_LONG][mst-failover]. 
For $SELF_LONG, see [Replication and high availability][self-hosted-ha].

## Rapid recovery

By default, all $SERVICE_SHORTs have rapid recovery enabled.

Because compute and storage are handled separately in $CLOUD_LONG, $SERVICE_SHORTs recover 
quickly from compute failures, but usually need a full recovery from backup for storage failures.

- **Compute failure**: the most common cause of database failure. Compute failures
can be caused by hardware failing, or through things like unoptimized queries,
causing increased load that maxes out the CPU usage. In these cases, data on disk is unaffected 
and only the compute and memory needs replacing. $CLOUD_LONG recovery immediately provisions 
new compute infrastructure for the $SERVICE_SHORT and mounts the existing storage to the new node. Any WAL 
that was in memory then replays. This process typically only takes thirty seconds. However, 
depending on the amount of WAL that needs replaying this may take up to twenty minutes. Even in the 
worst-case scenario, $CLOUD_LONG recovery is an order of magnitude faster than a standard recovery 
from backup. 

- **Storage failure**: in the rare occurrence of disk failure, $CLOUD_LONG automatically
[performs a full recovery from backup][backup-recovery].

If CPU usage for a $SERVICE_SHORT runs high for long periods of time, issues such as WAL archiving getting queued 
behind other processes can occur. This can cause a failure and could result in a larger data loss. 
To avoid data loss, $SERVICE_SHORTs are monitored for this kind of scenario.

[ha-replica]: /use-timescale/:currentVersion:/ha-replicas/high-availability/
[read-replica]: /use-timescale/:currentVersion:/ha-replicas/read-scaling/
[mst-failover]: /mst/:currentVersion:/failover/
[self-hosted-ha]: /self-hosted/:currentVersion:/replication-and-ha/
[backup-recovery]: /use-timescale/:currentVersion:/backup-restore/
