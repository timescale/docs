# High Availability
A key piece of running a service on the cloud is keeping it accessible to users,
often called availability. Timescale Cloud employs various techniques to improve
the availability of your service. Here we will discuss some of the strategies
used by Timescale Cloud to increase the availability of the services running on
it. Many of these are free and enabled by default.

Timescale Cloud uses two main tactics to increase availability: increasing the
redundancy of a system and increasing the resilience of a system. Generally,
this looks like replicating all or parts of a system to have them on standby in
the event of a failure (redundancy) and automating recovery processes to switch
to those standby resources as quickly as possible (resiliency). We use these
tactics in conjunction with one another.

Availability is often defined by how a service recovers from an unexpected,
disruptive event. There are usually two objectives after experiencing a
disruptive event: the Recovery Point Objective (RPO) and the Recovery Time
Objective (RTO). RPO is the maximum acceptable amount of data a system can lose
during an event. RTO is the maximum permissible time a system can be down after
an event. An organization normally determines these objectives as part of a
disaster recovery plan. Your RTO and RPO can help determine which availability
tactics you should employ and how you architect your service overall.

This post is organized around the different levels you might experience a
disruptive event. The idea is that the tactics for dealing with a failed disk
drive might look very different from, e.g., AWS's US-EAST-1 going down. We begin
with backups as recovering from backup will be the maximum possible RTO and RPO
you should experience in a cloud environment.

# Backups
For systems that can tolerate a higher RTO, recovering from backup alone may be
a sufficient availability strategy. 

For Timescale Cloud customers, full backups are taken weekly and stored on
Amazon S3. Incremental backups are performed daily, and Write-Ahead Log (WAL)
segments are streamed to S3. In the event of a failure, the only data loss
should be from any WAL that was committed but not sent to S3. This scenario
should only happen when an instance is under heavy load, causing the WAL
shipping process to queue behind processing queries. Uncommitted transactions
will return an error to the application, where they should then be retried by
the application.

In the event of a failure, the database will automatically begin recovering on
its own from the most recent successful backup. We use Patroni, which calls
`pgbackrest` as a custom bootstrap method to recover the data directory from
S3. This process hydrates the database quickly, with throughput determined by
the service's CPU size. Once the Postgres service has finished restoring, it
will begin replaying all of the WAL in S3 until it has reached the last
committed transaction. The entire process can take up to 30 minutes. For more
information on how this process works, please see our
[<ins>documentation</ins>](https://docs.timescale.com/cloud/latest/backup-restore-cloud/). 

Since backups are stored on S3, they [remain accessible in an Availability Zone
outage](https://aws.amazon.com/s3/faqs/). However, Timescale Cloud does not
currently automatically recover services to a separate AZ from backup during an
AZ outage. For services that require protection from AZ outages, see <a
href="">Zonal Redundancy</a>.

# Storage Redundancy
Storage redundancy, in the context of PostgreSQL, refers to having multiple
copies of a database’s data files. If the storage currently attached to a
Postgres instance corrupts or otherwise becomes unavailable, the system can
failover by replacing its current storage with one of the copies. 

For Timescale Cloud customers, data files are stored on AWS’s
[Elastic Block Store](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volumes.html)
(EBS) volumes. An EBS volume has two drives and automatically replicates data
between them using a
[RAID1](https://forums.aws.amazon.com/thread.jspa?threadID=223363)
(mirroring) strategy, meaning that the copy will always be up-to-date. The copy
will automatically take over if one drive fails, and a new drive will be
provisioned within the volume. The volume will remain attached to the instance,
with the only impact to the database being
[potentially degraded performance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitoring-volume-status.html)
as the impacted drive is repaired or replaced within the volume. Since the copy
is always up-to-date, WAL will not have to be replayed. The entire failover
process for a drive failure should be near-instantaneous, with zero RTO (as the
service would not go down) and zero RPO. 

If the EC2 fails, the data in memory is lost but recoverable. Postgres writes
all changes to the Write-Ahead Log (WAL) and ensures it syncs before recording a
transaction as committed and flushing the buffers to disk. Postgres's approach
ensures that either the client does not receive confirmation that the
transaction is committed (and thus should retry the transaction), or a committed
transaction is in the WAL file and will be recovered upon restart. For an EC2
failure, the RTO is the time it takes to mount the storage to a new EC2. The
RPO is zero.

Currently, Timescale Cloud does not take EBS snapshots,
[which means](https://docs.aws.amazon.com/prescriptive-guidance/latest/backup-recovery/ec2-backup.html)
that we do not currently offer AZ redundancy at the storage level.mTo protect
against For services that require protection from AZ outages, see Zonal
Redundancy.

# Instance Redundancy
Instance redundancy refers to having multiple instances of your database running
simultaneously. The instances that are not the primary database are called
replicas. Having a replica (or many) can significantly reduce RTO, as there is
already an up-to-date, running database that can take over. 

Timescale Cloud customers can enable a high availability (HA) replica for their
single-node services. These replicas are asynchronous. In the event of a primary
going down, the replica automatically assumes the role of primary, and a new
standby replica is created. WAL segments are retrieved from S3 and replayed on
the "new" primary to account for any lag at the time of failure. Due to their
asynchronous nature, it is possible that not all WALs produced by the primary
were shipped to S3 at the point of failure, meaning there may be some data loss.
Connections to the primary will be closed and should be reopened by the client.
The entire promotion and switchover process should only take a matter of
seconds. Timescale Cloud does not currently offer synchronous replicas.

High Availability (HA) replicas also provide protection against Availability
Zone outages. Replicas are automatically created in a different AZ than the
primary.

# Zonal Redundancy
While the public cloud is highly reliable, entire portions of the cloud may be
unavailable at times. Timescale Cloud does not protect against Availability Zone
failures unless the user is using HA Replicas. We do not currently offer
protection from an AWS Regional failure nor multi-cloud solutions.
