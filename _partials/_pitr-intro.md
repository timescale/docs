To recover your $SERVICE_SHORT from a destructive or unwanted action, create a point-in-time recovery fork. You can recover a $SERVICE_SHORT to any point within the period [defined by your pricing plan][pricing-and-account-management]. The original $SERVICE_SHORT stays untouched to avoid losing data created since the time of recovery.

Since the point-in-time recovery is done in a fork, to migrate your
application to the point of recovery, change the connection
strings in your application to use the fork. The provision time for the
recovery fork is typically less than twenty minutes, but can take longer
depending on the amount of WAL to be replayed.

To avoid paying for compute for the recovery fork and the original $SERVICE_SHORT, pause the original to only pay storage costs.


[pricing-and-account-management]: /about/:currentVersion:/pricing-and-account-management/