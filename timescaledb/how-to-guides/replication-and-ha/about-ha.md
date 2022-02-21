# Availability
A key piece of running a service on the cloud is keeping it accessible to users,
often called availability.

Timescale Cloud employs various techniques to improve the availability of your
service. For more information about high availability in Timescale Cloud, see
the [high availability section][cloud-ha] in the Cloud documentation.

# Backups
For systems that can tolerate a higher RTO, recovering from backup alone may be
a sufficient availability strategy. 

For more information about backups in self-hosted TimescaleDB, see the
[backup and restore section][db-backup] in the TimescaleDB documentation.

For more information about backups in Timescale Cloud, see
the [backup and restore section][cloud-backup] in the Cloud documentation.

# Storage Redundancy
Storage redundancy, in the context of PostgreSQL, refers to having multiple
copies of a database’s data files. If the storage currently attached to a
Postgres instance corrupts or otherwise becomes unavailable, the system can
failover by replacing its current storage with one of the copies. 

# Instance Redundancy
Instance redundancy refers to having multiple instances of your database running
simultaneously. The instances that are not the primary database are called
replicas. Having a replica (or many) can significantly reduce RTO, as there is
already an up-to-date, running database that can take over. 

# Zonal Redundancy
While the public cloud is highly reliable, entire portions of the cloud may be
unavailable at times. Timescale Cloud does not protect against Availability Zone
failures unless the user is using HA Replicas. We do not currently offer
protection from an AWS Regional failure nor multi-cloud solutions.

For more information about HA replicas in Timescale Cloud, see
the [high availability section][cloud-ha] in the Cloud documentation.

# Replication
TimescaleDB supports replication using PostgreSQL's built-in
[streaming replication][postgres-streaming-replication-docs]. Using
[logical replication][postgres-logrep-docs] with TimescaleDB is not recommended,
as it requires schema synchronization between the primary and replica nodes and
replicating partition root tables, which are
[not currently supported][postgres-partition-limitations].

PostgreSQL achieves streaming replication by having replicas continuously stream
the WAL from the primary database. See the official
[replication documentation](https://www.postgresql.org/docs/current/static/warm-standby.html#STREAMING-REPLICATION)
for details. For more information about how PostgreSQL implements Write-Ahead
Logging, see their
[WAL Documentation](https://www.postgresql.org/docs/current/static/wal-intro.html).

## Failover
PostgreSQL offers failover functionality (i.e., promoting the replica to the
primary in the event of a failure on the primary) through [pg_ctl][pgctl-docs]
or the `trigger_file`, but it does not provide out-of-the-box support for
automatic failover. Read more in the PostgreSQL [failover
documentation][failover-docs]). [patroni][patroni-github] offers a configurable
high availability solution with automatic failover functionality.

[cloud-ha]: cloud/:currentVersion:/high-availability/
[db-backup]: timescaledb/:currentVersion:/how-to-guides/backup-and-restore/
[cloud-backup]: cloud/:currentVersion:/backup-restore-cloud.md
[postgres-streaming-replication-docs]: https://www.postgresql.org/docs/current/static/warm-standby.html#STREAMING-REPLICATION
[postgres-partition-limitations]: https://www.postgresql.org/docs/current/static/logical-replication-restrictions.html
[postgres-logrep-docs]: https://www.postgresql.org/docs/current/static/logical-replication.html
[timescale-docker]: https://github.com/timescale/timescaledb-docker
[docker-postgres-scripts]: https://docs.docker.com/samples/library/postgres/#how-to-extend-this-image
[timescale-streamrep-docker]: https://github.com/timescale/streaming-replication-docker
[pgctl-docs]: https://www.postgresql.org/docs/current/static/app-pg-ctl.html
[failover-docs]: https://www.postgresql.org/docs/current/static/warm-standby-failover.html
[patroni-github]: https://github.com/zalando/patroni
