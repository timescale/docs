# Physical backups

For full instance physical backups (which are especially useful for starting up
new [replicas][replication-tutorial]), [`pg_basebackup`][postgres-pg_basebackup]
works with all TimescaleDB installations. You can also use any of several
external backup and restore managers such as [`pg_backrest`][pg-backrest], or
[`barman`][pg-barman]. For ongoing physical backups, you can use
[`wal-e`][wale]. These tools all allow you to take online, physical backups of
your entire instance, and many offer incremental backups and other automation
options.

[replication-tutorial]: /how-to-guides/replication-and-ha/replication/
[postgres-pg_basebackup]: https://www.postgresql.org/docs/current/app-pgbasebackup.html
[pg-backrest]: https://pgbackrest.org/
[pg-barman]: https://www.pgbarman.org/
[wale]: /how-to-guides/backup-and-restore/docker-and-wale/
