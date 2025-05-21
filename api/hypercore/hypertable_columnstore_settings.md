---
api_name: timescaledb_information.hypertable_columnstore_settings
excerpt: Get information about columnstore settings for all hypertables
topics: [hypercore, information, columnstore, hypertable]
keywords: [columnstore, hypercore, hypertable, information]
tags: [hypertable columnstore, columnstore settings]
api:
  license: community
  type: view
products: [cloud, self_hosted]
---
import Since2180 from "versionContent/_partials/_since_2_18_0.mdx";

# timescaledb_information.hypertable_columnstore_settings 

Retrieve information about the settings for all hypertables in the $COLUMNSTORE.

<Since2180 />

## Samples

To retrieve information about settings:

- **Show $COLUMNSTORE settings for all hypertables**:

   ```sql 
   SELECT * FROM timescaledb_information.hypertable_columnstore_settings;
   ```
  Returns:
   ```sql  
   hypertable               | measurements
   segmentby                | 
   orderby                  | "time" DESC
   compress_interval_length | 
   ```

- **Retrieve $COLUMNSTORE settings for a specific hypertable**:

   ```sql
   SELECT * FROM timescaledb_information.hypertable_columnstore_settings WHERE hypertable::TEXT LIKE 'metrics';
   ```
  Returns:
   ```sql  
   hypertable               | metrics
   segmentby                | metric_id 
   orderby                  | "time" 
   compress_interval_length | 
   ```

## Returns

|Name|Type| Description                                                                                                         |
|-|-|---------------------------------------------------------------------------------------------------------------------|
|`hypertable`|`REGCLASS`| A hypertable which has the [$COLUMNSTORE enabled][compression_alter-table].                                          |
|`segmentby`|`TEXT`| The list of columns used to segment data                                                                            |
|`orderby`|`TEXT`| List of columns used to order the data, along with ordering and NULL ordering information                           |
|`compress_interval_length`|`TEXT`| Interval used for [rolling up chunks during compression][rollup-compression] |



[rollup-compression]: /use-timescale/:currentVersion:/compression/manual-compression/#roll-up-uncompressed-chunks-when-compressing
[compression_alter-table]: /api/:currentVersion:/hypercore/alter_table/

