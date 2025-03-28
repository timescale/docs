---
api_name: timescaledb_information.chunk_compression_settings
excerpt: Get information about compression settings for all chunks
topics: [information, compression, chunk]
keywords: [compression, chunk, information]
tags: [chunk compression, compression settings]
api:
  license: community
  type: view
---

# timescaledb_information.chunk_compression_settings 

Shows information about compression settings for each chunk that has compression enabled on it.

### Arguments

|Name|Type|Description|
|-|-|-|
|`hypertable`|`REGCLASS`|Hypertable which has compression enabled|
|`chunk`|`REGCLASS`|Chunk which has compression enabled|
|`segmentby`|`TEXT`|List of columns used for segmenting the compressed data|
|`orderby`|`TEXT`| List of columns used for ordering compressed data along with ordering and NULL ordering information|

### Sample use

Show compression settings for all chunks:

```sql 
SELECT * FROM timescaledb_information.chunk_compression_settings'
hypertable               | measurements
chunk					 | _timescaledb_internal._hyper_1_1_chunk
segmentby                | 
orderby                  | "time" DESC
```

Find all chunk compression settings for a specific hypertable:

```sql
SELECT * FROM timescaledb_information.chunk_compression_settings WHERE hypertable::TEXT LIKE 'metrics';
hypertable               | metrics
chunk					 | _timescaledb_internal._hyper_2_3_chunk
segmentby                | metric_id 
orderby                  | "time" 
```

