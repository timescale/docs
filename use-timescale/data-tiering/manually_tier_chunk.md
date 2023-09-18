---
title: Manually Tier data
excerpt: How to manually Tier Timescale data
product: [ cloud ]
keywords: [ data tiering, tiering ]
tags: [ storage, data management ]
---

# Tiering a chunk to object storage

Once Data Tiering has been enabled on a service individual chunks from a Hypertable may be tiered to Object Storage.

<Procedure>

### Selecting chunks to tier

1. At the psql prompt, select all chunks in the table `example` that are older
   than three days:

   ```sql
   SELECT show_chunks('example', older_than => INTERVAL '3 days');
   ```

1. This returns a list of chunks. Take a note of the chunk names:

   ```sql
   ||show_chunks|
   |---|---|
   |1|_timescaledb_internal_hyper_1_2_chunk|
   |2|_timescaledb_internal_hyper_1_3_chunk|
   ```

</Procedure>

You can use the chunk names to manually tier a chunk to object storage using the `tier_chunk` function.

```sql
SELECT tier_chunk(chunk REGCLASS, if_not_tiered BOOL = false);
```

<Procedure>

### Tiering chunks manually

1. At the psql prompt, compress the chunk:

   ```sql
   SELECT tier_chunk( '<chunk_name>');
   ```
   
   Tiering a chunk is an asynchronous process that enqueues to the chunk to be tiered. 

1. Repeat for all chunks you want to compress.

</Procedure>


## List tiered chunks

<Highlight type="info">
Tiering a chunk schedules the chunk for migration to object storage but, won't be tiered immediately. 
It may take some time tiering to complete.
</Highlight>

To see which chunks are tiered into object storage, use the `tiered_chunks`
informational view:

```sql
SELECT * FROM timescaledb_osm.tiered_chunks;
```

If you need to untier your data, see the
[manually untier data][untier-data] section.

## Creating a Tiering Policy

Most users don't need to manually tier chunks and instead create a [data tiering policy]() to automate tiering chunks. 


