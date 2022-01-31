# Configure data retention policies in Promscale
You can control how metric data is retained in Promscale. For example, you can
set a default data retention period, and override the default on a per-metric
basis.

A maintenance job periodically removes metric data that it outside the defined
retention period. The maintenance job is automatically scheduled in TimescaleDB
version 2.0 and higher using the job scheduling function. If you are using an
earlier version of TimescaleDB, you can use `cron` or a similar scheduling tool
to schedule the maintenance task. See the
[installation instructions][promscale-install] for your platform for more details.

## Example retention policies
To set the default retention policy to two days for all metrics that do not have
a custom retention policy already configured:
```
SELECT prom_api.set_default_retention_period(INTERVAL '1 day' * 2)
```

To set a custom retention policy for a specific metric:
```
SELECT prom_api.set_metric_retention_period('container_cpu_usage_seconds_total', INTERVAL '1 month')
```

To reset a specific metric retention to the default metric retention:
```
SELECT prom_api.reset_metric_retention_period('container_cpu_usage_seconds_total')
```

[promscale-install]: promscale/:currentVersion/installation/
