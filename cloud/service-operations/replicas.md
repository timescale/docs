# Service operations - Replicas
Instance redundancy refers to having replicas of your database running
simultaneously. In the case of a database failure, a replica is an up-to-date,
running database that can take over immediately.

<highlight type="note">
Creating database replicas in Timescale Cloud is an early access feature. Early
access features are still under active development. You can start enjoying the
benefits of database replication now, while we continue to develop extended 
capabilities, such as offering replicas in different availability zones.
</highlight>

You can enable a replica for your single-node services. The
replicas are asynchronous, and if your primary database fails, the replica
automatically assumes the role of primary, and a new standby replica is created.
Any missing data writes are retrieved from backup and replayed on the new
primary, to account for any lag at the time of failure. Because replicas are
asynchronous, it is possible that not all data is captured, so there
might be a small amount of data loss.

When this occurs, connections to the original, failed database are closed and
need to be reopened. The entire process usually takes a few seconds. Timescale
Cloud does not currently offer synchronous replicas.

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
