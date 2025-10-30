---
title: Back up and recover your Tiger Cloud services
excerpt: See how and when Tiger Cloud backs up your data, making sure you always have something to fall back on in case of disaster recovery
products: [cloud]
keywords: [backups, restore]
tags: [recovery, failures]
---

import CLIFORKS from "versionContent/_partials/_devops-cli-service-forks.mdx";

# Back up and recover $SERVICE_SHORTs

$CLOUD_LONG provides comprehensive backup and recovery solutions to protect your data, including automatic daily backups, 
cross-region protection, and point-in-time recovery.

## Automatic backups

$CLOUD_LONG automatically handles backup for your $SERVICE_LONGs using the `pgBackRest` tool. You don't need to perform 
backups manually. What's more, with [cross-region backup][cross-region], you are protected when an entire AWS region goes down.

$CLOUD_LONG automatically creates one full backup every week, and incremental backups every day in the same region as 
your $SERVICE_SHORT. Additionally, all [Write-Ahead Log (WAL)][wal] files are retained back to the oldest full backup. 
This means that you always have a full backup available for the current and previous week:

![Backup in Tiger](https://assets.timescale.com/docs/images/database-backup-recovery.png)

On [$SCALE and $ENTERPRISE][pricing-and-account-management] $PRICING_PLANs, you can check the list of backups for the previous 14 days in $CONSOLE_LONG. To do so, select your $SERVICE_SHORT, then click `Operations` > `Backup and restore` > `Backup history`. 

In the event of a storage failure, a $SERVICE_SHORT automatically recovers from a backup
to the point of failure. If the whole availability zone goes down, your $SERVICE_LONGs are recovered in a different zone. In the event of a user error, you can [create a point-in-time recovery fork][create-fork].

## Enable cross-region backup 

<Availability products={['cloud']} price_plans={['enterprise']} />

For added reliability, you can enable cross-region backup. This protects your data when an entire AWS region goes down. In this case, you have two identical backups of your $SERVICE_SHORT at any time, but one of them is in a different AWS region. Cross-region backups are updated daily and weekly in the same way as a regular backup. You can have one cross-region backup for a $SERVICE_SHORT.

You enable cross-region backup when you create a $SERVICE_SHORT, or configure it for an existing $SERVICE_SHORT in $CONSOLE_LONG:

<Procedure>

1. In [$CONSOLE_SHORT][console], select your $SERVICE_SHORT and click `Operations` > `Backup & restore`. 

1. In `Cross-region backup`, select the region in the dropdown and click `Enable backup`. 

   ![Create cross-region backup](https://assets.timescale.com/docs/images/tiger-cloud-console/create-cross-region-backup-in-tiger-console.png)

   You can now see the backup, its region, and creation date in a list. 

</Procedure>

You can have one cross-region backup per $SERVICE_SHORT. To change the region of your backup:

<Procedure>

1. In [$CONSOLE_SHORT][console], select your $SERVICE_SHORT and click `Operations` > `Backup & restore`.

1. Click the trash icon next to the existing backup to disable it. 

   ![Disable cross-region backup](https://assets.timescale.com/docs/images/tiger-cloud-console/cross-region-backup-list-in-tiger-console.png)

1. Create a new backup in a different region. 

</Procedure>

## Create a point-in-time recovery fork

<Availability products={['cloud']} />

To recover your $SERVICE_SHORT from a destructive or unwanted action, create a point-in-time recovery fork. You can 
recover a $SERVICE_SHORT to any point within the period [defined by your pricing plan][pricing-and-account-management].
The provision time for the recovery fork is typically less than twenty minutes, but can take longer depending on the 
amount of WAL to be replayed. The original $SERVICE_SHORT stays untouched to avoid losing data created since the time 
of recovery.

All tiered data remains recoverable during the PITR period. When restoring to any point-in-time recovery fork, your
$SERVICE_SHORT contains all data that existed at that moment - whether it was stored in high-performance or low-cost
storage. 

When you restore a recovery fork:
- Data restored from a PITR point is placed into high-performance storage
- The tiered data, as of that point in time, remains in tiered storage



To avoid paying for compute for the recovery fork and the original $SERVICE_SHORT, pause the original to only pay 
storage costs.

You initiate a point-in-time recovery from a same-region or cross-region backup in $CONSOLE_LONG:

<Tabs label="Point-in-time recovery in Tiger Cloud Console">

<Tab title="Same-region backup">

<Procedure>

1.  In [$CONSOLE][console], from the `Services` list, ensure the $SERVICE_SHORT
    you want to recover has a status of `Running` or `Paused`.
1.  Navigate to `Operations` > `Service management` and click `Create recovery fork`. 
1.  Select the recovery point, ensuring the correct time zone (UTC offset).
1.  Configure the fork.

    ![Create recovery fork](https://assets.timescale.com/docs/images/tiger-cloud-console/create-recovery-fork-tiger-console.png)

    You can configure the compute resources, add an HA replica, tag your fork, and
    add a connection pooler. Best practice is to match
    the same configuration you had at the point you want to recover to.
1.  Confirm by clicking `Create recovery fork`.

    A fork of the $SERVICE_SHORT is created. The recovered $SERVICE_SHORT shows in `Services` with a label specifying which $SERVICE_SHORT it has been forked from.

1.  Update the connection strings in your app

    Since the point-in-time recovery is done in a fork, to migrate your
    application to the point of recovery, change the connection
    strings in your application to use the fork.

</Procedure>

</Tab>

<Tab title="Cross-region backup">

[Contact us](mailto:support@tigerdata.com), and we will assist in recovering your $SERVICE_SHORT.
    
</Tab>

</Tabs>


## Create a service fork

<CLIFORKS />


[console]: https://console.cloud.timescale.com/dashboard/services
[ha-replicas]: /about/use-timescale/:currentVersion:/ha-replicas/
[pricing-and-account-management]: /about/:currentVersion:/pricing-and-account-management/
[wal]: https://www.postgresql.org/docs/current/wal-intro.html
[support]: https://www.timescale.com/contact/
[pitr]: /use-timescale/:currentVersion:/backup-restore/point-in-time-recovery/
[rapid-recovery]: /use-timescale/:currentVersion:/ha-replicas/#rapid-recovery
[cross-region]: /use-timescale/:currentVersion:/backup-restore#enable-cross-region-backup
[create-fork]: /use-timescale/:currentVersion:/backup-restore#create-a-point-in-time-recovery-fork
