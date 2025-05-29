---
title: Hypercore
excerpt: Reference information about the TimescaleDB hybrid row-columnar storage engine
keywords: [hypercore]
tags: [hypercore]
products: [cloud, self_hosted]
api:
  license: community
---

import OldCreateHypertable from "versionContent/partials/_old-api-create-hypertable.mdx";
import Since2180 from "versionContent/partials/_since_2_18_0.mdx";
import HypercoreIntro from "versionContent/partials/_hypercore-intro.mdx";

# $HYPERCORE_CAP

<HypercoreIntro />

<Since2180 />

## $HYPERCORE_CAP workflow

Best practice for using $HYPERCORE is to: 

<Procedure>

1. **Enable $COLUMNSTORE**

   Create a [$HYPERTABLE][hypertables-section] for your time-series data using [CREATE TABLE][hypertable-create-table].
   For [efficient queries][secondary-indexes] on data in the columnstore, remember to `segmentby` the column you will
   use most often to filter your data. For example:

   * [Use `CREATE TABLE` for a $HYPERTABLE][hypertable-create-table]

     ```sql
     CREATE TABLE crypto_ticks (
        "time" TIMESTAMPTZ,
        symbol TEXT,
        price DOUBLE PRECISION,
        day_volume NUMERIC
     ) WITH (
       tsdb.hypertable,
       tsdb.partition_column='time',
       tsdb.segmentby='symbol', 
       tsdb.orderby='time DESC'
     );
     ```
     <OldCreateHypertable />

   * [Use `ALTER MATERIALIZED VIEW` for a continuous aggregate][compression_continuous-aggregate]
     ```sql
     ALTER MATERIALIZED VIEW assets_candlestick_daily set (
        timescaledb.enable_columnstore = true, 
        timescaledb.segmentby = 'symbol' );
     ```

1. **Add a policy to move chunks to the $COLUMNSTORE at a specific time interval**

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

Chunks in the $COLUMNSTORE have the following limitations:

*   `ROW LEVEL SECURITY` is not supported on chunks in the columnstore.

[alter_table_hypercore]: /api/:currentVersion:/hypercore/alter_table/
[compression_continuous-aggregate]: /api/:currentVersion:/hypercore/alter_materialized_view/
[convert_to_rowstore]: /api/:currentVersion:/hypercore/convert_to_rowstore/
[convert_to_columnstore]: /api/:currentVersion:/hypercore/convert_to_columnstore/
[informational-views]: /api/:currentVersion:/informational-views/jobs/
[skipscan]: /use-timescale/:currentVersion:/query-data/skipscan/
[add_columnstore_policy]: /api/:currentVersion:/hypercore/add_columnstore_policy/
[hypercore_workflow]: /api/:currentVersion:/hypercore/#hypercore-workflow
[alter_job]: /api/:currentVersion:/jobs-automation/alter_job/
[remove_columnstore_policy]: /api/:currentVersion:/hypercore/remove_columnstore_policy/
[hypertables-section]: /use-timescale/:currentVersion:/hypertables/
[hypertable-create-table]: /api/:currentVersion:/hypertable/create_table/
[hypercore]: /use-timescale/:currentVersion:/hypercore/
[secondary-indexes]: /use-timescale/:currentVersion:/hypercore/secondary-indexes/
