
Best practice is to use an [Ubuntu EC2 instance][create-ec2-instance] hosted in the same region as your
$SERVICE_LONG as a migration machine. That is, the machine you run the commands on to move your
data from your source database to your target $SERVICE_LONG.

Before you migrate your data:

- [Create a target $SERVICE_LONG][created-a-database-service-in-timescale].

  Each $SERVICE_LONG has a single database that supports the
  [most popular extensions][all-available-extensions]. $SERVICE_LONGs do not support tablespaces,
  and there is no superuser associated with a $SERVICE_SHORT.
  Best practice is to create a $SERVICE_LONGs with at least 8 CPUs for a smoother experience. A higher-spec instance 
  can significantly reduce the overall migration window.

- To ensure that maintenance does not run during the process, [adjust the maintenance window][adjust-maintenance-window].

[created-a-database-service-in-timescale]: /getting-started/:currentVersion:/services/
[all-available-extensions]: /use-timescale/:currentVersion:/extensions
[create-ec2-instance]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance
[adjust-maintenance-window]: /use-timescale/:currentVersion:/upgrades/#adjusting-your-maintenance-window

