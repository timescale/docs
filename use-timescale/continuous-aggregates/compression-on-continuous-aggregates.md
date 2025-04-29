---
title: Compress continuous aggregates
excerpt: Compressing a continuous aggregate can save you storage space while making sure the data is still available for your analytical workloads. Learn to compress continuous aggregates in Timescale Cloud
products: [cloud, mst, self_hosted]
keywords: [continuous aggregates, compression]
---

# Compress continuous aggregates

To save on storage costs, you use $HYPERCORE to downsample historical data stored in $CAGGs. When you 
[enable columnstore][compression_continuous-aggregate] on a `MATERIALIZED VIEW` your data is compressed at the 
intervals you set in your [columnstore policy][add_columnstore_policy].

$COLUMNSTORE_CAP on works in the same way on [$HYPERTABLEs and $CAGGs][hypercore]. When you enable
$COLUMNSTORE with no other options, your data is `segment_by` to the group by columns in the
$CAGG and `order_by` the time column. Real-time aggregation is disabled.

## Enable $COLUMNSTORE on $CAGG

To enable or disable compression on a $CAGG, set the 
`timescaledb.enable_columnstore` parameter when you alter the view.

<Procedure>

1.  For an existing $CAGG, enable $COLUMNSTORE:

    ```sql
    ALTER MATERIALIZED VIEW cagg_name set (timescaledb.enable_columnstore = true,);
    ```

1.  Disable $COLUMNSTORE:

    ```sql
    ALTER MATERIALIZED VIEW cagg_name set (timescaledb.enable_columnstore = false);
    ```

</Procedure>

Disabling compression on a continuous aggregate fails if there are compressed
chunks associated with the continuous aggregate. In this case, you need to
decompress the chunks, and then drop any compression policy on the continuous
aggregate, before you disable compression. For more detailed information, see
the [decompress chunks][decompress-chunks] section:

```sql
SELECT decompress_chunk(c, true) FROM show_chunks('cagg_name') c;
```

## Compression policies on continuous aggregates

Before setting up a compression policy on a continuous aggregate, you should set
up a [refresh policy][refresh-policy]. The compression policy interval should be
set so that actively refreshed regions are not compressed. This is to prevent
refresh policies from failing. For example, consider a refresh policy like this:

```sql
SELECT add_continuous_aggregate_policy('cagg_name',
  start_offset => INTERVAL '30 days',
  end_offset => INTERVAL '1 day',
  schedule_interval => INTERVAL '1 hour');
```

With this kind of refresh policy, the compression policy needs the
`compress_after` parameter greater than the `start_offset` parameter of the
continuous aggregate policy:

```sql
SELECT add_compression_policy('cagg_name', compress_after=>'45 days'::interval);
```


[hypercore]: /use-timescale/:currentVersion:/hypercore/
[compression_continuous-aggregate]: /api/:currentVersion:/hypercore/alter_materialized_view/
[add_columnstore_policy]: /api/:currentVersion:/hypercore/add_columnstore_policy/
[timescaledb-211]: https://github.com/timescale/timescaledb/releases/tag/2.11.0
[compression]: /use-timescale/:currentVersion:/compression/
[decompress-chunks]:  /use-timescale/:currentVersion:/compression/decompress-chunks
[refresh-policy]: /use-timescale/:currentVersion:/continuous-aggregates/refresh-policies
