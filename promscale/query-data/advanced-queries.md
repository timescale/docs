# Advanced queries
This section contains some examples of more complicated queries.

## Query percentiles aggregated over time and series
This query calculates the ninety-ninth percentile over both time and series
(`app_id`) for the metric named `go_gc_duration_seconds`. This metric is a
measurement for how long garbage collection is taking in Go applications:

```sql
SELECT
    val(instance_id) as app,
    percentile_cont(0.99) within group(order by value) p99
FROM
    go_gc_duration_seconds
WHERE
    value != 'NaN' AND val(quantile_id) = '1' AND instance_id > 0
GROUP BY instance_id
ORDER BY p99 desc;
```

An example of the output for this query:
```sql
|       app         |     p99      |
|-------------------|------------  |
|node_exporter:9100 | 0.002790063  |
|localhost:9090     |  0.00097977  |
```

This query is unique to Promscale, as it aggregates over both time and series
and returns an accurate calculation of the percentile. It is not possible to use
PromQL alone to accurately calculate percentiles when aggregating over both time
and series.

## Other complex queries
The examples in this section are for querying metrics from Prometheus and
`node_exporter`. A more complex example provided by [Dan Luu][sql-query-dan-luu]
shows how you can discover Kubernetes containers that are over-provisioned. In
this query, you find containers whose ninety-ninth percentile memory utilization
is low, like this:

```sql
WITH memory_allowed as (
  SELECT
    labels(series_id) as labels,
    value,
    min(time) start_time,
    max(time) as end_time
  FROM container_spec_memory_limit_bytes total
  WHERE value != 0 and value != 'NaN'
  GROUP BY series_id, value
)
SELECT
  val(memory_used.container_id) container,
  percentile_cont(0.99)
    within group(order by memory_used.value/memory_allowed.value)
    AS percent_used_p99,
  max(memory_allowed.value) max_memory_allowed
FROM container_memory_working_set_bytes AS memory_used
INNER JOIN memory_allowed
      ON (memory_used.time >= memory_allowed.start_time AND
          memory_used.time <= memory_allowed.end_time AND
          eq(memory_used.labels,memory_allowed.labels))
WHERE memory_used.value != 'NaN'
GROUP BY container
ORDER BY percent_used_p99 ASC
LIMIT 100;
```

An example of the output for this query:
```sql
| container                      |   percent_used_p99      |  total      |
|--------------------------------|-------------------------|-------------|
| cluster-overprovisioner-system |   6.961822509765625e-05 | 4294967296  |
| sealed-secrets-controller      |   0.00790748596191406   | 1073741824  |
| dumpster                       |   0.0135690307617187    |  268435456  |
```

This example uses `cAdvisor`, as an example of the sorts of sophisticated
analysis enabled by Promscale's support to query your data in SQL.

[install-psql]: /timescaledb/:currentVersion:/how-to-guides/connecting/psql/
[sql-query-dan-luu]: https://danluu.com/metrics-analytics/
[visualize-data]: /promscale/:currentVersion:/visualize-data/
[promql-docs]: https://prometheus.io/docs/prometheus/latest/querying/basics/
