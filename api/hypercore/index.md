---
title: Hypercore
excerpt: Reference information about the TimescaleDB hybrid row-columnar storage engine
keywords: [hypercore]
tags: [hypercore]
products: [cloud, self_hosted]
api:
  license: community
---

import Since2180 from "versionContent/_partials/_since_2_18_0.mdx";

# Hypercore

Hypercore is the $TIMESCALE_DB hybrid row-columnar storage engine, designed specifically for
real-time analytics and powered by time-series data. The advantage of hypercore is its ability
to seamlessly switch between row-oriented and column-oriented storage. This flexibility enables
$CLOUD_LONG to deliver the best of both worlds, solving the key challenges in real-time analytics.

Hypercore’s hybrid approach combines the benefits of row-oriented and column-oriented formats
in each $CLOUD_LONG service:

- **Fast ingest with rowstore**: new data is initially written to the rowstore, which is optimized for
  high-speed inserts and updates. 

- **Efficient analytics with columnstore**: you create [columnstore_policies][hypercore_workflow] 
  that automatically move your data to the columnstore as it _cools_. 

- **Faster queries on compressed data in columnstore**: in columnstore conversion, hypertable
  chunks are compressed by more than 90%, and organized for efficient, large-scale queries more suitable 
  for analytics. This saves on storage costs, and keeps your queries operating at lightning speed.

- **Full mutability with transactional semantics**: regardless of where data is stored,
  hypercore provides full ACID support.

<Since2180 />

## Hypercore workflow

Best practice for using Hypercore is to: 

<Procedure>

1. **Enable columnstore**

   * [Use `ALTER TABLE` for a hypertable][alter_table_hypercore]
     ```sql
     ALTER TABLE crypto_ticks SET (
        timescaledb.enable_columnstore = true, 
        timescaledb.segmentby = 'symbol');
     ```
   * [Use ALTER MATERIALIZED VIEW for a continuous aggregate][compression_continuous-aggregate]
     ```sql
     ALTER MATERIALIZED VIEW assets_candlestick_daily set (
        timescaledb.enable_columnstore = true, 
        timescaledb.segmentby = 'symbol' );
     ```

1. **Add a policy to move chunks to the columnstore at a specific time interval**

   For example, 7 days after the data was added to the table:
   ``` sql
   CALL add_columnstore_policy('crypto_ticks', after => INTERVAL '7d');
   ```
   See [add_columnstore_policy][add_columnstore_policy].

1. **View the policies that you set or the policies that already exist**

   ``` sql
   SELECT * FROM timescaledb_information.jobs
   WHERE proc_name='policy_compression';
   ```
   See [timescaledb_information.jobs][informational-views].

</Procedure>     

You can also [convert_to_columnstore][convert_to_columnstore] and [convert_to_rowstore][convert_to_rowstore] manually
for more fine-grained control over your data.

## Limitations

Chunks in the columnstore have the following limitations:

*   `ROW LEVEL SECURITY` is not supported on chunks in the columnstore.
*   To add unique constraints on chunks in the columnstore [convert_the chunk to rowstore][convert_to_rowstore],
    add the constraints to your data, then  [convert the chunk back to the columnstore][convert_to_columnstore].
*   [SkipScan][skipscan] does not currently work on chunks in the columnstore.


[alter_table_hypercore]: /api/:currentVersion:/hypercore/alter_table/
[compression_continuous-aggregate]: /api/:currentVersion:/hypercore/alter_materialized_view/
[convert_to_rowstore]: /api/:currentVersion:/hypercore/convert_to_rowstore/
[convert_to_columnstore]: /api/:currentVersion:/hypercore/convert_to_columnstore/
[informational-views]: /api/:currentVersion:/informational-views/jobs/
[skipscan]: /use-timescale/:currentVersion:/query-data/skipscan/
[add_columnstore_policy]: /api/:currentVersion:/hypercore/add_columnstore_policy/
[hypercore_workflow]: /api/:currentVersion:/hypercore/#hypercore-workflow
[alter_job]: /api/:currentVersion:/actions/alter_job/
[remove_columnstore_policy]: /api/:currentVersion:/hypercore/remove_columnstore_policy/
