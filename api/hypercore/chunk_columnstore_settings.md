---
api_name: timescaledb_information.chunk_columnstore_settings
excerpt: Get information about settings on each chunk in the columnstore
topics: [hypercore, information, columnstore, chunk]
keywords: [columnstore, hypercore, chunk, information]
tags: [chunk, columnstore settings]
api:
  license: community
  type: view
products: [cloud, mst, self_hosted]
---
import Since2180 from "versionContent/_partials/_since_2_18_0.mdx";

# timescaledb_information.chunk_columnstore_settings 

Retrieve the compression settings for each chunk in the $COLUMNSTORE.

<Since2180 />

## Samples

To retrieve information about settings:

- **Show settings for all chunks in the $COLUMNSTORE**:

  ```sql 
  SELECT * FROM timescaledb_information.chunk_columnstore_settings
  ```
  Returns:

  ```sql    
  hypertable | chunk | segmentby | orderby 
  ------------+-------+-----------+---------    
  measurements | _timescaledb_internal._hyper_1_1_chunk| | "time" DESC
  ```

* **Find all chunk $COLUMNSTORE settings for a specific hypertable**:

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

| Name | Type | Description |
|--|--|--|--|--|
|`hypertable`|`REGCLASS`| The name of the hypertable in the $COLUMNSTORE. |
|`chunk`|`REGCLASS`| The name of the chunk in the `hypertable`.  |
|`segmentby`|`TEXT`| The list of columns used to segment the `hypertable`. |
|`orderby`|`TEXT`| The list of columns used to order the data in the `hypertable`, along with the ordering and `NULL` ordering information. |
|`index`| `TEXT` | The sparse index details.  |   

