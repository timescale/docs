# Metrics
You can view your service metrics from Timescale Cloud's [metrics
dashboard](#metrics-dashboard). This dashboard gives you service-level
information, such as CPU, memory, and storage usage.

You can also view your query statistics by using the pre-installed
[`pg_stat_statements`](#query-level-statistics-with-pg-stat-statements)
extension from a PostgreSQL client.

## Metrics dashboard
Timescale Cloud provides a Metrics dashboard for managing your services. You can
see the Metrics dashboard in your Timescale Cloud account by navigating to the
`Services` section, clicking the service you want to explore, and selecting the
`Metrics` tab.

You can view metrics for your services for any of these time ranges:
*   Last hour, with one minute granularity
*   Last 24 hours, with one minute granularity
*   Last seven days, with one hour granularity
*   Last 30 days, with one hour granularity

To change the view, select the time range from the drop-down menu.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-metrics_lastmonth.png" alt="Timescale Cloud Metrics dashboard"/>

Additionally, you can turn automatic metric refreshes on and off. When automatic
metric refresh is on, the dashboard updates every thirty seconds.

In some cases, gray vertical bars display on the metrics dashboard, like this:

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-metrics_graybar.png" alt="Timescale Cloud Metrics not collected"/>

This indicates that metrics have not been collected for the period shown. It
does not mean that your Timescale Cloud service was down.

# Query-level statistics with pg_stat_statements
The `pg_stat_statements` extension gives you query-level statistics for your SQL
statements. It comes pre-installed with Timescale Cloud.

<highlight type="note">
For more information about `pg_stat_statements`, see the 
[PostgreSQL documentation](https://www.postgresql.org/docs/current/pgstatstatements.html).
</highlight>

## Query the pg_stat_statements view
You can view statistics for your queries through the `pg_stat_statements`
extension, which provides a `pg_stat_statements` view. The recorded statistics
include the time spent planning and executing each query; the number of blocks
hit, read, and written; and more.

You can query the `pg_stat_statements` view as you would any PostgreSQL view.
Limit the results to the current user, which is `tsdbadmin` by default. This
filters out superuser queries that are used by Timescale Cloud to manage your
service.

Connect to your database using a PostgreSQL client, such as [`psql`][psql], and
run:
```sql
SELECT * FROM pg_stat_statements WHERE pg_get_userbyid(userid) = current_user;
```

<highlight type="important">
You cannot currently enable `track_io_timing` for your database. Statistics that
depend on `track_io_timing`, such as `blk_read_time` and `blk_write_time`, are
not collected.
</highlight>

## Example usage
With `pg_stat_statements`, you can view performance statistics to help you
monitor and optimize your queries.

Here are some sample queries to try.

[psql]: /timescaledb/:currentVersion:/how-to-guides/connecting/about-psql/