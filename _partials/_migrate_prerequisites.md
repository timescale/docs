
Best practice is to use an [Ubuntu EC2 instance][create-ec2-instance] hosted in the same region as your
Timescale Cloud service to move data. That is, the machine you run the commands on to move your 
data from your source database to your target Timescale Cloud service. 

Before you move your data:

- [Create a target Timescale Cloud service][created-a-database-service-in-timescale].

  Each Timescale Cloud service has a single database that supports the
  [most popular extensions][all-available-extensions]. $SERVICE_LONGs do not support tablespaces,
  and there is no superuser associated with a $SERVICE_SHORT.
  Best practice is to create a $SERVICE_LONGs with at least 8 CPUs for a smoother experience. A higher-spec instance
  can significantly reduce the overall migration window.

- To ensure that maintenance does not run while migration is in progress, best practice is to [adjust the maintenance window][adjust-maintenance-window]. 

[created-a-database-service-in-timescale]: /getting-started/:currentVersion:/services/
[has a single database]: /migrate/:currentVersion:/troubleshooting/#only-one-database-per-instance
[all-available-extensions]: /use-timescale/:currentVersion:/extensions
[tablespaces]: /migrate/:currentVersion:/troubleshooting/#tablespaces
[no-superuser-for-timescale-instance]: /migrate/:currentVersion:/troubleshooting/#superuser-privileges
[pg_hbaconf]: https://www.timescale.com/blog/5-common-connection-errors-in-postgresql-and-how-to-solve-them/#no-pg_hbaconf-entry-for-host
[create-ec2-instance]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance
[adjust-maintenance-window]: /use-timescale/:currentVersion:/upgrades/#adjusting-your-maintenance-window
