# Delete data in Promscale
Promscale provides several methods for deleting data. You can delete data by
series, by metrics, or by time. You cannot delete trace data.

Additionally, you can have data automatically deleted by setting retention
policies. For more information about Promscale retention policies, see the
[retention policies section][retention].

## Deletion by series with HTTP API
Promscale exposes an HTTP API endpoint for deleting data by series, using
labels. This works the same as the Prometheus `delete` HTTP API endpoint, except
that you need to enable permissions for advanced users. Do this by setting the
[`web-enable-admin-api`][web-enable-admin-api] flag to `true`.

<highlight type="note">
The `start` and `end` timestamp options are not currently supported. The
`delete_series` HTTP API endpoint lets you delete the series only across an
entire time range.
</highlight>

This URL query uses a repeated label matcher argument that selects the series to
delete. You need to provide at least one `match[]` argument:
```bash
match[]=<series_selector>
```

Use the API endpoints:
```bash
POST /delete_series
PUT /delete_series
```

For example, to delete a series with the label `job="prometheus"`, and a regular
expression label of `instance="prom.*"`, use this command:
```bash
curl -X POST -g http://localhost:9201/delete_series?match[]={job="prometheus", instance=~"prom.*"}
```

## Deletion by metrics
You can delete data for an entire metric, using either an SQL query, or an HTTP
API endpoint.

To delete the data for an entire metric from the database using an SQL query,
use the `prom_api.drop_metric(metric_name_to_be_dropped text)` function. This is
an administrative command, and works only when no Promscale instances are
attached to the database.

For example, to delete the metric `container_cpu_load_average_10s`:
```sql
SELECT prom_api.drop_metric('container_cpu_load_average_10s');
```

To delete the data for an entire metric from the database using the HTTP API,
use the `/delete_series` endpoint and pass the metric name to be deleted as the
matcher. This works differently to the SQL method shown, because it deletes all
the data, but leaves the metric itself.

To delete data in Promscale, you need to enable permissions for advanced users.
Do this by setting the [`web-enable-admin-api`][web-enable-admin-api] flag
to `true`.

This URL query uses a repeated label matcher argument that selects the series to
delete. You need to provide at least one `match[]` argument:
```bash
match[]=<series_selector>
```

Use the API endpoints:
```bash
POST /delete_series
PUT /delete_series
```

For example, to delete all the data for the metric
`container_cpu_load_average_10s` using the `/delete_series` HTTP API:
```bash
curl -X POST -g http://localhost:9201/delete_series?match[]=container_cpu_load_average_10s
```

## Deletion by time
You can delete a series of metrics based on time, using an SQL query. Data in a
hypertable chunk can be either compressed and uncompressed, so all compressed
data needs to be decompressed before performing the deletion. You can
recompress the chunks later on, if necessary.

For example, to delete all data from the `container_cpu_load_average_10s` metric
that is older than ten hours, you need to start by decompressing all chunks
related to the hypertable of the metric:
```sql
SELECT decompress_chunks(show_chunks('prom_data.container_cpu_load_average_10s'));
```

Then, you can perform the deletion query:
```sql
DELETE FROM prom_data.container_cpu_load_average_10s WHERE time > Now() - interval '10 hour';
```

If you want to delete a particular series from that metric only, you can use `series_id=<id>` in the `WHERE` clause of the `DELETE` query.

Now, recompress the remaining data:
```sql
SELECT compress_chunks(show_chunks('prom_data.container_cpu_load_average_10s', older_than => '2 hours'));
```


[retention]: /manage-data/retention/
[web-enable-admin-api]: https://github.com/timescale/promscale/blob/master/docs/cli.md#general-flags
