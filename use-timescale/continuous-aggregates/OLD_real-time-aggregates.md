---
title: Real-time aggregates
excerpt: Real-time aggregates combine pre-aggregated data with the most recent raw data for up-to-date results
products: [cloud, mst, self_hosted]
keywords: [continuous aggregates, real-time aggregates]
---

import CaggsRealTimeHistoricalDataRefreshes from 'versionContent/_partials/_caggs-real-time-historical-data-refreshes.mdx';

# Real time aggregates

<Highlight type="important">
In Timescale&nbsp;1.7 and later, real time aggregates are enabled by default.
You do not need to manually enable real-time aggregation.
</Highlight>

Real-time aggregates use a live query to combine aggregated data and
not-yet-materialized data that can provide accurate and up-to-date results,
without needing to aggregate data as it is being written. Real-time aggregates
use a `UNION ALL` operator to combine both materialized and non-materialized
data. To do that, it queries the underlying source table and aggregates data for
the missing time range. This means that when you create a continuous aggregate
view, queries to the view include the most recent data, even if it has not yet
been aggregated.

## Use real time aggregates

You can turn real time aggregation on or off by setting the `materialized_only`
parameter when you create or alter the view.

<Highlight type="important">
In Timescale&nbsp;1.7 and later, real time aggregates are enabled by default.
You do not need to manually enable real-time aggregation.
</Highlight>

<Procedure>

### Using real time aggregation

1.  For an existing table, at the `psql` prompt, turn off real time aggregation:

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

[troubleshooting]: /use-timescale/:currentVersion:/continuous-aggregates/troubleshooting/#updates-to-previously-materialized-regions-are-not-shown-in-continuous-aggregates
