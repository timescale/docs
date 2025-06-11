---
title: Point-in-time recovery
excerpt: Going through a destructive event and need to recover your data? Restore your Tiger Cloud service to a previous state with point-in-time recovery
products: [cloud]
keywords: [restore, recovery, pitr]
tags: [recovery, restore, pitr]
---

# Point-in-time recovery

Point-in-time recovery allows you to recover your database from a destructive 
or unwanted action or change. You can recover a $SERVICE_SHORT to any point within the period [defined by your pricing plan][pricing-and-account-management]. 

Initiating a 
point-in-time recovery of your $SERVICE_SHORT creates a fork of your $SERVICE_SHORT that
matches the state of your database at the specified time of recovery. The 
original $SERVICE_SHORT stays untouched to avoid losing data created since the 
time of recovery. 

Since the point-in-time recovery is done in a fork, to migrate your 
application to the point of recovery, switch out the connection 
strings in your application to use the fork. The provision time for the 
recovery fork is typically less than twenty minutes, but can take longer 
depending on the amount of WAL to be replayed. 

To avoid paying for compute for the recovery fork and the original $SERVICE_SHORT, you 
can pause the original to only pay storage costs.

<Procedure>

### Initiating a point-in-time recovery (PITR)

1.  In $CONSOLE_LONG, from the `Services` list, ensure the $SERVICE_SHORT
    you want to PITR has a status of `Running` or `Paused`.
1.  Navigate to the `Operations` tab.
1.  In the `Service management` section, click `Create recovery fork`. In the 
	creation page, select the time you would like to recover to, ensuring the 
	correct time zone (UTC offset).
1.  [](#)<Optional />You can also add an HA replica, change the compute resources, and 
	add a connection pooler as part of this process. It is recommended to match 
	the same configuration you had at the point you want to recover to.
1.  Confirm by clicking `Create recovery fork`. A fork of the $SERVICE_SHORT is 
	created to the point-in-time specified.
1.  The recovered $SERVICE_SHORT shows in the `Services` dashboard with a label stating
    which $SERVICE_SHORT it has been forked from.
1.  If you would like to use your application to use the recovered fork, ensure 
	you update your connection strings to the fork throughout your app.

</Procedure>

[pricing-and-account-management]: /about/:currentVersion:/pricing-and-account-management/