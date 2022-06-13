---
topic: high availability
section: index
featured: true # whether to feature the topic on the home page
order:
  # listing pages here should be optional
  # the splash/index page should pull in all pages with the right topic under these sections
  # but sometimes we need to force an order that makes logical sense
  - learn:
    - timescaledb/how-to-guides/replication-and-ha/about-ha
  - do:
    - timescaledb/how-to-guides/replication-and-ha/configure-replication
---

# High availability
PostgreSQL relies on replication for high availability, failover, and balancing
read loads across multiple nodes. Replication ensures that data written to the
primary PostgreSQL database is mirrored on one or more nodes. By virtue of
having multiple nodes with an exact copy of the primary database available, the
primary database can be replaced with a replica node in the event of a failure
or outage on the primary server. Replica nodes can also be used as read only
databases (sometimes called "read replicas"), allowing reads to be horizontally
scaled by spreading the read query volume across multiple nodes.
