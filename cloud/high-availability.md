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

For more information about database replicas, see [the Service Operations - Replicas section][db-replicas]

## Zonal redundancy
While the public cloud is highly reliable, entire portions of the cloud can be
unavailable at times. Timescale Cloud does not protect against Availability Zone
failures unless the user is using HA replicas. We do not currently offer
multi-cloud solutions or protection from an AWS Regional failure.


[cloud-backup]: /backup-restore-cloud/
[db-replicas]: /service-operations/replicas/