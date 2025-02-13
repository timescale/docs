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

# timescaledb_information.hypertable_compression_settings 

Shows information about compression settings for each hypertable chunk that has compression enabled on it.

### Arguments

|Name|Type|Description|
|-|-|-|
|`hypertable`|`REGCLASS`|Hypertable which has compression enabled|
|`chunk`|`REGCLASS`|Hypertable chunk which has compression enabled|
|`segmentby`|`TEXT`|List of columns used for segmenting the compressed data|
|`orderby`|`TEXT`| List of columns used for ordering compressed data along with ordering and NULL ordering information|

### Sample use

Show compression settings for all hypertables:

```sql 
SELECT * FROM timescaledb_information.hypertable_compression_settings;
hypertable               | measurements
chunk                    | _timescaledb_internal._hyper_2_97_chunk
segmentby                | 
orderby                  | time DESC
```

Find compression settings for a specific hypertable:

```sql
SELECT * FROM timescaledb_information.hypertable_compression_settings WHERE hypertable::TEXT LIKE 'metrics';
hypertable               | metrics
chunk                    | _timescaledb_internal._hyper_1_12_chunk
segmentby                | metric_id
orderby                  | time DESC
```
