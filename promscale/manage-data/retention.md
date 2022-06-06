# Configure data retention policies in Promscale
You can control how long metric and trace data is retained in Promscale. 

A maintenance job periodically removes metric and trace data that is outside
the defined retention period. In TimescaleDB 2.0 and above, the maintenance
job is automatically scheduled using the job scheduling function. If 
you are using an earlier version of TimescaleDB, you can use `cron` or a 
similar scheduling tool to schedule the maintenance task. See the
[installation instructions][promscale-install] for your platform for more
details.

## Configure data retention for metrics
You can set a default data retention period for metrics, and override the
default on a per-metric basis.

Change the default retention period for metrics by adjusting the 
`retention_period` parameter of the function
`prom_api.set_default_retention_period(retention_period INTERVAL)`:
```sql
SELECT prom_api.set_default_retention_period(30 * INTERVAL '1 day')
```

If you have specific metrics you need to retain for longer, use
the function
`prom_api.set_metric_retention_period(metric_name TEXT, new_retention_period INTERVAL)`:
```sql
SELECT prom_api.set_metric_retention_period('container_cpu_usage_seconds_total', 180 * INTERVAL '1 day')
```

Reset an overridden metric retention period to the default
by using the function `prom_api.reset_metric_retention_period(metric_name TEXT)`
```sql
SELECT prom_api.reset_metric_retention_period('container_cpu_usage_seconds_total')
```

## Configure data retention for traces
The `_ps_trace.span`, `_ps_trace.event`, and `_ps_trace.link` hypertables have
an automated data retention policy which drops chunks beyond a certain age. By
default, the retention period is 30 days, or you can use the
`ps_trace.get_trace_retention_period()` function to get the current trace
retention period:
```sql
SELECT ps_trace.get_trace_retention_period();
```

You can change the retention period by adjusting the `trace_retention_period`
parameter of the function
`ps_trace.set_trace_retention_period(trace_retention_period INTERVAL)`:
```sql
SELECT ps_trace.set_trace_retention_period(30 * INTERVAL '1 day');
```



[promscale-install]: promscale/:currentVersion:/installation/
