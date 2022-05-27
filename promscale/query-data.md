# Query data in Promscale
You can query the data stored in Promscale using SQL (metrics and traces)
and PromQL (only metrics).

PromQL queries have to be directed to the Promscale Connector.
Alternatively, you can direct PromQL queries to the Prometheus instance, 
which reads data from the Connector using the `remote_read`
interface. The Connector, in turn, fetches data from TimescaleDB. You would
typically use a [visualization tool][visualize-data] to run PromQL queries.
Learn more about PromQL in the [Prometheus documentation][promql-docs].

SQL queries are handled directly by TimescaleDB. You can query the data 
in Promscale with your preferred SQL tool. In this section, we use `psql`.
For more information about installing and using `psql`, see the 
[installing psql section][install-psql].

## Query metric data with SQL
This section covers information about the different SQL queries you can use for metrics data.

### Query a metric
When you query a metric, the query is performed against the view of the metric
you're interested in. This example queries a metric named `go_dc_duration` for
its samples in the past five minutes. This metric is a measurement for how long
garbage collection is taking in Go applications:
``` sql
SELECT * from go_gc_duration_seconds
WHERE time > now() - INTERVAL '5 minutes';
```

An example of the output for this query:
```sql
|           time             |    value    | series_id |      labels       | instance_id | job_id | quantile_id |
|----------------------------|-------------|-----------|-------------------|-------------|--------|-------------|
| 2021-01-27 18:43:42.389+00 |           0 |       495 | {208,43,51,212}   |          43 |     51 |         212 |
| 2021-01-27 18:43:42.389+00 |           0 |       497 | {208,43,51,213}   |          43 |     51 |         213 |
| 2021-01-27 18:43:42.389+00 |           0 |       498 | {208,43,51,214}   |          43 |     51 |         214 |
| 2021-01-27 18:43:42.389+00 |           0 |       499 | {208,43,51,215}   |          43 |     51 |         215 |
| 2021-01-27 18:43:42.389+00 |           0 |       500 | {208,43,51,216}   |          43 |     51 |         216 |
```

In this output, each row includes a `series_id` field, which uniquely identifies
its measurements label set. This enables efficient aggregation by series.

Each row also includes a `labels` field, which contains an array of foreign keys
to label key-value pairs making up the label set.

While the `labels` array is the entire label set, there are also separate fields
for each label key in the label set, to simplify access. These fields end with
the suffix `_id` .

### Query values for label keys
Each label key is expanded into its own column, which stores foreign key
identifiers to their value. This allows you to `JOIN`, aggregate, and filter by
label keys and values.

To retrieve the text represented by a label ID, you can use the `val(field_id)`
function. This allows you to do things like aggregation across all series with a
particular label key.

For example, to find the median value for the `go_gc_duration_seconds` metric,
grouped by the job associated with it:
``` sql
SELECT
    val(job_id) as job,
    percentile_cont(0.5) within group (order by value) AS median
FROM
    go_gc_duration_seconds
WHERE
    time > now() - INTERVAL '5 minutes'
GROUP BY job_id;
```

An example of the output for this query:
``` sql
|      job      |  median   |
|---------------|---------- |
| prometheus    |  6.01e-05 |
| node-exporter | 0.0002631 |
```

### Query label sets for a metric
The `labels` field in any metric row represents the full set of labels
associated with the measurement. It is represented as an array of identifiers.
To return the entire labelset in JSON, you can use the `jsonb()` function, like
this:
``` sql
SELECT
    time, value, jsonb(labels) as labels
FROM
    go_gc_duration_seconds
WHERE
    time > now() - INTERVAL '5 minutes';
```

An example of the output for this query:
```sql
|            time            |    value    |                                                        labels                                                       | 
|----------------------------|-------------|--------------------------------------------------------------------------------------------------------------------|
| 2021-01-27 18:43:48.236+00 | 0.000275625 | {"job": "prometheus", "__name__": "go_gc_duration_seconds", "instance": "localhost:9090", "quantile": "0.5"}        | 
| 2021-01-27 18:43:48.236+00 | 0.000165632 | {"job": "prometheus", "__name__": "go_gc_duration_seconds", "instance": "localhost:9090", "quantile": "0.25"}       |
| 2021-01-27 18:43:48.236+00 | 0.000320684 | {"job": "prometheus", "__name__": "go_gc_duration_seconds", "instance": "localhost:9090", "quantile": "0.75"}       |
| 2021-01-27 18:43:52.389+00 |  1.9633e-05 | {"job": "node-exporter", "__name__": "go_gc_duration_seconds", "instance": "node_exporter:9100", "quantile": "0"}   |
| 2021-01-27 18:43:52.389+00 |  1.9633e-05 | {"job": "node-exporter", "__name__": "go_gc_duration_seconds", "instance": "node_exporter:9100", "quantile": "1"}   |
| 2021-01-27 18:43:52.389+00 |  1.9633e-05 | {"job": "node-exporter", "__name__": "go_gc_duration_seconds", "instance": "node_exporter:9100", "quantile": "0.5"} |
```

This query returns the label set for the metric `go_gc_duration` in JSON format,
so you can read or further interact with it.

### Advanced query: percentiles aggregated over time and series
This query calculates the 99th percentile over both time and series (`app_id`)
for the metric named `go_gc_duration_seconds`. This metric is a measurement for
how long garbage collection is taking in Go applications:
``` sql
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

### Filter by labels
You can filter by labels, because matching operators correspond to the selectors in
PromQL. The operators are used in a `WHERE` clause, in the
`labels ? (<label_key> <operator> <pattern>)`.

The four matching operators are:

|Operator|Description|
|-|-|
|`==`|Matches tag values that are equal to the pattern|
|`!==`|Matches tag values that are not equal to the pattern|
|`==~`|Matches tag values that match the pattern regex|
|`!=~`|Matches tag values that are not equal to the pattern regex|

Each operator corresponds to a selector in PromQL, although they have slightly
different spellings to avoid clashing with other PostgreSQL operators. You can
combine them using any Boolean logic, with any arbitrary `WHERE` clauses. For
example, if you want only metrics from the job called `node-exporter`, you can
filter by labels like this:
``` sql
SELECT
    time, value, jsonb(labels) as labels
FROM
    go_gc_duration_seconds
WHERE
    labels ? ('job' == 'node-exporter')
    AND time > now() - INTERVAL '5 minutes';
```

An example of the output for this query:
```sql
| time                       |   value   |              labels                                                                                              |
|----------------------------|-----------|------------------------------------------------------------------------------------------------------------------|
| 2021-01-28 02:01:18.066+00 |  3.05e-05 | {"job": "node-exporter", "__name__": "go_gc_duration_seconds", "instance": "node_exporter:9100", "quantile": "0"}|
| 2021-01-28 02:01:28.066+00 |  3.05e-05 | {"job": "node-exporter", "__name__": "go_gc_duration_seconds", "instance": "node_exporter:9100", "quantile": "0"}|
|2021-01-28 02:01:38.032+00  |  3.05e-05 | {"job": "node-exporter", "__name__": "go_gc_duration_seconds", "instance": "node_exporter:9100", "quantile": "0"}|
```

### Query the number of datapoints in a series
Each row in a metric's view has a `series_id` that uniquely identifies the
measurement's label set. This allows you to aggregate by series more
efficiently. You can retrieve the labels array from a `series_id` using the
`labels(series_id)` function. For example, this query shows how many data points
we have in each series:
``` sql
SELECT jsonb(labels(series_id)) as labels, count(*)
FROM go_gc_duration_seconds
GROUP BY series_id;
```

An example of the output for this query:
```sql 
|                                                       labels                                                        | count |
|---------------------------------------------------------------------------------------------------------------------|-------|
|{"job": "node-exporter", "__name__": "go_gc_duration_seconds", "instance": "node_exporter:9100", "quantile": "0.75"} |   631 |
|{"job": "prometheus", "__name__": "go_gc_duration_seconds", "instance": "localhost:9090", "quantile": "0.75"}        |   631 |
|{"job": "node-exporter", "__name__": "go_gc_duration_seconds", "instance": "node_exporter:9100", "quantile": "1"}    |   631 |
|{"job": "node-exporter", "__name__": "go_gc_duration_seconds", "instance": "node_exporter:9100", "quantile": "0.5"}  |   631 |
|{"job": "prometheus", "__name__": "go_gc_duration_seconds", "instance": "localhost:9090", "quantile": "0.5"}         |   631 |
|{"job": "node-exporter", "__name__": "go_gc_duration_seconds", "instance": "node_exporter:9100", "quantile": "0"}    |   631 |
|{"job": "prometheus", "__name__": "go_gc_duration_seconds", "instance": "localhost:9090", "quantile": "1"}           |   631 |
|{"job": "node-exporter", "__name__": "go_gc_duration_seconds", "instance": "node_exporter:9100", "quantile": "0.25"} |   631 |
|{"job": "prometheus", "__name__": "go_gc_duration_seconds", "instance": "localhost:9090", "quantile": "0.25"}        |   631 |
|{"job": "prometheus", "__name__": "go_gc_duration_seconds", "instance": "localhost:9090", "quantile": "0"}           |   631 |
```

### Other complex queries
The examples in this section are for querying metrics from Prometheus and
`node_exporter`. A more complex example provided by [Dan Luu][sql-query-dan-luu]
shows how you can discover Kubernetes containers that are over-provisioned. In
this query, you find containers whose 99th percentile memory utilization is low,
like this:
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
