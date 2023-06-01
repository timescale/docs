---
title: Physical backups
excerpt: How to take physical backups of your TimescaleDB instance
products: [self_hosted]
keywords: [backups]
tags: [restore, recovery, physical backup]
---

import ConsiderCloud from "versionContent/_partials/_consider-cloud.mdx";

# Physical backups

For full instance physical backups (which are especially useful for starting up
new [replicas][replication-tutorial]), [`pg_basebackup`][postgres-pg_basebackup]
works with all TimescaleDB installation types. You can also use any of several
external backup and restore managers such as [`pg_backrest`][pg-backrest], or [`barman`][pg-barman]. For ongoing physical backups, you can use
[`wal-e`][wale], although this method is now deprecated. These tools all allow
you to take online, physical backups of your entire instance, and many offer
incremental backups and other automation options.

<ConsiderCloud />

[pg-backrest]: https://pgbackrest.org/
[pg-barman]: https://www.pgbarman.org/
[postgres-pg_basebackup]: https://www.postgresql.org/docs/current/app-pgbasebackup.html
[replication-tutorial]: /self-hosted/:currentVersion:/replication-and-ha/
[wale]: /self-hosted/:currentVersion:/backup-and-restore/docker-and-wale/
