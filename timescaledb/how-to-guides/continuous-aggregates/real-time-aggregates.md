---
title: Real-time aggregates
excerpt: Real-time aggregates combine pre-aggregated data with the most recent raw data for up-to-date results
keywords: [continuous aggregates, real-time aggregates]
---

# Real time aggregates
Continuous aggregates do not include the most recent data chunk from the
underlying hypertable. Real time aggregates use the aggregated data and add the
most recent raw data to it to provide accurate and up to date results, without
needing to aggregate data as it is being written. In TimescaleDB 1.7 and later,
real time aggregates are enabled by default. When you create a continuous
aggregate view, queries to that view include the most recent data, even if
it has not yet been aggregated.

For more detail on the comparison between continuous and real time aggregates,
see our [real time aggregate blog post][blog-rtaggs].

## Use real time aggregates
You can enable and disable real time aggregation by setting the
`materialized_only` parameter when you create or alter the view.

<procedure>

### Using real time aggregation
1.  For an existing table, at the `psql` prompt, disable real time aggregation:
    ```sql
    ALTER MATERIALIZED VIEW table_name set (timescaledb.materialized_only = true);
    ```
1.  Re-enable real time aggregation:
    ```sql
    ALTER MATERIALIZED VIEW table_name set (timescaledb.materialized_only = false);
    ```

</procedure>

<highlight type="important">
If you have a time bucket that has already been materialized, the real-time
aggregate won't show the data that has been inserted, updated, or deleted. When
you need to change data that has already been materialized, use
`refresh_continuous_aggregate()` for the corresponding buckets. For more
information, see the [Troubleshooting section](/timescaledb/latest/how-to-guides/continuous-aggregates/troubleshooting/).
</highlight>

[blog-rtaggs]: https://blog.timescale.com/blog/achieving-the-best-of-both-worlds-ensuring-up-to-date-results-with-real-time-aggregation/
