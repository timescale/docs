---
title: Backup and restore
excerpt: Learn how to back up and restore your TimescaleDB instance
products: [self_hosted]
keywords: [backups, restore]
tags: [recovery]
---

# Backup and restore

TimescaleDB takes advantage of the reliable backup and restore functionality
provided by PostgreSQL. There are a few different mechanisms you can use to
backup your self-hosted TimescaleDB database:

*   Logical backups with [pg_dump and pg_restore][logical-backups].
*   [Physical backups][physical-backups] with `pg_basebackup` or another tool.
*   _DEPRECATED_ [Ongoing physical backups][ongoing-physical-backups] using write-ahead log
  (WAL) archiving.

[logical-backups]: /timescaledb/:currentVersion:/how-to-guides/backup-and-restore/pg-dump-and-restore/
[ongoing-physical-backups]: /timescaledb/:currentVersion:/how-to-guides/backup-and-restore/docker-and-wale/
[physical-backups]: /timescaledb/:currentVersion:/how-to-guides/backup-and-restore/physical/
