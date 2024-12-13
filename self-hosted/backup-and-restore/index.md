---
title: Backup and restore
excerpt: Learn how to back up and restore your TimescaleDB instance
products: [self_hosted]
keywords: [backups, restore]
tags: [recovery]
---

import ConsiderCloud from "versionContent/_partials/_consider-cloud.mdx";

# Backup and restore

TimescaleDB takes advantage of the reliable backup and restore functionality
provided by PostgreSQL. There are a few different mechanisms you can use to
backup your self-hosted TimescaleDB database:

*   [Logical backup][logical-backups] with pg_dump and pg_restore.
*   [Physical backup][physical-backups] with `pg_basebackup` or another tool.
*   _DEPRECATED_ [Ongoing physical backups][ongoing-physical-backups] using write-ahead log
  (WAL) archiving.

<ConsiderCloud />

[ongoing-physical-backups]: /self-hosted/:currentVersion:/backup-and-restore/docker-and-wale/
[physical-backups]: /self-hosted/:currentVersion:/backup-and-restore/physical/
[logical-backups]: /self-hosted/:currentVersion:/backup-and-restore/logical-backup/
