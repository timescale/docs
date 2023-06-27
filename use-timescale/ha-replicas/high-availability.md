---
title: High availability
excerpt: Set up HA replicas on Timescale for high availability
products: [cloud]
keywords: [high availability, replicas]
tags: [failover, availability zones, replication, wal]
cloud_ui:
    path:
        - [services, :serviceId, operations, replication]
---

import CloudTrial from "versionContent/_partials/_cloudtrial.mdx";

# High availability

All Timescale services come with a rapid recovery feature enabled by
default. Rapid recovery ensures that all services experience minimal downtime
and data loss in the most common failure scenarios and during maintenance. For
services with very low tolerance for downtime, Timescale offers high
availability (HA) replicas. HA replicas significantly reduce the risk of
downtime and data loss due to failures, and allow a service to avoid downtime
for routine maintenance. This section will cover how each of these work to help
you make an informed decision about which is right for your service.

<CloudTrial />

## HA replicas

HA replicas in Timescale are exact, up-to-date copies of your database
that automatically take over operations if your primary becomes unavailable,
including during maintenance. HA replicas also have a unique address that you
can use to serve read requests.  In technical terms, HA replicas are multi-AZ,
asynchronous hot standbys. They use streaming replication to minimize the chance
of data loss during failover. We break these terms down at the end of this
article.

### Maintenance downtime

Some operations on your database cannot avoid downtime, such as upgrading a
major version of PostgreSQL. For routine maintenance, like upgrading to a new
minor version of PostgreSQL, a service restart may be required, but this will
only happen during the Maintenance Window set by the user.

Adding an HA replica to your service prevents downtime during maintenance
events, as maintenance is applied to each node individually. For example, your
replica may have maintenance performed on it while the primary remains
operational; once it is completed, the replica is promoted to the primary while
the (former) primary node undergoes maintenance.

## Create a database replica

<Highlight type="warning">
If your service was created before June 2022, adding a replica may cause your
service to restart. Restarts typically take about one minute to complete.
</Highlight>

<Procedure>

### Creating an HA replica

1.  [Log in to your Timescale account][cloud-login] and click the service
    you want to replicate.
1.  Navigate to the `Operations` tab, and select `High availability`.
1.  Check the pricing of the replica, and click `Add a replica`. Confirm the
    action by clicking `Add replica`.
1.  You can see the replicas for each service by clicking on the service name,
    navigating to the `Operations` tab, and selecting `High availability`. Replicas
    are not shown in the main `Services` section, as they are not independent.
1.  You can see connection information for the replica by navigating to the
    `Overview` tab. In the `Connection info` section, select the replica from
    the `Role` drop down menu to populate the section with the replica's
    connection details.

<img
class="main-content__illustration"
src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-replication-add.png"
alt="Creating a database replica in Timescale"
/>

</Procedure>

## Failover

Failover (and switchover) is the process of redirecting traffic from your
primary to the HA replica within 15 seconds of the primary becoming unresponsive.
As part of failover, the HA replica is “promoted” to become the new primary.
This process is invisible to the end user except for a connection reset. In the
background, a new replica is immediately provisioned for the new primary.

Failover also helps remove downtime for common operations which would normally
cause a service to reset, like maintenance events and service resizes. In these
cases, changes will be made to each node sequentially so that there is always a
node available.

In a normal operating state, the application is connected to the primary and
optionally to its replica. The load balancer handles the connection and defines
the role for each node.

<img class="main-content__illustration"
src="https://assets.timescale.com/docs/images/tsc-replication-replicas-normal-state.webp"
width={1375} height={944}
alt="Diagram showing an application connecting to a service with a replica
through a load balancer"/>

When the primary database fails, the platform updates the roles, “promoting” the
replica to the primary role, with the primary load balancer redirecting traffic
to the new primary. In the meantime, the system begins the recovery of the
failed node.

<img class="main-content__illustration"
src="https://assets.timescale.com/docs/images/tsc-replication-replicas-failover-state.webp"
width={1375} height={944}
alt="Diagram showing the primary failing, and the load balancer redirecting
traffic to the replica"/>

When the failed node recovers or a new node is created, it assumes the replica
role. The previously promoted node remains the primary, streaming WAL
(write-ahead log) to its replica.

<img class="main-content__illustration"
src="https://assets.timescale.com/docs/images/tsc-replication-replicas-repaired-state.webp"
width={1375} height={944}
alt="Diagram showing the old replica becoming the primary, and adding "/>

The new replica will be created in a new availability zone (AZ) to help protect
against an availability zone outage.

## Trigger a switchover

To test the failover mechanism, you can trigger a switchover. Switchovers are
safe operations. They will error out if the replica or primary is not in a
state to safely switch over.

<Procedure>

### Triggering a switchover

1.  Connect to your primary as `tsdbadmin` or another user a part of the
    `tsdbowner` group.
1.  Connect to the `postgres` database: `\c postgres`. You should see this in
    your terminal:

    ```sql
    tsdb=> \c postgres
    postgres=>
    ```

1.  See if your instance is currently in recovery: `select pg_is_in_recovery();`
1.  Check which node is currently your primary:
    `select * from pg_stat_replication;`
1.  Note the `application_name`. This will be your service ID followed by the
    node. The important part is the `-an-0` or `-an-1`.
1.  Schedule a failover: `CALL tscloud.cluster_switchover();`. By default this
    schedules it to occur in 30s. You can also define the time by passing an
    interval, e.g.: `CALL tscloud.cluster_switchover('15 seconds'::INTERVAL);`
1.  Wait for the failover to occur.
1.  Check which node is your primary again: `select * from pg_stat_replication;`
    You should see a notice that your connection has been reset:

    ```sql
    FATAL:  terminating connection due to administrator command
    SSL connection has been closed unexpectedly
    The connection to the server was lost. Attempting reset: Succeeded.
    ```

1.  Check the `application_name`. If initially your primary was `-an-1` before,
    it should now be `-an-0`. If it was `-an-0`, it should now be `-an-1`. You
    can also connect to the HA replica and check its node using a similar
    process.

</Procedure>

## Rapid recovery

Rapid recovery is the default for all services on Timescale. By decoupling
compute and storage, Timescale can take different approaches to different
types of failures, rather than always recovering from backup. In particular,
Timescale can quickly recover from compute failures but will do a full
recovery from backup for storage failures.

Compute failing is by far the most common cause of database failure. Failures
can be caused by hardware failure or by the user from unoptimized queries or
increased load that maxes out the CPU usage and causes a failure. In these
cases, only the instance (compute and memory) needs replacing since the data on
disk is unaffected. If a failure occurs, Timescale immediately provisions
a new database instance and mounts the database's existing storage (disk) to the
new instance. Any WAL that was in memory then replays. This process typically
only takes thirty seconds, though it may take up to twenty minutes in some
circumstances, depending on the amount of WAL that needs replaying. Even in the
worst-case scenario, this recovery is an order of magnitude faster than a
standard recovery from backup procedure. This entire process for detecting and
recovering from a compute failure is fully automated, with no action required by
the user.

Compute failures are by far the most common types of failures (>90%). That said,
sometimes the disk hardware can fail, although this is very uncommon. In the
event of a storage failure, Timescale automatically performs a full
recovery from backup. You can learn more about backup and recovery [here]
[backup-recovery].

<Highlight type="note">
Timescale offers different tools to help improve the availability
of services, but also needs help from the user. We recommend that Cloud
users follow best practices to avoid situations like consistently
maxing out CPU usage. These practices can result in worst-case
scenarios like WAL archiving getting queued behind other processes,
causing a failure to result in larger data loss.
To mitigate this, Cloud actively monitors for such scenarios to
help catch them before a failure occurs.
</Highlight>

## HA replicas in detail

HA replicas are multi-AZ, asynchronous hot standbys. They use streaming
replication to minimize the chance of data loss during failover. What does all
this mean?

### Asynchronous commits

Timescale HA replicas are asynchronous. That means the primary database
reports success once a transaction is completed locally. It doesn't wait to see
if the replica successfully commits the transaction as well. The improves ingest
rates and allows you to keep writing to your database even if a node fails.

Timescale doesn't currently offer synchronous replicas.

### Hot standbys

Timescale replicas are hot standbys. That means they are ready to take
over when the primary fails. It also means you can read from your replica, even
when the primary is running. You can reduce the load on your primary by
distributing your read queries.

### Streaming replication

To keep data in sync between the primary and the replicas, the primary streams
its write-ahead log (WAL). WAL records are streamed as soon as they're written
rather than waiting to be batched and shipped. This reduces the chance of data
loss.

### Multi-AZ

By default, Timescale replicas are created in a different availability
zone (AZ) than the primary. This provides additional availability for Timescale
Cloud services with replicas, as it protects against entire AZ outages. If a
primary is in an AZ that experiences an outage, the service can easily fail over
to the replica.

[cloud-login]: https://console.cloud.timescale.com
[[replicas-blog]: https://www.timescale.com/blog/high-availability-for-your-production-environments-introducing-database-replication-in-timescale-cloud/
[backup-recovery]: /cloud/:currentVersion:/backup-restore-cloud/
