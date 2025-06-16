---
title: Backup and restore
excerpt: Back up and restore your TimescaleDB instance - use logical backup with `pg_dump` and `pg_restore` or physical backup with `pg_basebackup`
products: [self_hosted]
keywords: [backups, restore]
tags: [recovery]
---

import ConsiderCloud from "versionContent/_partials/_consider-cloud.mdx";

# Backup and restore

$TIMESCALE_DB takes advantage of the reliable backup and restore functionality
provided by PostgreSQL. There are a few different mechanisms you can use to
backup your $SELF_LONG database:

*   [Logical backup][logical-backups] with pg_dump and pg_restore.
*   [Physical backup][physical-backups] with `pg_basebackup` or another tool.
*   _DEPRECATED_ [Ongoing physical backups][ongoing-physical-backups] using write-ahead log
  (WAL) archiving.

<ConsiderCloud />

[ongoing-physical-backups]: /self-hosted/:currentVersion:/backup-and-restore/docker-and-wale/
[physical-backups]: /self-hosted/:currentVersion:/backup-and-restore/physical/
[logical-backups]: /self-hosted/:currentVersion:/backup-and-restore/logical-backup/
