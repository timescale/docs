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
best practice is to set `maxchunks_to_compress` and limit to amount of chunks to be converted.  For example:

```sql
SELECT alter_job(job_id, config.maxchunks_to_compress => 10);
```

When all chunks have been converted to the columnstore, set `maxchunks_to_compress` to `0`, unlimited.
