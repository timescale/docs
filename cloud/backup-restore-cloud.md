---
title: Backup and restore
excerpt: Understand how backups and restores work in Timescale Cloud
product: cloud
keywords: [backups, restore]
tags: [recovery, failures]
---

# Backup and restore

Timescale Cloud automatically handles backup and restore for all
services. To manage this, we use pgBackRest. There is no need to perform
backups for your Timescale Cloud service manually.

Timescale Cloud automatically creates one full backup every week, and
incremental backups every day. Additionally, all WAL ([Write-Ahead Log]
[wal]) files are retained back to the oldest full backup. This means
that you always have a full backup available for the current and
previous week, and your service can be restored to any point during this
time period.

In the event of a storage failure, a service will automatically restore
from backup to the point of failure. In the event of a user error where
a point-in-time recovery needs to be done, please contact support. We do
not currently offer point-in-time recovery through the UI.

To understand how a restore from backup occurs after a storage failure,
please see the following diagram. (Note: compute failures are able to
avoid a full restore from backup. For more information, see our docs on
[rapid recovery][rapid-recovery].) 

[wal]: https://www.postgresql.org/docs/current/wal-intro.html
[rapid-recovery]:
/cloud/:currentVersion:/service-operations/replicas/#rapid-recovery
