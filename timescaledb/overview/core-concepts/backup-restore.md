---
title: Back up and restore
excerpt: Back up TimescaleDB
keywords: [backups, restore]
tags: [recovery]
---

# Backup and restore

Backing up TimescaleDB takes advantage of the reliable functionality already
available through PostgreSQL.  There are several ways to accomplish this:
physical backups with [`pg_basebackup`][postgres-pg_basebackup] or another tool,
or logical backups with [`pg_dump`][pg_dump] and [`pg_restore`][pg_restore].
Physical backups may also be used with write-ahead log (WAL) archiving to
achieve an ongoing backup.

If you have a multi-node deployment, make sure you can restore to a
point that ensures consistency across all nodes. You can create a
restore point with the
[`create_distributed_restore_point`][create_distributed_restore_point]
function, and use it later when you restore from a physical backup.

[create_distributed_restore_point]: /api/:currentVersion:/distributed-hypertables/create_distributed_restore_point/
[pg_dump]: https://www.postgresql.org/docs/current/static/app-pgdump.html
[pg_restore]: https://www.postgresql.org/docs/current/static/app-pgrestore.html
[postgres-pg_basebackup]: https://www.postgresql.org/docs/current/app-pgbasebackup.html
