---
title: Backup and restore
excerpt: Understand how backups and restores work in Timescale Cloud
products: [cloud]
keywords: [backups, restore]
tags: [recovery, failures]
---

# Backup and restore

Timescale Cloud automatically handles backup and restore for all
services using the `pgBackRest` tool. You don't need to perform
backups for your Timescale Cloud service manually.

Timescale Cloud automatically creates one full backup every week, and
incremental backups every day. Additionally, all WAL ([Write-Ahead Log][wal])
files are retained back to the oldest full backup. This means that you always
have a full backup available for the current and previous week, and your service
can be restored to any point during this time period.

In the event of a storage failure, a service automatically restores
from backup to the point of failure. In the event of a user error where
a point-in-time recovery needs to be done, [contact support][support].

This diagram describes how a restore from backup occurs after a storage failure:

<Highlight type="note">
Compute failures do not require a full restore from backup. For more
information, see the docs on [rapid recovery]
[rapid-recovery].
</Highlight>

<img class="main-content__illustration"
src="https://www.timescale.com/blog/content/images/2022/08/backups-3.png"
alt="Diagram showing recovery from backup. First, the latest full
backup is restored. Then, the incremental backup is restored.
Finally, WAL is replayed to cover any remaining gap."/>

[wal]: https://www.postgresql.org/docs/current/wal-intro.html
[rapid-recovery]:
/cloud/:currentVersion:/service-operations/replicas/#rapid-recovery
[support]: https://www.timescale.com/support
