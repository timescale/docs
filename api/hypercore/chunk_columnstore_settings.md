---
api_name: timescaledb_information.chunk_columnstore_settings
excerpt: Get information about settings on each chunk in the columnstore
topics: [information, columnstore, chunk]
keywords: [columnstore, chunk, information]
tags: [chunk, columnstore settings]
api:
  license: community
  type: view
---

# timescaledb_information.chunk_columnstore_settings 

Retrieve information about each chunk in the columnstore.

**@since [TimescaleDB v2.18.0](https://github.com/timescale/timescaledb/releases/tag/2.18.0)**

## Samples

* Show settings for all chunks in the columnstore:

  ```sql 
  SELECT * FROM timescaledb_information.chunk_columnstore_settings
  ```
  Returns:
  ```sql    
  hypertable | chunk | segmentby | orderby 
  ------------+-------+-----------+---------    
  measurements | _timescaledb_internal._hyper_1_1_chunk| | "time" DESC
  ```

* Find all chunk compression settings for a specific hypertable:

  ```sql
  SELECT * FROM timescaledb_information.chunk_columnstore_settings WHERE hypertable::TEXT LIKE 'metrics';
  ```
  Returns:
  ```sql    
  hypertable | chunk | segmentby | orderby 
  ------------+-------+-----------+---------
  metrics | _timescaledb_internal._hyper_2_3_chunk | metric_id | "time"
  ```

## Returns

| Name | Type | Default | Required | Description |
|--|--|--|--|--|
|`hypertable`|`REGCLASS`|-|✖| The name of a hypertable in the columnstore |
|`chunk`|`REGCLASS`|-|✖| The name of a chunk in `hypertable`                                                                                                                     |
|`segmentby`|`TEXT`|-|✖| A list of columns used to segment `hypertable`                                                                                                          |
|`orderby`|`TEXT`|-|✖| A list of columns used to order data in `hypertable`.  Along with ordering and NULL ordering information. IAIN, I don't understand the second sentence. |

