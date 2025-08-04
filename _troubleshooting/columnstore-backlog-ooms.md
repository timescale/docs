---
title: Out of memory errors after enabling the columnstore
section: troubleshooting
products: [cloud, mst, self_hosted]
topics: [columnstore, compression, hypercore, backlog]
errors:
  - language: text
    message: |-
      Level: Error out of memory DETAIL: Failed on request of size 16777216 in memory context "ErrorContext".
apis:
  - [compression, alter_job()]
keywords: [compression, hypertables, columnstore]
tags: [compression, hypertables, chunks]
---


By default, columnstore policies move all uncompressed chunks to the columnstore. 
However, before converting a large backlog of chunks from the rowstore to the columnstore, 
it is recommended to limit to amount of chunks via the `maxchunks_to_compress` configuration. 

```sql
SELECT alter_job(job_id, config.maxchunks_to_compress => 10);
```

After all chunks are on the columnstore, it is recommended to reset the parameter back to `0` which is equal to unlimited.
