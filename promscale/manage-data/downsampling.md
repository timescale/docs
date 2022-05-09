# Downsample metric data in Promscale
Downsampling is the term used when reducing the rate of a signal. When you
downsample data, the size of the data on disk is reduced, but so is the
resolution of the data. This means that you have fewer entries in your source
data, to take up less space on disk. The main reasons for downsampling are to
reduce cost and increase performance. Querying downsampled data gets faster as
the size of the data decreases.

## Choose a downsampling method
There are two downsampling methods available for use with Promscale: continuous
aggregates, and Prometheus recording rules.

There are a few things to take into account when deciding on a downsampling
method.

*   Access to recent data: if this materialization is being used in operational
    or real-time dashboards, choose continuous aggregates.
*   Size of the time bucket: continuous aggregates materialize the intermediate,
    not the final form, so querying the data is a bit more expensive than with
    recording rules. Choose continuous aggregates if you are aggregating more
    data points together, such as one hour or more of data. Choose recording
    rules for small buckets.
*   Number of metrics in materialization: continuous aggregates can only be
    defined on a single metric. If you need to materialize queries on more than
    one metric, choose recording rules. However, if you want to use continuous
    aggregates, you could consider joining the materialized metrics and querying
    the result of the materialization instead of the raw input.
*   Query flexibility: if you know the exact queries that you want to run on the
    materialization, recording rules can be more efficient. However, if you want
    flexibility in your queries, continuous aggregates can answer more queries
    based on the materialized data.
*   Access to old data: if you need old data points to also be aggregated as
    soon as downsampling for a metric is configured, choose continuous
    aggregates. This is especially important if it is something you do often,
    because backfilling old data with recording rules requires additional steps.

## Promscale continuous aggregates
Promscale can use [TimescaleDB continuous aggregates][tsdb-caggs] to manage data
downsampling and materialization.

<highlight type="warning">
This feature is currently in development. Use this feature at your own risk, and
do not use any experimental features in production. Help us improve Promscale by
[sharing feedback](https://github.com/timescale/promscale/discussions/828) and
[reporting issues](https://github.com/timescale/promscale/issues/new).
</highlight>

Benefits of continuous aggregates:
*   Timeliness: continuous aggregates use real-time aggregates by default. The
    database automatically combines the materialized results with a query over
    the newest not-yet-materialized data to provide an accurate up-to-the-second
    view of your data.
*   Rollups: continuous aggregates store the intermediate state of an aggregate
    in the materialization, making further rollups possible. For more information
    about defining aggregates, see this
    [blog post](https://blog.timescale.com/blog/how-postgresql-aggregation-works-and-how-it-inspired-our-hyperfunctions-design-2/).
*   Query flexibility for retrospective analysis: continuous aggregates are
    multi-purpose. For example, the TimescaleDB toolkit extension supports
    percentile queries on any percentile, and statistical aggregates with
    multiple summary aggregates. The aggregates that you define when you
    configure the materialization allow you to derive a range of different data 
    types at query time.
*   Backfilling: continuous aggregates automatically downsample all data
    available, including past data, so that performance improvements on the
    aggregated metric are seen as soon as it is created.  


For Promscale to be able to use a continuous aggregate as a metric view, the
continuous aggregate must:

*   Be based on a raw metric series ingested by Promscale that is specified in
    the `FROM` clause.
*   Include a column named `time` of type `timestamptz`, that corresponds to the
    time associated with each aggregated metric sample.
*   Include a column named `series_id` of type `bigint`,  that corresponds to
    the `series_id`  from the raw metrics.
*   Any number of additional columns of type `double precision`, that correspond
    to the metric values you want to store.

<highlight type="important">
Continuous aggregates supports only one metric in the `FROM` clause, and can
generate aggregations only within the same `series_id`. This is because
the `series_id` corresponds to a specific metric name and set of labels.
</highlight>

For more information about continuous aggregates, see the
[TimescaleDB continuous aggregates documentation][tsdb-caggs].

### Example of a Promscale continuous aggregate
Creating a continuous aggregate in Promscale requires two operations. Start by
creating a TimescaleDB continuous aggregate, and then register the new metric so
it's available to PromQL queries and other Promscale functions. This section
includes a worked example.

This example uses a metric called `node_memory_MemFree`, and shows you how to
create a continuous aggregate to derive some summary statistics about the metric
on an hourly basis. Run this query on the underlying TimescaleDB database:
```sql
CREATE MATERIALIZED VIEW node_memfree_1hour( time, series_id, min, max, avg)
WITH (timescaledb.continuous) AS
  SELECT
        time_bucket('1 hour', time) + '1 hour' as time ,
        series_id,
        min(value) as min,
        max(value) as max,
        avg(value) as avg
    FROM prom_data.node_memory_MemFree
    GROUP BY time_bucket('1 hour', time), series_id
```

<highlight type="note">
In this example, one hour is added to `time_bucket` in the
`SELECT` clause. This is done to match the PromQL semantics of representing a
bucket with the timestamp at the end of the bucket instead of the start of the
bucket.
</highlight>

This continuous aggregate can now be queried using SQL. To make it possible to
query the data with PromQL, you need to register it with Promscale as a metric
view, including the view schema and the view name in Postgres:
```sql
SELECT register_metric_view('public', 'node_memfree_1hour');
```

You can now use this data as a regular metric in both SQL and PromQL.

To query the average in the new aggregated metric with SQL, and show it in a
time series chart in Grafana, use this query:
```sql
SELECT time, jsonb(labels) as metric, avg
FROM node_memfree_1hour
WHERE $__timeFilter(time)
ORDER BY time ASC
```

To do the same with PromQL, you need to use the `__column__` label. The
aggregated metric stores the data for `min`, `max`, and `avg` in different
columns, which is not supported by Prometheus, because Prometheus stores all
metrics independently. Promscale uses the `__column__` label to identify which
column to return. If no `__column__` label is specified, Promscale returns the
`value` column by default. To query the average in the new aggregated metric
with PromQL, use this query:
```promql
node_memfree_1hour{__column__="avg"}
```

You do not need to specify the `__column__` label in queries, because Promscale
uses the value column by default when ingesting data.

You could modify this continuous aggregate to name one of the metrics `value`,
which would then make Promscale return that metric even if no `__column__` label
is specified. To do this with the previous example, you can create a continuous
aggregate that sets the average as the default to be returned in PromQL queries,
like this:
```sql
CREATE MATERIALIZED VIEW node_memfree_1hour( time, series_id, min, max, value)
WITH (timescaledb.continuous) AS
  SELECT
        time_bucket('1 hour', time) + '1 hour' as time ,
        series_id,
        min(value) as min,
        max(value) as max,
        avg(value) as value
    FROM prom_data.node_memory_MemFree
    GROUP BY time_bucket('1 hour', time), series_id
```

Now you can query the average without the `__column__` label, like this:
```promql
node_memfree_1hour
```

Promscale adds a `__schema__` tag, which helps you identify in which schema the metric view is registered. This is useful if you have two metrics with the same name in different schemas, which is strongly discouraged but could happen by mistake. In this case, you can use the `__schema__` tag to select which schema to use. If you don't specify a schema, Promscale queries the metric in the `prom_data` schema, which is the same schema used for all ingested metrics. To avoid those issues, make sure you name your continuous aggregate views in a way that is different to your raw ingested metrics, for example, `node_memfree_1hour`.

<highlight type="note">
Both the `__schema__` and `__column__` label matchers support exact matching. You cannot use regular expressions or other multi-value matchers. Additionally, metric views are excluded from queries that match multiple metrics, such as matching on metric names with a regular expression, like this:

```sql
{__name__=~"node_mem*"} // this valid PromQL query will not match our previously created metric view
```

</highlight>

### Deleting continuous aggregates
To delete a Promscale continuous aggregate, delete the metric view first, and
then remove the continuous aggregate.

Remove the metric view:
```sql
unregister_metric_view('public', 'node_memfree_1hour');
```

Delete the continuous aggregate:
```sql
DROP MATERIALIZED VIEW node_memfree_1hour;
```

## Prometheus downsampling with recording rules
Prometheus provides a downsampling mechanism called recording rules. These rules
are used to calculate frequently used or computationally expensive queries
before they are required. A recording rule is a PromQL expression that
Prometheus evaluates at a predefined frequency to generate a new metric series.
The new metric series is stored in Promscale, and you can query it in the same
way as any other Prometheus metric. An example recording rule:
```yaml
groups:
  - name: daily_stats
    interval: 1h
    rules:
    - record: customer:api_requests:rate1day
      expr: sum by (customer) (rate(api_requests_total[1d]))

```

For the recording rules to be applied, add the location of the recording rules
file to the Prometheus configuration file:
```yaml
rule_files:
  - "<RECORDING-RULES-FILE>"
```

<highlight type="note">
When you set up the Prometheus configuration file to use recording rules, we
recommend that you also set `read_recent` to `true` in the
[Prometheus `remote_read` configuration](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#remote_read).
This tells Prometheus to fetch data from Promscale when evaluating PromQL
queries, including recording rules. If `read_recent` is disabled, only the data
stored in the Prometheus local on-disk database is used when evaluating alerting and
recording rules, so it is dependent on the retention period of Prometheus rather
than Promscale.
</highlight>

To query the metric with PromQL:
```promql
customer:api_requests:rate1day
```

To query the metric with SQL:
```sql
SELECT time, jsonb(labels) as metric, value
FROM "customer:api_requests:rate1day"
ORDER BY time ASC
```

To learn more about recording rules, see the
[Prometheus documentation][prom-recordingrules].

## Data retention
All metrics in Promscale use the default retention period when they are created.
You can change both the default retention period, and the retention period for
individual metrics. This feature is provided by Promscale, not Prometheus. A
typical use case is to retain aggregated metrics for longer for trend analysis.

For more information about data retention, see the
[metric retention section][retention].


[tsdb-caggs]: timescaledb/:currentVersion:/overview/core-concepts/continuous-aggregates/
[retention]: /manage-data/retention/
[prom-recordingrules]: https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/
