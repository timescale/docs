---
title: Continuous aggregate watermark is in the future
section: troubleshooting
topics: [continuous aggregates]
apis:
  - [continuous aggregates, CREATE MATERIALIZED VIEW (Continuous Aggregate)]
  - [continuous aggregates, add_continuous_aggregate()]
  - [continuous aggregates, refresh_continuous_aggregate()]
keywords: [continuous aggregates, real-time aggregates]
tags: [continuous aggregates, query]
---

Continuous aggregates use a watermark to indicate which time buckets have
already been materialized. When you query a continuous aggregate, your query
returns materialized data from before the watermark. It returns real-time,
non-materialized data from after the watermark.

In certain cases, the watermark might be in the future. If this happens, all
buckets, including the most recent bucket, are materialized and below the
watermark. No real-time data is returned.

This might happen if you refresh your continuous aggregate over the time window
`<START_TIME>, NULL`, which materializes all recent data. It might also happen
if you create a continuous aggregate using the `WITH DATA` option. This also
implicitly refreshes your continuous aggregate with a window of `NULL, NULL`.

To fix this, create a new continuous aggregate using the `WITH NO DATA` option.
Then use a policy to refresh this continuous aggregate over an explicit time
window.

<procedure>

### Creating a new continuous aggregate with an explicit refresh window

1.  Create a continuous aggregate using the `WITH NO DATA` option:

    ```sql
    CREATE MATERIALIZED VIEW <continuous_aggregate_name>
        WITH (timescaledb.continuous)
        AS SELECT time_bucket('<interval>', <time_column>),
        <other_columns_to_select>,
        ... 
        FROM <hypertable>
        GROUP BY bucket, <optional_other_columns>
        WITH NO DATA;
    ```

1.  Refresh the continuous aggregate using a policy with an explicit
    `end_offset`. For example:

    ```sql
    SELECT add_continuous_aggregate_policy('<continuous_aggregate_name>',
        start_offset => INTERVAL '30 day',
        end_offset => INTERVAL '1 hour',
        schedule_interval => INTERVAL '1 hour');
    ```

1.  Check your new continuous aggregate's watermark to make sure it is in the
    past, not the future.

    Get the ID for the materialization hypertable that contains the actual
    continuous aggregate data:

    ```sql
    SELECT id from _timescaledb_catalog.hypertable 
        WHERE table_name=(
            SELECT materialization_hypertable_name 
                FROM timescaledb_information.continuous_aggregates
                WHERE view_name='<continuous_aggregate_name'
        );
    ```

1.  Use the returned ID to query for the watermark's timestamp:

    ```sql
    SELECT COALESCE(
        _timescaledb_internal.to_timestamp(_timescaledb_internal.cagg_watermark(<ID>)),
        '-infinity'::timestamp with time zone
    );
    ```

<highlight type="warning">
If you choose to delete your old continuous aggregate after creating a new one,
beware of historical data loss. If your old continuous aggregate contained data
that you dropped from your original hypertable, for example through a data
retention policy, the dropped data is not included in your new continuous
aggregate.
</highlight>

</procedure>
