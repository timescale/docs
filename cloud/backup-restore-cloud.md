---
title: Backup and restore
excerpt: Understand how backups and restores work in Timescale Cloud
product: cloud
keywords: [backups, restore]
tags: [recovery, failures]
---

# Backup and restore

Timescale Cloud automatically handles backup and restore for all
services using the `pgBackRest` tool. You don't need to perform
backups for your Timescale Cloud service manually.

Timescale Cloud automatically creates one full backup every week, and
incremental backups every day. Additionally, all WAL
([Write-Ahead Log][wal]) files are retained back to the oldest full backup. This means
that you always have a full backup available for the current and
previous week, and your service can be restored to any point during this
time period.

In the event of a storage failure, a service automatically restores
from backup to the point of failure. In the event of a user error where
a point-in-time recovery needs to be done, please [contact support][support]. 

This diagram helps you to understand how a restore from backup occurs after a storage failure.
<Highlight type="note">compute failures are able to
avoid a full restore from backup. For more information, see our docs on
[rapid recovery][rapid-recovery].) </Highlight>

[wal]: https://www.postgresql.org/docs/current/wal-intro.html
[rapid-recovery]:
/cloud/:currentVersion:/service-operations/replicas/#rapid-recovery
