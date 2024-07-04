Before you migrate your data:

- [Create a target Timecale Cloud service][created-a-database-service-in-timescale].

  Each Timescale Cloud service [has a single database] that supports the
  [following extensions][all available extensions]. Timescale Cloud services do not support [tablespaces],
  and [there is no superuser associated with a Timescale service][no-superuser-for-timescale-instance].

- Ensure that the version of PostgreSQL running in your target Timescale Cloud service is greater than or equal to the source database.
- In your target Timescale Cloud service, enable the PostgreSQL extensions used in your source database.


[created-a-database-service-in-timescale]: /getting-started/:currentVersion:/services/
[has a single database]: /migrate/:currentVersion:/troubleshooting/#only-one-database-per-instance
[all available extensions]: /migrate/:currentVersion:/troubleshooting/#extension-availability
[tablespaces]: /migrate/:currentVersion:/troubleshooting/#tablespaces
[no-superuser-for-timescale-instance]: /migrate/:currentVersion:/troubleshooting/#superuser-privileges