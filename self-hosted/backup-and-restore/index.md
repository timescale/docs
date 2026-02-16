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
provided by $PG. There are a few different mechanisms you can use to
back up your $SELF_LONG database:

*   [Logical backup][logical-backups] with pg_dump and pg_restore.
*   [Physical backup][physical-backups] with `pg_basebackup` or another tool.
*   _DEPRECATED_ [Ongoing physical backups][wale] using write-ahead log
  (WAL) archiving.

<ConsiderCloud />

[logical-backups]: /self-hosted/:currentVersion:/backup-and-restore/logical-backup/
[physical-backups]: /self-hosted/:currentVersion:/backup-and-restore/physical/
[wale]: /self-hosted/:currentVersion:/backup-and-restore/docker-and-wale/
