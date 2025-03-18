---
api_name: timescaledb_information.chunk_columnstore_settings
excerpt: Get information about settings on each chunk in the columnstore
topics: [hypercore, information, columnstore, chunk]
keywords: [columnstore, hypercore, chunk, information]
tags: [chunk, columnstore settings]
api:
  license: community
  type: view
---
import Since2180 from "versionContent/_partials/_since_2_18_0.mdx";

# timescaledb_information.chunk_columnstore_settings 

Retrieve the compression settings for each chunk in the columnstore.

<Since2180 />

## Samples

To retrieve information about settings:

- **Show settings for all chunks in the columnstore**:

  ```sql 
  SELECT * FROM timescaledb_information.chunk_columnstore_settings
  ```
  Returns:
  ```sql    
  hypertable | chunk | segmentby | orderby 
  ------------+-------+-----------+---------    
  measurements | _timescaledb_internal._hyper_1_1_chunk| | "time" DESC
  ```

* **Find all chunk columnstore settings for a specific hypertable**:

  ```sql
  SELECT * 
  FROM timescaledb_information.chunk_columnstore_settings 
  WHERE hypertable::TEXT LIKE 'metrics';
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

