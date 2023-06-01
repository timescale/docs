---
title: High availability
excerpt: Learn about high availability
products: [self_hosted]
keywords: [high availability]
---

import ConsiderCloud from "versionContent/_partials/_consider-cloud.mdx";

# Replication and high availability

PostgreSQL relies on replication for high availability, failover, and balancing
read loads across multiple nodes. Replication ensures that data written to the
primary PostgreSQL database is mirrored on one or more nodes. By virtue of
having multiple nodes with an exact copy of the primary database available, the
primary database can be replaced with a replica node in the event of a failure
or outage on the primary server. Replica nodes can also be used as read only
databases, also called read replicas, allowing reads to be horizontally
scaled by spreading the read query volume across multiple nodes.

*   [Learn about high availability][about-ha] to understand how it works
    before you begin using it.
*   [Configure replication][replication-enable].

<ConsiderCloud />

[about-ha]: /self-hosted/:currentVersion:/replication-and-ha/about-ha/
[replication-enable]: /self-hosted/:currentVersion:/replication-and-ha/configure-replication/
