
Best practice is to use an [Ubuntu EC2 instance][create-ec2-instance] hosted in the same region as your
$SERVICE_LONG to move data. That is, the machine you run the commands on to move your 
data from your source database to your target $SERVICE_LONG. 

Before you move your data:

- Create a target [$SERVICE_LONG][create-service].

  Each $SERVICE_LONG has a single $PG instance that supports the
  [most popular extensions][all-available-extensions]. $SERVICE_LONGs do not support tablespaces,
  and there is no superuser associated with a $SERVICE_SHORT.
  Best practice is to create a $SERVICE_LONG with at least 8 CPUs for a smoother experience. A higher-spec instance
  can significantly reduce the overall migration window.

- To ensure that maintenance does not run while migration is in progress, best practice is to [adjust the maintenance window][adjust-maintenance-window]. 

[has a single database]: /migrate/:currentVersion:/troubleshooting/#only-one-database-per-instance

[adjust-maintenance-window]: /use-timescale/:currentVersion:/upgrades/#define-your-maintenance-window
[all-available-extensions]: /use-timescale/:currentVersion:/extensions
[create-ec2-instance]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance
[create-service]: /getting-started/:currentVersion:/services/
