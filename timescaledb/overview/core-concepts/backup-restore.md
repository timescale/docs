# Backup & Restore

Backing up TimescaleDB takes advantage of the reliable functionality already
available through PostgreSQL.  There are several ways to accomplish this:
physical backups with [`pg_basebackup`][postgres-pg_basebackup] or another tool, 
or logical backups with [`pg_dump`][pg_dump] and [`pg_restore`][pg_restore]. Physical backups may also be 
used with Write-Ahead Log (WAL) archiving to achieve an ongoing backup.

<highlight type="warning">
TimescaleDB currently does not natively support a consistent restore point for 
multi-node environments. Care should be taken to ensure third-party solutions 
properly quiesce the environment before backing up, so that the backup point used 
across nodes does not have outstanding transactions.
</highlight>



[postgres-pg_basebackup]: https://www.postgresql.org/docs/current/app-pgbasebackup.html
[pg_dump]: https://www.postgresql.org/docs/current/static/app-pgdump.html
[pg_restore]: https://www.postgresql.org/docs/current/static/app-pgrestore.html

