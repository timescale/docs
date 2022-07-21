---
title: Backup and restore
excerpt: Learn how to back up and restore your TimescaleDB instance
keywords: [backup, restore]
tags: [recovery]
---

# Backup and restore

TimescaleDB takes advantage of the reliable backup and restore functionality
provided by PostgreSQL. There are a few different mechanisms you can use to
backup your self-hosted TimescaleDB database:

- Logical backups with [pg_dump and pg_restore][logical-backups].
- [Physical backups][physical-backups] with `pg_basebackup` or another tool.
- [Ongoing physical backups][ongoing-physical-backups] using write-ahead log
  (WAL) archiving.

<highlight type="cloud" header="Forget about manually creating and maintaining backups">
If you would prefer not to manually create backups and keep them up to date for your TimescaleDB instance, 
you might find the automatic backups on Timescale Cloud useful. In addition to automatically maintaining backups, 
the platform also handles automatic restore from backups with no user action required. 
[Learn more](https://docs.timescale.com/cloud/latest/backup-restore-cloud/) about backup 
and restore in Timescale Cloud or [test it out yourself](http://tsdb.co/cloud-signup) with a free trial.

</highlight>

[logical-backups]: /timescaledb/:currentVersion:/how-to-guides/backup-and-restore/pg-dump-and-restore/
[ongoing-physical-backups]: /timescaledb/:currentVersion:/how-to-guides/backup-and-restore/docker-and-wale/
[physical-backups]: /timescaledb/:currentVersion:/how-to-guides/backup-and-restore/physical/
