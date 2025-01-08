---
api_name: timescaledb_information.hypertable_columnstore_settings
excerpt: Get information about compression settings for all hypertables
topics: [information, compression, hypertable]
keywords: [compression, hypertable, information]
tags: [hypertable compression, compression settings]
api:
  license: community
  type: view
---

# timescaledb_information.hypertable_columnstore_settings 

Retrieve information about the settings for each hypertable in the columnstore.

**@since [TimescaleDB v2.18.0](https://github.com/timescale/timescaledb/releases/tag/2.18.0)**

## Samples

- **Show columnstore settings for all hypertables**:

   ```sql 
   SELECT * FROM timescaledb_information.hypertable_columnstore_settings'
   ```
  Returns:
   ```sql  
   hypertable               | measurements
   segmentby                | 
   orderby                  | "time" DESC
   compress_interval_length | 
   ```

- **Retrieve columnstore settings for a specific hypertable**:

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
|`hypertable`|`REGCLASS`| A hypertable which has the [columnstore enabled][compression_alter-table].                                          |
|`segmentby`|`TEXT`| The list of columns used to segment data                                                                            |
|`orderby`|`TEXT`| List of columns used to order the data, along with ordering and NULL ordering information                           |
|`compress_interval_length`|`TEXT`| Interval used for [rolling up chunks during compression][rollup-compression] IAIN, update when main doc is written. |



[rollup-compression]: /use-timescale/:currentVersion:/compression/manual-compression/#roll-up-uncompressed-chunks-when-compressing
[compression_alter-table]: /api/:currentVersion:/hypercore/alter_table/
