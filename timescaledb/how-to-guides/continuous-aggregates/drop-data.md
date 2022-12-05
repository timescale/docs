---
title: Dropping data
excerpt: Drop raw data from a continuous aggregate or its underlying hypertable
keywords: [continuous aggregates, hypertables, delete]
tags: [drop]
---

# Dropping data

When you are working with continuous aggregates, you can drop a view, or you can
drop raw data from the underlying hypertable or from the continuous aggregate
itself. A combination of [refresh][cagg-refresh] and data retention policies
can help you downsample your data. This lets you keep historical data at a
lower granularity than recent data.

However, you should be aware if a retention policy is likely to drop raw data
from your hypertable that you need in your continuous aggregate.

To simplify the process of setting up downsampling, you can use the [visualizer
and code generator][visualizer] below.

## Drop a continuous aggregate view

You can drop a continuous aggregate view using the `DROP MATERIALIZED VIEW`
command. This command also removes refresh policies defined on the continuous
aggregate. It does not drop the data from the underlying hypertable.

<procedure>

### Dropping a continuous aggregate view

1.  From the `psql`prompt, drop the view:

    ```sql
    DROP MATERIALIZED VIEW view_name;
    ```

</procedure>

## Drop raw data from a hypertable

If you drop data from a hypertable used in a continuous aggregate it can lead to
problems with your continuous aggregate view. In many cases, dropping underlying
data replaces the aggregate with NULL values, which can lead to unexpected
results in your view.

You can drop data from a hypertable using `drop_chunks` in the usual way, but
before you do so, always check that the chunk is not within the refresh window
of a continuous aggregate that still needs the data. This is also important if
you are manually refreshing a continuous aggregate. Calling
`refresh_continuous_aggregate` on a region containing dropped chunks
recalculates the aggregate without the dropped data.

If a continuous aggregate is refreshing when data is dropped because of a
retention policy, the aggregate is updated to reflect the loss of data. If you
need to retain the continuous aggregate after dropping the underlying data, set
the `start_offset` value of the aggregate policy to a smaller interval than the
`drop_after` parameter of the retention policy.

For more information, see the
[data retention documentation][data-retention-with-continuous-aggregates].

<PolicyVisualizerDownsampling />

[cagg-refresh]: /timescaledb/:currentVersion:/how-to-guides/continuous-aggregates/refresh-policies/
[data-retention-with-continuous-aggregates]:
    /timescaledb/:currentVersion:/how-to-guides/data-retention/data-retention-with-continuous-aggregates
[visualizer]: #set-up-downsampling-and-data-retention
