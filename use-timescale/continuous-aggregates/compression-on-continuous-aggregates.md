---
title: Compress continuous aggregates
excerpt: Compressing a continuous aggregate can save you storage space while making sure the data is still available for your analytical workloads
products: [cloud, mst, self_hosted]
keywords: [continuous aggregates, compression]
---

import Since2200 from "versionContent/_partials/_since_2_20_0.mdx";

# Convert continuous aggregates to the columnstore

To save on storage costs, you use $HYPERCORE to downsample historical data stored in $CAGGs. After you 
[enable columnstore][compression_continuous-aggregate] on a `MATERIALIZED VIEW`, you set a 
[columnstore policy][add_columnstore_policy]. This policy defines the intervals when chunks in a $CAGG
are compressed as they are converted from the $ROWSTORE to the $COLUMNSTORE.

$COLUMNSTORE_CAP works in the same way on [$HYPERTABLEs and $CAGGs][hypercore]. When you enable
$COLUMNSTORE with no other options, your data is [segmented by][alter_materialized_view_arguments] the `groupby` columns 
in the $CAGG, and [ordered by][alter_materialized_view_arguments] the time column. [Real-time aggregation][real-time-aggregates]
is disabled by default.

<Since2200 /> For the old API, see <a href="https://www.tigerdata.com/docs/use-timescale/latest/compression/compression-on-continuous-aggregates/">Compress continuous aggregates</a>.

## Configure $COLUMNSTORE on $CAGGs

For an [existing $CAGG][create-cagg]:

<Procedure>

1. **Enable $COLUMNSTORE on a $CAGG**

   To enable the $COLUMNSTORE compression on a $CAGG, set `timescaledb.enable_columnstore = true` when you alter the view:

   ```sql
   ALTER MATERIALIZED VIEW <cagg_name> set (timescaledb.enable_columnstore = true);
   ```
   To disable the $COLUMNSTORE compression, set  `timescaledb.enable_columnstore = false`:

1. **Set $COLUMNSTORE policies on the $CAGG**

   Before you set up a $COLUMNSTORE policy on a $CAGG, you first set the [refresh policy][refresh-policy]. To 
   prevent refresh policies from failing, you set the $COLUMNSTORE policy interval so that actively 
   refreshed regions are not compressed. For example: 

   1. **Set the refresh policy**

      ```sql
      SELECT add_continuous_aggregate_policy('<cagg_name>',
        start_offset => INTERVAL '30 days',
        end_offset => INTERVAL '1 day',
        schedule_interval => INTERVAL '1 hour');
      ```

   1. **Set the columnstore policy**

      For this refresh policy, the `after` parameter must be greater than the value of 
      `start_offset` in the refresh policy:

      ```sql
      CALL add_columnstore_policy('<cagg_name>', after => INTERVAL '45 days');
      ```

</Procedure>


[hypercore]: /use-timescale/:currentVersion:/hypercore/
[compression_continuous-aggregate]: /api/:currentVersion:/continuous-aggregates/alter_materialized_view/
[add_columnstore_policy]: /api/:currentVersion:/hypercore/add_columnstore_policy/
[timescaledb-211]: https://github.com/timescale/timescaledb/releases/tag/2.11.0
[compression]: /use-timescale/:currentVersion:/compression/
[decompress-chunks]:  /use-timescale/:currentVersion:/compression/decompress-chunks
[refresh-policy]: /use-timescale/:currentVersion:/continuous-aggregates/refresh-policies
[alter_materialized_view_arguments]: /api/:currentVersion:/continuous-aggregates/alter_materialized_view/#arguments
[create-cagg]: /use-timescale/:currentVersion:/continuous-aggregates/create-a-continuous-aggregate/
[real-time-aggregates]: /use-timescale/:currentVersion:/continuous-aggregates/real-time-aggregates/
