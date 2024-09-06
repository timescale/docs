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

[ha-replica]: /use-timescale/:currentVersion:/ha-replicas/high-availability/
[read-replica]: /use-timescale/:currentVersion:/ha-replicas/read-scaling/
[mst-failover]: /mst/:currentVersion:/failover/
[self-hosted-ha]: /self-hosted/:currentVersion:/replication-and-ha/
