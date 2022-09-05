---
title: Delete data in Promscale
excerpt: Delete data in Promscale
product: promscale
keywords: [delete]
tags: [metrics]
---

# Delete data in Promscale

Promscale provides several methods for deleting data. You can delete metric data
by series, by metric name, or by time. You can also delete trace data.

<highlight type="warning">
There is no way to undo data deletion. If you need to restore your data,
you must restore from backup.
</highlight>

Additionally, you can have data automatically deleted by setting retention
policies. For more information about Promscale retention policies, see the
[retention policies section][retention].

## Delete metric data

### Deletion by series with HTTP API

Promscale exposes an HTTP API endpoint for deleting metric data by series, using
labels. This works the same as the Prometheus `delete` HTTP API endpoint, except
that you need to enable permissions for advanced users. Do this by setting the
[`web-enable-admin-api`][web-enable-admin-api] flag to `true`.

<highlight type="note">
The `start` and `end` timestamp options are not currently supported. The
`delete_series` HTTP API endpoint lets you delete the metric series only across an
entire time range.
</highlight>

This URL query uses a repeated label matcher argument that selects the metric series
to delete. You need to provide at least one `match[]` argument:

```bash
match[]=<SERIES_SELECTOR>
```

Use the API endpoints:

```bash
POST /delete_series
PUT /delete_series
```

For example, to delete a metric series with the label `job="prometheus"`, and a regular
expression label of `instance="prom.*"`, use this command:

```bash
curl -X POST -g http://localhost:9201/delete_series?match[]={job="prometheus", instance=~"prom.*"}
```

### Deletion by metric name

You can delete all data for a metric, using either an SQL query, or an HTTP
API endpoint.

To delete all data for a metric from the database using a SQL query,
use the `prom_api.drop_metric(metric_name_to_be_dropped text)` function. This is
an administrative command, and works only when no Promscale instances are
attached to the database.

For example, to delete the metric `container_cpu_load_average_10s`:

```sql
SELECT prom_api.drop_metric('container_cpu_load_average_10s');
```

To delete the data for a metric from the database using the HTTP API,
use the `/delete_series` endpoint and pass the metric name to be deleted as the
matcher. This works differently to the SQL method shown, because it deletes all
the individual data points for that metric, but leaves the metric itself.

To delete data in Promscale, you need to enable permissions for advanced users.
Do this by setting the [`web.enable-admin-api`][web-enable-admin-api] flag
to `true`.

This URL query uses a repeated label matcher argument that selects the series to
delete. You need to provide at least one `match[]` argument:

```bash
match[]=<SERIES_SELECTOR>
```

Use the API endpoints:

```bash
POST /delete_series
PUT /delete_series
```

For example, to delete all the data points for the metric
`container_cpu_load_average_10s` using the `/delete_series` HTTP API:

```bash
curl -X POST -g http://localhost:9201/delete_series?match[]=container_cpu_load_average_10s
```

### Deletion by time

You can delete metric data points based on time, using an SQL query. Any compressed
data needs to be decompressed before performing the deletion. You can
recompress the chunks later on, if necessary.

For example, to delete all data from the `container_cpu_load_average_10s` metric
that is older than 10 hours, decompress all chunks
related to the hypertable of the metric:

```sql
SELECT decompress_chunk(show_chunks('prom_data.container_cpu_load_average_10s'));
```

Then, perform the deletion query:

```sql
DELETE FROM prom_data.container_cpu_load_average_10s WHERE time > Now() - interval '10 hour';
```

If you want to delete a particular series from that metric only, you can use `series_id=<ID>`
in the `WHERE` clause of the `DELETE` query.

Now, recompress the remaining data:

```sql
SELECT compress_chunk(show_chunks('prom_data.container_cpu_load_average_10s', older_than => '2 hours'));
```

## Delete trace data

You can delete all trace data from the database using the
`ps_trace.delete_all_traces()` function. This function restores the schema to a
default state, truncates the tables in the `_ps_trace` schema, and deletes all
the data. You can only run the function when the Promscale Connector is not
running.
<highlight type="note">
To run this function: first stop the Promscale Connector, then connect to the
database and run `SELECT ps_trace.delete_all_traces();`, finally start the
Promscale Connector.
</highlight>

[retention]: /promscale/:currentVersion:/manage-data/retention/
[web-enable-admin-api]: /promscale/:currentVersion:/cli/#web-server-flags
