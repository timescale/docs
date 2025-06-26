---
title: Back up and recover your Tiger Cloud services
excerpt: See how and when Tiger Cloud backs up your data, making sure you always have something to fall back on in case of disaster recovery
products: [cloud]
keywords: [backups, restore]
tags: [recovery, failures]
---

# Back up and recovery your $SERVICE_SHORTs

$CLOUD_LONG automatically handles backup for your $SERVICE_LONGs using the `pgBackRest` tool. You don't need to perform backups manually. What's more, with cross-region backup available, you are protected even if an entire AWS region goes down.

In the event of a storage failure, a $SERVICE_SHORT automatically recovers from backup
to the point of failure. In the event of a user error where a point-in-time
recovery needs to be done, you can create a PITR fork.

## Automated same-region backup 

$CLOUD_LONG automatically creates one full backup every week, and
incremental backups every day in the same region as your $SERVICE_SHORT. Additionally, all WAL ([Write-Ahead Log][wal])
files are retained back to the oldest full backup. This means that you always
have a full backup available for the current and previous week, and your $SERVICE_SHORT
can be recovered to any point during this time period.

![Backup in Tiger Cloud](https://assets.timescale.com/docs/images/database-backup-recovery.png)

## Cross-region backup 

<Availability products={['cloud']} price_plans={['enterprise']} />

For added reliability, you can have a cross-region backup enabled. In this case, you get a full copy of your automated backup—but in a different AWS region from your $SERVICE_SHORT. 

You enable cross-region backup when creating a $SERVICE_SHORT, or configure it for an existing $SERVICE_SHORT in $CONSOLE_LONG:

<Procedure>

1. In [$CONSOLE_SHORT][console], select your $SERVICE_SHORT.

1. Click `Operations` > `Backup & restore`. 

1. In `Cross-region backup`, select the region and click `Enable backup`. 

   

   You can now see the backup, its region, and creation date.

</Procedure>

You can have one cross-region backup per $SERVICE_SHORT. To change the region of your backup:

<Procedure>

1. In [$CONSOLE_SHORT][console], select your $SERVICE_SHORT.

1. Click `Operations` > `Backup & restore`.

1. Click the trash icon next to the existing backup to disable it. 

   

1. Create a new backup in a different region. 

</Procedure>

## Automated recovery 

$SERVICE_SHORT_CAPs are automatically recovered from backup in case of storage failure. Compute failures [do not require][rapid-recovery] a full recovery from backup. 

While minimal, recovering from backup still comes with downtime. For zero downtime, enable [high-availability replicas][ha-replicas].

## Point-in-time recovery

Point-in-time recovery enables you to recover your $SERVICE_SHORT from a destructive
or unwanted action manually. You can recover a $SERVICE_SHORT to any point within the period [defined by your pricing plan][pricing-and-account-management].

Initiating a point-in-time recovery of your $SERVICE_SHORT creates a fork of your $SERVICE_SHORT as of the specified recovery point. The original $SERVICE_SHORT stays untouched to avoid losing data created since the time of recovery.

Since the point-in-time recovery is done in a fork, to migrate your
application to the point of recovery, switch out the connection
strings in your application to use the fork. The provision time for the
recovery fork is typically less than twenty minutes, but can take longer
depending on the amount of WAL to be replayed.

To avoid paying for compute for the recovery fork and the original $SERVICE_SHORT, pause the original to only pay storage costs.

You initiate a point-in-time recovery in $CONSOLE_LONG.

<Procedure>

1.  In $CONSOLE, from the `Services` list, ensure the $SERVICE_SHORT
    you want to recover has a status of `Running` or `Paused`.
1.  Navigate to the `Operations` tab.
1.  In the `Backup & restore` section, click `Create recovery fork`. In the
    creation page, select the time you would like to recover to, ensuring the
    correct time zone (UTC offset).
1.  [](#)<Optional />You can also add an HA replica, enable cross-region backup, change the compute resources, and
    add a connection pooler as part of this process. It is recommended to match
    the same configuration you had at the point you want to recover to.
1.  Confirm by clicking `Fork service`. A fork of the $SERVICE_SHORT is
    created to the point-in-time specified.
1.  The recovered $SERVICE_SHORT shows in the `Services` dashboard with a label stating
    which $SERVICE_SHORT it has been forked from.
1.  If you would like to use your application to use the recovered fork, update your connection strings to the fork throughout your app.

</Procedure>


[console]: https://console.cloud.timescale.com/dashboard/services
[ha-replicas]: /about/use-timescale/:currentVersion:/ha-replicas/
[pricing-and-account-management]: /about/:currentVersion:/pricing-and-account-management/
[wal]: https://www.postgresql.org/docs/current/wal-intro.html
[support]: https://www.timescale.com/contact/
[pitr]: /use-timescale/:currentVersion:/backup-restore/point-in-time-recovery/
[rapid-recovery]: /use-timescale/:currentVersion:/ha-replicas/#rapid-recovery

