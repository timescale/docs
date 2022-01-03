# Backup and restore

TimescaleDB takes advantage of the reliable backup and restore functionality
provided by PostgreSQL. There are a few different mechanisms you can use to
backup your self-hosted TimescaleDB database:
*   Logical backups with [pg_dump and pg_restore][logical-backups].
*   [Physical backups][physical-backups] with `pg_basebackup` or another tool.
*   [Ongoing physical backups][ongoing-physical-backups] using write-ahead log
    (WAL) archiving.

<highlight type="important">
If you are using Timescale Cloud, you don't need to manually perform backups!
For more information, see the
[Timescale Cloud backup and restore section](https://docs.timescale.com/cloud/latest/backup-restore-cloud/).
</highlight>


[physical-backups]: /how-to-guides/backup-and-restore/physical/
[ongoing-physical-backups]: /how-to-guides/backup-and-restore/docker-and-wale/
[logical-backups]: /how-to-guides/backup-and-restore/pg-dump-and-restore/
