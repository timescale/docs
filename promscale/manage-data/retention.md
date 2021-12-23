# Configure data retention policies in Promscale

Promscale offers full control over metric data retention i.e., you can set a default data retention period as well as overwrite the default on a per-metric basis.

A maintenance job periodically removes metric data that no longer falls within the defined retention period. The maintenance job is automatically scheduled in TimescaleDB version 2.0 and higher using the job scheduling function provided by the database. If you are using a prior version of TimecaleDB you will have to use cron or a similar tool to schedule the maintenance task. See the [installation instructions][promscale-install] for your platform for more details.

Below are a few examples of how to configure retention policies.

SQL command to set the default retention policy to two days for all metrics that do not have custom retention policy already configured.

```
SELECT prom_api.set_default_retention_period(INTERVAL '1 day' * 2)
```

SQL command to set a custom retention policy for a specific metric.

```
SELECT prom_api.set_metric_retention_period('container_cpu_usage_seconds_total', INTERVAL '1 month')
```

SQL command to reset specific metric retention to the default metric retention.

```
SELECT prom_api.reset_metric_retention_period('container_cpu_usage_seconds_total')
```

[promscale-install]: /installation/