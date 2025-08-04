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

<!---
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
-->

By default the columnstore policy attempts to move all uncompressed chunks on the columnstore. 
In case of a larger backlog of chunks on the rowstore, before converting these to the columnstore 
it is recommended to limit to amount of chunks via the `maxchunks_to_compress` configuration. 

```sql
SELECT alter_job(job_id, config.maxchunks_to_compress => 10);
```

After all chunks are on the columnstore, it is recommended to reset the parameter back to `0` which is equal to unlimited.
