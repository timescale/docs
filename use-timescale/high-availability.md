---
title: High availability
excerpt: How rapid recovery and high availability works in Timescale Cloud
products: [cloud]
keywords: [high availability, recovery]
tags: [restore, backup, failures]
---

# High availability

Availability needs are determined by how a system recovers when a
database crashes or becomes unavailable. Availability is a balance
between how much data may be lost after a failure and how long it
takes for the database to get back up and running. The former is
called the Recovery Point Objective (RTO), and the latter is called
the Recovery Time Objective (RTO). High availability usually means
keeping the system operational during a failure while minimizing any
data loss.

Timescale Cloud provides very low RTO and RPO for all instances.
Timescale Cloud also offers features such as
replicas to satisfy high availability requirements. Replicas ensure near-zero
downtime and near-zero data loss if the database fails. This section covers
some strategies used to increase service availability on Timescale
Cloud.

## Rapid recovery

For all services, Timescale Cloud decouples the database's compute and
storage. This allows databases to self-heal gracefully in many situations,
rather than crashing and recovering from backup in all cases. Without self-healing,
failure recovery usually requires a full restore from backup. This
can result in hours of downtime. Timescale Cloud is able to replace
only the failed part of the database, dramatically reducing potential
downtime in the most common failure scenarios.

Compute failing is by far the most common cause of a database failure.
It can be caused by unoptimized queries or increased load that maxes
out the CPU usage, causing a failure. In compute failure scenarios,
only the instance (compute and memory) needs replacing since the
data on disk is unaffected. Once a compute failure is detected,
Timescale Cloud immediately provisions a new database instance and
mounts the database's existing storage (disk) to the new instance. Any
available WAL then replays. This process is similar to recovering from
a filesystem-level backup. The impact is that the database is
unavailable while the storage mounts to the new server instance, and
database connections reset. This process typically only takes thirty
seconds, though it may take up to twenty minutes in some circumstances.
Even in the worst-case scenario, this recovery is an order of magnitude
faster than a standard recovery from backup procedure. In addition, the
entire process for detecting and recovering from a compute failure is
fully automated, with no action required by the user.

Compute failures are by far the most common types of failures. That
said, sometimes the disk itself can fail, although this is far less
common. In the event of a storage failure, Timescale Cloud
automatically performs a full recovery from backup. Similar to compute
failures, any unarchived WAL (up to 16&nbsp;MB or 5 minutes) is also lost. You
can learn more about backups and recovery [here][cloud-backup].

Timescale Cloud's rapid recovery strategy can dramatically reduce the
RTO in the most common failure scenarios, bringing the time to recover
to mere seconds or minutes instead of hours. The potential data loss
(RPO) is minimal due to the WAL streaming strategy. The only potential
data loss is of WAL segments that had not yet been written to disk at
the time of failure. Fortunately, these segments are written to disk
every 16 MB or 5 minutes, whichever comes first. For systems that
require very low RTO and near-zero RPO in nearly every disaster
scenario, Timescale Cloud recommends using replicas.

<Highlight type="note">
Timescale Cloud offers different tools to help improve the availability
of services, but also needs help from the user. We recommend that Cloud
users follow best practices to avoid situations like consistently
maxing out CPU usage. These practices can result in worst-case
scenarios like WAL archiving getting queued behind other processes,
causing a failure to result in larger data loss.
To mitigate this, Cloud actively monitors for such scenarios to
help catch them before a failure occurs.
</Highlight>

## Replicas

Timescale Cloud offers replicas for systems requiring higher
availability than rapid recovery. Replicas on Timescale Cloud are "hot
standbys," meaning that they take over operations if the primary fails
and can also be used for read queries during normal operations.
Timescale Cloud replicas are also deployed in a different Availability
Zone (AZ) than the primary to protect against scenarios where an entire
AZ becomes unavailable.

Adding a replica to your service helps significantly reduce the
likelihood of downtime in the event of a failure. If there is a
failure, the only noticeable impact on your service is connections
resetting while the replica is promoted to the primary. For replicas,
WAL is streamed to the replica directly, not in chunks like in services
without replicas. In certain high-traffic scenarios, there can be a
small lag (at most a few seconds) between the primary and replica,
causing transactions to be committed but not replicated before a
failure. In this specific case, there may be a small amount of data
loss, though this is rare. In general, replicas are considered a best
practice for services with high availability requirements.

For more information about database replicas, including how they work,
see the [Service Operations - Replicas section][db-replicas].

## Maintenance downtime

Some operations on your database cannot avoid downtime, such as
upgrading a major version of PostgreSQL. If Timescale Cloud has to
apply a critical update, like a security patch, it is only applied
during the set Maintenance Window. However, these situations are rare
or triggered manually by the user. See the [Maintenance][maintenance] section in the
docs to learn more about how maintenance is handled.

Adding replicas to your service can help reduce the downtime during a
maintenance event, as maintenance is applied to each node individually.
For example, your replica may have maintenance performed on it while
the primary remains operational; once it is completed, the replica is
promoted to the primary while the (former) primary node undergoes
maintenance.

## Backup and recovery

On Timescale Cloud, full backups are taken weekly and incremental
backups are performed daily. Additionally, WAL is archived as soon as it
is written to disk. In the event of a catastrophic failure, if the
service is unable to self-heal, Timescale Cloud automatically
recovers your database from backup and replays any WAL to close the gap
between the backup and time of failure. This strategy ensures that data
can be retrieved almost right up to the point of failure, with the
exception of data in memory (up to 16&nbsp;MB or the last 5 minutes). For
more information about backups on Timescale Cloud, see the
[backup and restore section][cloud-backup].

[cloud-backup]: /use-timescale/:currentVersion:/backup-restore-cloud/
[db-replicas]: /use-timescale/:currentVersion:/services/replicas/
[maintenance]: /use-timescale/:currentVersion:/services/maintenance/
