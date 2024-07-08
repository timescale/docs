
You use downtime migration when your source database holds less than 100GB of data. This is because 
downtime migration for large amounts of data takes a large amount of time. Best practice is migrate 
big data using [live migration]. 

If you want to migrate more than 400GB of data using downtime migration, create a 
[Timescale Console support request][support-link], or send us an email at [support@timescale.com](mailto:support@timescale.com) saying 
how much data you want to migrate. We will pre-provision your Timescale Cloud instance for you.


[live migration]: /migrate/:currentVersion:/live-migration
[support-link]: https://console.cloud.timescale.com/dashboard/support
