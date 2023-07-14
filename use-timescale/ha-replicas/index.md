---
title: High availability and replicas
excerpt: Set up high availability for disaster recovery in Timescale
products: [cloud]
keywords: [high availability, replicas]
tags: [failover, replication, ha]
cloud_ui:
    path:
        - [services, :serviceId, operations, replication]
---

# High availability and replicas

You can use high availability and read replicas on your Timescale services
to significantly reduce the risk of downtime and data loss due to failures, and
to more effectively scale the limits of your service.

HA replicas in Timescale are exact, up-to-date copies of your database
that automatically take over operations if your primary becomes unavailable,
including during maintenance.

Read replicas can create an isolated environment to run heavy analytical
queries, so that you don't need to run them on a production instance, and risk
impacting performance.

*   Creating an [HA replica][ha-replica] in Timescale
*   Creating a [read replica][read-replica] in Timescale

If you are using Managed Service for TimescaleDB, see the
[Managed Service for TimescaleDB failover section][mst-failover].

If you are using self-hosted TimescaleDB, see the
[self-hosted HA section][self-hosted-ha].

[ha-replica]: /use-timescale/:currentVersion:/ha-replicas/high-availability/
[read-replica]: /use-timescale/:currentVersion:/ha-replicas/read-scaling/
[mst-failover]: /mst/:currentVersion:/failover/
[self-hosted-ha]: /self-hosted/:currentVersion:/replication-and-ha/
