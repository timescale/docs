# Backup & Restore [](backup)

Backing up TimescaleDB takes advantage of the reliable functionality already
available through PostgreSQL.  There are several ways to accomplish this:
physical backups with `pg_basebackup` or another tool, or logical backups with
`pg_dump` and `pg_restore`. Physical backups may also be used with Write-Ahead Log
(WAL) archiving to achieve an ongoing backup.

<highlight type="warning">
TimescaleDB currently does not natively support a consistent restore point for 
multi-node environments. Care should be taken to ensure third-party solutions 
properly quiesce the environment before backing up, so that the backup point 
used across nodes does not have outstanding transactions.
</highlight>

## Performing Physical Backups [](physical-backups)

For full instance physical backups (which are especially useful for starting up
new [replicas][replication-tutorial]), [`pg_basebackup`][postgres-pg_basebackup]
works with all TimescaleDB installations. You can also use any of several
external backup and restore managers such as [`pg_backrest`][pg-backrest],
[`barman`][pg-barman], or [`wal-e`][wale official]. These allow you to take
online, hot physical backups of your entire instance, and many offer incremental
backups and other automation options.

[replication-tutorial]: r/how-to-guides/replication-and-ha/replication/
[postgres-pg_basebackup]: https://www.postgresql.org/docs/current/app-pgbasebackup.html
[pg-backrest]: https://pgbackrest.org/
[pg-barman]: https://www.pgbarman.org/
[wale official]: https://github.com/wal-e/wal-e