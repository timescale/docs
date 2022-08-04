---
title: Configure data retention policies in Promscale
excerpt: Configure data retention policies in Promscale
product: promscale
keywords: [data retention]
tags: [configure, metrics, storage]
---

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
Metric data has an automated retention that drops data after a certain age.
The default retention is 90 days which can be customized. It is also possible
to configure a specific retention for a metric. This is typically used if you
want to keep certain important metrics for longer to do trend analysis or for
audit purposes while not incurring the higher storage costs of having to keep
all metrics for longer.

Get the currently configured default retention for metrics using the
`prom_api.get_default_retention_period()` function, like this:
 ```sql
SELECT prom_api.get_default_metric_retention_period();
```

Change the default retention period for metrics by adjusting the 
`retention_period` parameter of the function
`prom_api.set_default_retention_period(retention_period INTERVAL)`:
```sql
SELECT prom_api.set_default_retention_period(30 * INTERVAL '1 day');
```

If you have specific metrics you need to retain for longer, use
the function
`prom_api.set_metric_retention_period(metric_name TEXT, new_retention_period INTERVAL)`:
```sql
SELECT prom_api.set_metric_retention_period('container_cpu_usage_seconds_total', 180 * INTERVAL '1 day');
```

Retrieve the retention being used for a specific metric by using the function
`prom_api.get_metric_retention_period(metric_name TEXT)`:
```sql
SELECT prom_api.get_metric_retention_period('container_cpu_usage_seconds_total');
```
It returns the default retention if no specific retention has been set for the
metric. 

Reset an overridden metric retention period to the default
by using the function `prom_api.reset_metric_retention_period(metric_name TEXT)`
```sql
SELECT prom_api.reset_metric_retention_period('container_cpu_usage_seconds_total');
```

When you change the default retention period, any metrics that have a specific
retention configured will keep that retention unless you reset it as explained
above.

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

[promscale-install]: /promscale/:currentVersion:/installation/
