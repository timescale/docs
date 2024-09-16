
Best practice is to use an [Ubuntu EC2 instance][create-ec2-instance] hosted in the same region as your
Timescale Cloud service as a migration machine. That is, the machine you run the commands on to move your 
data from your source database to your target Timescale Cloud service. 

Before you migrate your data:

- [Create a target Timescale Cloud service][created-a-database-service-in-timescale].

  Each Timescale Cloud service [has a single database] that supports the
  [most popular extensions][all available extensions]. Timescale Cloud services do not support [tablespaces],
  and [there is no superuser associated with a Timescale service][no-superuser-for-timescale-instance].

- To ensure that maintenance does not run while migration is in progress, best practice is to [adjust the maintenance window][adjust-maintenance-window]. 

[created-a-database-service-in-timescale]: /getting-started/:currentVersion:/services/
[has a single database]: /migrate/:currentVersion:/troubleshooting/#only-one-database-per-instance
[all available extensions]: /migrate/:currentVersion:/troubleshooting/#extension-availability
[tablespaces]: /migrate/:currentVersion:/troubleshooting/#tablespaces
[no-superuser-for-timescale-instance]: /migrate/:currentVersion:/troubleshooting/#superuser-privileges
[upgrade instructions]: /self-hosted/:currentVersion:/upgrades/about-upgrades/
[pg_hbaconf]: https://www.timescale.com/blog/5-common-connection-errors-in-postgresql-and-how-to-solve-them/#no-pg_hbaconf-entry-for-host
[create-ec2-instance]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance
[adjust-maintenance-window]: /:currentVersion:/upgrades/#adjusting-your-maintenance-window
