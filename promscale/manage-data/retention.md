# Configure data retention policies in Promscale
You can control how metric data is retained in Promscale. For example, you can
set a default data retention period, and override the default on a per-metric
basis.

A maintenance job periodically removes metric data that is outside the defined
retention period. The maintenance job is automatically scheduled in TimescaleDB
version 2.0 and higher using the job scheduling function. If you are using an
earlier version of TimescaleDB, you can use `cron` or a similar scheduling tool
to schedule the maintenance task. See the
[installation instructions][promscale-install] for your platform for more
details.

The `_ps_trace.span`, `_ps_trace.event`, and `_ps_trace.link` hypertables have
an automated data retention policy which drops chunks beyond a certain age. By
default, the retention period is 30 days, or you can use the
`ps_trace.get_trace_retention_period()` function to get the current trace
retention period:
```sql
SELECT ps_trace.get_trace_retention_period();
```

You can change the retention period by adjusting the `trace_retention_period`
parameter. Alternatively, use the
`ps_trace.set_trace_retention_period(_trace_retention_period INTERVAL)`
function:
```sql
SELECT ps_trace.set_trace_retention_period(30 * INTERVAL '1 day');
```

You can delete all trace data from the database using the
`ps_trace.delete_all_traces()` function. This function restores the schema to a
default state, truncates the tables in the `_ps_trace` schema, and deletes all
the data. There is no way to undo this action. If you need to restore your data,
you must restore from backup.

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
