## Creating Automatic Data Retention Policies

TimescaleDB includes a background job scheduling framework for automating data
management tasks, such as enabling easy data retention policies.

To add such data retention policies, a database administrator can create,
remove, or alter policies that cause `drop_chunks` to be automatically executed
according to some defined schedule.

To add such a policy on a hypertable, continually causing chunks older than 24
hours to be deleted, simply execute the command:
```sql
SELECT add_retention_policy('conditions', INTERVAL '24 hours');
```

To subsequently remove the policy:
```sql
SELECT remove_retention_policy('conditions');
```

The scheduler framework also allows one to view scheduled jobs:
```sql
SELECT * FROM timescaledb_information.job_stats;
```

For more information, please see the [API documentation][add_retention_policy].



[add_retention_policy]: /api#add_retention_policy