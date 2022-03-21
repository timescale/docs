# High availability
Timescale Cloud uses various methods to ensure that your service remains
available. This section covers some of the strategies used to
increase service availability.

High availability (HA) is achieved by increasing redundancy and
resilience. To increase redundancy, parts of the system are
replicated, so that they are on standby in the event of a failure. To increase
resilience, recovery processes switch between these standby resources as quickly
as possible.

## Backups
On Timescale Cloud, full backups are taken weekly and incremental backups are
performed daily.

For more information about backups on Timescale Cloud, see the
[backup and restore section][cloud-backup].

## Storage redundancy
Storage redundancy refers to having multiple copies of a database's data files.
If the storage currently attached to a PostgreSQL instance corrupts or otherwise
becomes unavailable, the system can replace its current storage with one of the
copies. 

If one drive fails, the copy automatically takes over, and a new drive is
provisioned within the volume. The volume remains attached to the instance, with
the only impact to the database being potentially degraded performance as the
impacted drive is repaired or replaced within the volume. The entire recovery
process for a drive failure is near-instantaneous. 

## Database replicas
Instance redundancy refers to having replicas of your database running
simultaneously. In the case of a database failure, a replica is an up-to-date,
running database that can take over immediately.

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

## Zonal redundancy
While the public cloud is highly reliable, entire portions of the cloud can be
unavailable at times. Timescale Cloud does not protect against Availability Zone
failures unless the user is using HA replicas. We do not currently offer
multi-cloud solutions or protection from an AWS Regional failure.


[cloud-backup]: cloud/backup-restore-cloud/
