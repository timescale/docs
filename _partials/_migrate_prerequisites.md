
Best practice is to run the migration commands from a machine with a low-latency, 
high-throughput link to the source database and the target Timescale Cloud service. 
If you are using an AWS EC2 Ubuntu instance, ensure it is in the same region as your 
target service.

Before you migrate your data:

- [Create a target Timecale Cloud service][created-a-database-service-in-timescale].

  Each Timescale Cloud service [has a single database] that supports the
  [most popular extensions][all available extensions]. Timescale Cloud services do not support [tablespaces],
  and [there is no superuser associated with a Timescale service][no-superuser-for-timescale-instance].
 

[created-a-database-service-in-timescale]: /getting-started/:currentVersion:/services/
[has a single database]: /migrate/:currentVersion:/troubleshooting/#only-one-database-per-instance
[all available extensions]: /migrate/:currentVersion:/troubleshooting/#extension-availability
[tablespaces]: /migrate/:currentVersion:/troubleshooting/#tablespaces
[no-superuser-for-timescale-instance]: /migrate/:currentVersion:/troubleshooting/#superuser-privileges
[upgrade instructions]: /self-hosted/:currentVersion:/upgrades/about-upgrades/
[pg_hbaconf]: https://www.timescale.com/blog/5-common-connection-errors-in-postgresql-and-how-to-solve-them/#no-pg_hbaconf-entry-for-host