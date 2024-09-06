---
title: High availability and read replicas
excerpt: Set up high availability for disaster recovery in Timescale
products: [cloud]
keywords: [high availability, replicas]
tags: [failover, replication, ha]
cloud_ui:
    path:
        - [services, :serviceId, operations, replication]
---

# High availability and read replicas

In Timescale Cloud, replicas are copies of the primary data instance in a Timescale Cloud Service. 
If your primary becomes unavailable, Timescale Cloud automatically fails over to your HA replica.

The replication strategies offered by Timescale Cloud are:

- [High Availability(HA) replicas][ha-replica]: significantly reduce the risk of downtime and data 
  loss due to system failure, and enable services to avoid downtime during routine maintenance.

- [Read replicas][read-replica]: safely scale a Timescale Cloud Service to power your read-intensive
  apps and business intelligence tooling and remove load from the primary data instance.


For MST, see [Failover in Managed Service for TimescaleDB][mst-failover]. 
For Self-hosted, see [Replication and high availability][self-hosted-ha].

## Rapid recovery

By default, all Timescale Cloud services have rapid recovery enabled.

Because compute and storage are handled separately in Timescale Cloud, services recover 
quickly from compute failures, but usually need a full recovery from backup for storage failures.

- **Compute failure**: the most common cause of database failure. Compute failures
can be caused by hardware failing, or through things like unoptimized queries,
causing increased load that maxes out the CPU usage. In these cases, data on disk is unaffected 
and only the compute and memory needs replacing. Timescale Cloud recovery immediately provisions 
new compute infrastructure for the service and mounts the existing storage to the new node. Any WAL 
that was in memory then replays. This process typically only takes thirty seconds. However, 
depending on the amount of WAL that needs replaying this may take up to twenty minutes. Even in the 
worst-case scenario, Timescale Cloud recovery is an order of magnitude faster than a standard recovery 
from backup. 

- **Storage failure**: in the rare occurrence of disk failure, Timescale Cloud automatically
[performs a full recovery from backup][backup-recovery].

If CPU usage for a service runs high for long periods of time, issues such as WAL archiving getting queued 
behind other processes can occur. This can cause a failure and could result in a larger data loss. 
To avoid data loss, Timescale Cloud services are monitored for this kind of scenario.



[ha-replica]: /use-timescale/:currentVersion:/ha-replicas/high-availability/
[read-replica]: /use-timescale/:currentVersion:/ha-replicas/read-scaling/
[mst-failover]: /mst/:currentVersion:/failover/
[self-hosted-ha]: /self-hosted/:currentVersion:/replication-and-ha/
[backup-recovery]: /use-timescale/:currentVersion:/backup-restore/backup-restore-cloud/
