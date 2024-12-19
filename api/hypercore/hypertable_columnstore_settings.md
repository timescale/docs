---
api_name: timescaledb_information.hypertable_compression_settings
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

### Arguments

|Name|Type|Description|
|-|-|-|
|`hypertable`|`REGCLASS`|Hypertable which has compression enabled|
|`segmentby`|`TEXT`|List of columns used for segmenting the compressed data|
|`orderby`|`TEXT`| List of columns used for ordering compressed data along with ordering and NULL ordering information|
|`compress_interval_length`|`TEXT`|Interval used for [rolling up chunks during compression][rollup-compression]|

### Samples

Show columnstore settings for all hypertables:

```sql 
SELECT * FROM timescaledb_information.hypertable_columnstore_settings'
hypertable               | measurements
segmentby                | 
orderby                  | "time" DESC
compress_interval_length | 
```

Retrieve columnstore settings for a specific hypertable:

```sql
SELECT * FROM timescaledb_information.hypertable_compression_settings WHERE hypertable::TEXT LIKE 'metrics';
hypertable               | metrics
segmentby                | metric_id 
orderby                  | "time" 
compress_interval_length | 
```

[rollup-compression]: /use-timescale/:currentVersion:/compression/manual-compression/#roll-up-uncompressed-chunks-when-compressing
