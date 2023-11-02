---
title: Backup and restore
excerpt: Understand how backups, restores, and PITR work in Timescale
products: [cloud]
keywords: [backup, restore, pitr, point-in-time recovery]
tags: [backup, restore, recovery, pitr]
cloud_ui:
    path:
        - [services, :serviceId, operations, management]
---

# Backup, restore, and PITR

Timescale automatically handles backup and restore for all
services using the `pgBackRest` tool. You don't need to perform
backups for your Timescale service manually. 

Timescale also offers self-initiated point-in-time recovery (PITR) via the console. 
This allows you to fork a service to any point in the last 3 days in a 
fork of the service being restored.

*   [Backup and restore][backup-recovery] in Timescale
*   Performing a [point-in-time recovery][pitr] in Timescale

[backup-recovery]: /use-timescale/:currentVersion:/backup-restore/backup-restore-cloud/
[pitr]: /use-timescale/:currentVersion:/backup-restore/pitr/

