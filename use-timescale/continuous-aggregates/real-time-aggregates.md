---
title: Real-time aggregates
excerpt: Real-time aggregates combine pre-aggregated data with the most recent raw data for up-to-date results
products: [cloud, mst, self_hosted]
keywords: [continuous aggregates, real-time aggregates]
---

import CaggsRealTimeHistoricalDataRefreshes from 'versionContent/_partials/_caggs-real-time-historical-data-refreshes.mdx';

# Real time aggregates

Continuous aggregates do not include the most recent data chunk from the
underlying hypertable. Real time aggregates use the aggregated data and add the
most recent raw data to it to provide accurate and up to date results, without
needing to aggregate data as it is being written. In Timescale versions 1.7 to 2.12,
real time aggregates are enabled by default; when you create a continuous
aggregate view, queries to that view include the most recent data, even if
it has not yet been aggregated. In [Timescale v2.13 and later][rta-disabled-release-notes] real time aggregates are *DISABLED* by default.

For more detail on the comparison between continuous and real time aggregates,
see our [real time aggregate blog post][blog-rtaggs].

## Use real time aggregates

You can enable and disable real time aggregation by setting the
`materialized_only` parameter when you create or alter the view.

<Procedure>

### Using real time aggregation

1.  For an existing table, at the `psql` prompt, disable real time aggregation:

    ```sql
    ALTER MATERIALIZED VIEW table_name set (timescaledb.materialized_only = true);
    ```

1.  Re-enable real time aggregation:

    ```sql
    ALTER MATERIALIZED VIEW table_name set (timescaledb.materialized_only = false);
    ```

</Procedure>

## Real-time aggregates and refreshing historical data

<CaggsRealTimeHistoricalDataRefreshes />

For more information, see the [troubleshooting section][troubleshooting].

[blog-rtaggs]: https://blog.timescale.com/blog/achieving-the-best-of-both-worlds-ensuring-up-to-date-results-with-real-time-aggregation/
[troubleshooting]: /use-timescale/:currentVersion:/continuous-aggregates/troubleshooting/#updates-to-previously-materialized-regions-are-not-shown-in-continuous-aggregates
[rta-disabled-release-notes]: /about/:currentVersion:/release-notes/#starting-from-timescaledb-2130
