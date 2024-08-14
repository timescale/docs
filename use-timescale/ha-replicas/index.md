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

In <Variable name="CLOUD" /> high availability replicas are exact, up-to-date copies of the primary data instance in 
your <Variable name="SERVICE_LONG" /> (<Variable name="SERVICE_SHORT" />). If your primary becomes unavailable, <Variable name="CLOUD" /> automatically 
fails over to your HA replica. You use high availability and read replicas to:

- Significantly reduce the risk of downtime and data loss.
- More effectively scale the limits of your <Variable name="SERVICE_LONG" />.
- Create an isolated environment to run heavy analytical queries rather than compromise performance on your production 
  instance.

This section shows you how to:

* Reduce the risk of downtime and data loss with [HA replication][ha-replica]
* Safely scale a <Variable name="SERVICE_LONG" /> using [read replica][read-replica]


For <Variable name="MST_SHORT" />, see [Failover in <Variable name="MST_LONG" />][mst-failover]. 
For <Variable name="SELF_LONG" />, see [Replication and high availability][self-hosted-ha].

[ha-replica]: /use-timescale/:currentVersion:/ha-replicas/high-availability/
[read-replica]: /use-timescale/:currentVersion:/ha-replicas/read-scaling/
[mst-failover]: /mst/:currentVersion:/failover/
[self-hosted-ha]: /self-hosted/:currentVersion:/replication-and-ha/
