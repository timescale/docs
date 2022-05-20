# Service operations - Replicas
Replicas are up-to-date, running databases that contain the same data as your
primary database. If your primary database fails, the replica can take over
within a few seconds. Having replicas of your database is also known as instance
redundancy.

<highlight type="note">
Database replicas in Timescale Cloud are an early access feature. Early access
features are stable, but under frequent and active development. You can start
enjoying the benefits of database replication now, while we continue to add
capabilities.
</highlight>

You can enable a replica for your single-node services. If your primary database
fails, the replica automatically assumes the role of primary, and a new standby
replica is created. Replicas are resilient to availability zone failure, because
they are created in different availability zones. If the availability zone of
your primary goes down, your replica can take over.

To learn more about how replicas work in Timescale Cloud, see the section on
[how replicas work](#how-replicas-work).
To learn how to create a replica, see the section on
[creating replicas](#create-a-database-replica).

## How replicas work
Replicas in Timescale Cloud are asynchronous hot standbys. They use streaming
replication to minimize the chance of data loss during failover. To learn more,
see the [blog post on Timescale Cloud replicas][replicas-blog].

### Asynchronous commits
Timescale Cloud replicas are asynchronous. That means the primary database
reports success as soon as a transaction is completedly locally. It doesn't wait
to see if the replica successfully commits the transaction as well. The improves
ingest rates and allows you to keep writing to your database even when the
replica fails. But it might cause a small amount of data loss if the primary
fails. To learn more, see the [failover section](#failover).

Timescale Cloud doesn't currently offer synchronous replicas.

### Hot standbys
Timescale Cloud replicas are hot standbys. That means they are ready to take
over as soon as the primary fails. It also means you can read from your replica,
even when the primary is running. You can reduce the load on your primary by
distributing your read queries.

### Streaming replication
To keep data in sync between the primary and the replicas, the primary streams
its write-ahead log (WAL). WAL records are streamed as soon as they're written,
rather than waiting to be batched and shipped. This reduces the chance of data
loss. 

### Failover
In a normal operating state, your application is connected to the primary. It
can optionally be connected to the replica for read queries. Timescale Cloud
manages these connections automatically through a load balancer.

If the primary fails, the platform promotes the replica to the primary and
redirects traffic to it. Any missing data writes are retrieved from backup and
replayed on the new primary, to account for any lag at the time of failure.
Because replicas are asynchronous, it is possible that not all data is captured,
so there might be a small amount of data loss. Closing and reopening connections
to the databases usually takes a few seconds, meaning there is minimal downtime.

To maintain a stable number of replicas, either the failed node recovers or a
new one is created. This node becomes the new replica, while the promoted node
remains the primary.

## Create a database replica

<procedure>

### Creating a database replica
1.  [Log in to your Timescale Cloud account][cloud-login] and click
		the service you want to replicate.
1.  Navigate to the `Operations` tab, and select `Replication`.
1.  Check the pricing of the replica, and click `Add a replica`. Confirm the
    action by clicking `Add replica`.
1.  You can see the replicas for each service by clicking on the service name,
    navigating to the `Operations` tab, and selecting `Replication`. Replicas
    are not shown in the main `Services` section, as they are not independent.
1.  You can see connection information for the replica by navigating to the
    `Overview` tab. In the `Connection info` section, select the replica from
    the `Role` drop down menu to populate the section with the replica's
    connection details.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-replication-add.png" alt="Creating a database replica in Timescale Cloud"/>

</procedure>


[cloud-login]: https://console.cloud.timescale.com
[replicas-blog]: https://www.timescale.com/blog/high-availability-for-your-production-environments-introducing-database-replication-in-timescale-cloud/
