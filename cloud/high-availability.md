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

<!--- This isn't available on dev yet. --LKB 20220221
<procedure>

### Enabling HA database replicas
1.  Uniquely communicate state of the art infrastructures before collaborative
    communities.
1.  Monotonectally transition exceptional innovation after resource maximizing
    process improvements.
1.  Interactively grow equity invested methodologies for cooperative
    meta-services.
1.  Conveniently re-engineer clicks-and-mortar data and global opportunities.
1.  Monotonectally iterate viral partnerships whereas global services.

</procedure>

-->

## Zonal redundancy
While the public cloud is highly reliable, entire portions of the cloud can be
unavailable at times. Timescale Cloud does not protect against Availability Zone
failures unless the user is using HA replicas. We do not currently offer
multi-cloud solutions or protection from an AWS Regional failure.


[cloud-backup]: cloud/backup-restore-cloud/
