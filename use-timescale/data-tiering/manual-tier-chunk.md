---
title: Manually tier data to the object storage tier
excerpt: How to manually tier data to the object storage tier
product: [ cloud ]
keywords: [ tiered storage, tiering ]
tags: [ storage, data management ]
---

# Manually tiering chunks

Once tiered storage has been enabled on a service, individual chunks from a hypertable may be tiered to the object storage tier.

Before you start, you need a list of chunks to tier. In this example, you use a hypertable called example, and tier chunks older than three days.
Data on the object storage tier cannot be modified - so inserts, updates, and deletes will not work on tiered data. So make sure that
you are not tiering data that is being <b>actively modified<\b> to the object storage tier

<Procedure>

### Selecting chunks to tier

1. At the psql prompt, select all chunks in the table `example` that are older
   than three days:

   ```sql
   SELECT show_chunks('example', older_than => INTERVAL '3 days');
   ```

1. This returns a list of chunks. Take a note of the chunk names:

   ```sql
   |1|_timescaledb_internal_hyper_1_2_chunk|
   |2|_timescaledb_internal_hyper_1_3_chunk|
   ```

</Procedure>


When you are happy with the list of chunks, you can use the `tier_chunk` function to manually tier each one.

<Procedure>

### Tiering chunks manually

1. At the psql prompt, tier the chunk:

   ```sql
   SELECT tier_chunk( '_timescaledb_internal_hyper_1_2_chunk');
   ```
   
   Tiering a chunk is an asynchronous process that schedules the chunk to be tiered.

1. Repeat for all chunks you want to tier.

</Procedure>


## List tiered chunks

<Highlight type="info">
Tiering a chunk schedules the chunk for migration to the object storage tier but, won't be tiered immediately. 
It may take some time tiering to complete. You can continue to query a chunk during migration.
</Highlight>

To see which chunks are tiered into the object storage tier, use the `tiered_chunks`
informational view:

```sql
SELECT * FROM timescaledb_osm.tiered_chunks;
```

## Find chunks that are scheduled to be tiered

Chunks are tiered asynchronously. Chunks are tiered one at a time in order to minimize db resource
consumption during the tiering process. You can see chunks scheduled for tiering (either by the policy or
 by a manual call to `tier_chunk`) but have not yet been moved to the object storage tier using this view.

```sql
SELECT * FROM timescaledb_osm.chunks_queued_for_tiering ;
```

If you need to untier your data, see the
[manually untier data][untier-data] section.

## Creating a tiering policy

Most users don't need to manually tier chunks and instead create a [tiering policy][creating-data-tiering-policy] to automate when chunks are tiered. 


[creating-data-tiering-policy]: /use-timescale/:currentVersion:/data-tiering/creating-data-tiering-policy/
[untier-data]: /use-timescale/:currentVersion:/data-tiering/untier-data/
