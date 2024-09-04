---
title: Slow tiering of chunks
section: troubleshooting
products: [cloud]
topics: [data tiering]
keywords: [tiered storage]
tags: [tiered storage]
---


{/*
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
*/}

Chunks are tiered asynchronously. Chunks are selected to be tiered to the object storage tier one at a time ordered by their enqueue time.

To see the chunks waiting to be tiered query the `timescaledb_osm.chunks_queued_for_tiering` view

```sql
select count(*) from timescaledb_osm.chunks_queued_for_tiering
```

Processing all the chunks in the queue may take considerable time if a large quantity of data is being migrated to the object storage tier.
