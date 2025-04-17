---
title: Real-time aggregates
excerpt: Real-time aggregates combine pre-aggregated data with the most recent raw data for up-to-date results. Learn how to use real-time aggregates for your analytical workloads
products: [cloud, mst, self_hosted]
keywords: [continuous aggregates, real-time aggregates]
---

import CaggsRealTimeHistoricalDataRefreshes from 'versionContent/_partials/_caggs-real-time-historical-data-refreshes.mdx';

# Real-time aggregates

Rapidly growing data means you need more control over what to aggregate and how to aggregate it. With this in mind, $CLOUD_LONG equips you with tools for more fine-tuned data analysis. 

By default, continuous aggregates do not include the most recent data chunk from the
underlying hypertable. Real-time aggregates, however, use the aggregated data **and** add the
most recent raw data to it. This provides accurate and up-to-date results, without
needing to aggregate data as it is being written.

For more detail on the comparison between continuous and real-time aggregates,
see our [real time aggregate blog post][blog-rtaggs].

## Use real-time aggregates

You can enable and disable real-time aggregation by setting the
`materialized_only` parameter when you create or alter the view.

<Procedure>

1.  For an existing table, at the `psql` prompt, disable real-time aggregation:

    ```sql
    ALTER MATERIALIZED VIEW table_name set (timescaledb.materialized_only = true);
    ```

1.  Re-enable real-time aggregation:

    ```sql
    ALTER MATERIALIZED VIEW table_name set (timescaledb.materialized_only = false);
    ```

</Procedure>

## Real-time aggregates and refreshing historical data

<CaggsRealTimeHistoricalDataRefreshes />

For more information, see the [troubleshooting section][troubleshooting].

[blog-rtaggs]: https://blog.timescale.com/blog/achieving-the-best-of-both-worlds-ensuring-up-to-date-results-with-real-time-aggregation/
[troubleshooting]: /use-timescale/:currentVersion:/continuous-aggregates/troubleshooting/#updates-to-previously-materialized-regions-are-not-shown-in-continuous-aggregates
