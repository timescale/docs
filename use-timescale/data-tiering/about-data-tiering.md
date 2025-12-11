---
title: About Tiger Cloud storage tiers 
excerpt: Learn how Tiger Cloud helps you save on storage costs. The tiered storage architecture includes a high-performance storage tier and a low-cost object storage tier built on Amazon s3
products: [cloud]
keywords: [tiered storage]
tags: [storage, data management]
cloud_ui:
    path:
        - [services, :serviceId, overview]
---

import TieredStorageBilling from "versionContent/_partials/_tiered-storage-billing.mdx";
import NotSupportedAzure from "versionContent/_partials/_not-supported-for-azure.mdx";

# About storage tiers

The tiered storage architecture in $CLOUD_LONG includes a high-performance storage tier and a low-cost object storage tier. You use the high-performance tier for data that requires quick access, and the object tier for rarely used historical data. Tiering policies move older data asynchronously and periodically from high-performance to low-cost storage, sparing you the need to do it manually. Chunks from a single $HYPERTABLE, including compressed chunks, can stretch across these two storage tiers. 

![$CLOUD_LONG tiered storage](https://assets.timescale.com/docs/images/timescale-tiered-storage-architecture.png)

## High-performance storage 

High-performance storage is where your data is stored by default, until you [enable tiered storage][manage-tiering] and [move older data to the low-cost tier][move-data]. In the high-performance storage, your data is stored in the block format and optimized for frequent querying. The [$HYPERCORE row-columnar storage engine][hypercore] available in this tier is designed specifically for real-time analytics. It enables you to compress the data in the high-performance storage by up to 90%, while improving performance. Coupled with other optimizations, $CLOUD_LONG high-performance storage makes sure your data is always accessible and your queries run at lightning speed. 

$CLOUD_LONG high-performance storage comes in the following types: 

- **Standard** (default): based on [AWS EBS gp3][aws-gp3] and designed for general workloads. Provides up to 16 TB of storage and 16,000 IOPS.
- **Enhanced**: based on [EBS io2][ebs-io2] and designed for high-scale, high-throughput workloads. Provides up to 64 TB of storage and 32,000 IOPS.

[See the differences][aws-storage-types] in the underlying AWS storage. You [enable enhanced storage][enable-enhanced] as needed in $CONSOLE. 

## Low-cost storage

<Availability products={['cloud']} price_plans={['enterprise', 'scale']} />

Once you [enable tiered storage][manage-tiering], you can start moving rarely used data to the object tier. The object tier is based on AWS S3 and stores your data in the [Apache Parquet][parquet] format. Within a Parquet file, a set of rows is grouped together to form a row group. Within a row group, values for a single column across multiple rows are stored together. The original size of the data in your $SERVICE_SHORT, compressed or uncompressed, does not correspond directly to its size in S3. A compressed $HYPERTABLE may even take more space in S3 than it does in $CLOUD_LONG.

<TieredStorageBilling />

<NotSupportedAzure />

Apache Parquet allows for more efficient scans across longer time periods, and $CLOUD_LONG uses other metadata and query optimizations to reduce the amount of data that needs to be fetched to satisfy a query, such as: 

- **Chunk skipping**: exclude the chunks that fall outside the query time window.
- **Row group skipping**: identify the row groups within the Parquet object that satisfy the query.
- **Column skipping**: fetch only columns that are requested by the query.

The following query is against a tiered dataset and illustrates the optimizations:

```sql
EXPLAIN ANALYZE 
SELECT count(*) FROM
( SELECT device_uuid,  sensor_id FROM public.device_readings 
  WHERE observed_at > '2023-08-28 00:00+00' and observed_at < '2023-08-29 00:00+00' 
  GROUP BY device_uuid,  sensor_id ) q;
            QUERY PLAN                                                                  
           
-------------------------------------------------------------------------------------------------
 Aggregate  (cost=7277226.78..7277226.79 rows=1 width=8) (actual time=234993.749..234993.750 rows=1 loops=1)
   ->  HashAggregate  (cost=4929031.23..7177226.78 rows=8000000 width=68) (actual time=184256.546..234913.067 rows=1651523 loops=1)
         Group Key: osm_chunk_1.device_uuid, osm_chunk_1.sensor_id
         Planned Partitions: 128  Batches: 129  Memory Usage: 20497kB  Disk Usage: 4429832kB
         ->  Foreign Scan on osm_chunk_1  (cost=0.00..0.00 rows=92509677 width=68) (actual time=345.890..128688.459 rows=92505457 loops=1)
               Filter: ((observed_at > '2023-08-28 00:00:00+00'::timestamp with time zone) AND (observed_at < '2023-08-29 00:00:00+00'::timestamp with t
ime zone))
               Rows Removed by Filter: 4220
               Match tiered objects: 3
               Row Groups:
                 _timescaledb_internal._hyper_1_42_chunk: 0-74
                 _timescaledb_internal._hyper_1_43_chunk: 0-29
                 _timescaledb_internal._hyper_1_44_chunk: 0-71
               S3 requests: 177
               S3 data: 224423195 bytes
 Planning Time: 6.216 ms
 Execution Time: 235372.223 ms
(16 rows)
```

`EXPLAIN` illustrates which chunks are being pulled in from the object storage tier:

1. Fetch data from chunks 42, 43, and 44 from the object storage tier.
1. Skip row groups and limit the fetch to a subset of the offsets in the
   Parquet object that potentially match the query filter. Only fetch the data
   for `device_uuid`, `sensor_id`, and `observed_at` as the query needs only these 3 columns.

The object storage tier is more than an archiving solution. It is also:

- **Cost-effective:** store high volumes of data at a lower cost. You pay only for what you store, with no extra cost for queries.
- **Scalable:** scale past the restrictions of even the enhanced high-performance storage tier.
- **Online:** your data is always there and can be [queried when needed][querying-tiered-data].

By default, tiered data is not included when you query from a $SERVICE_LONG. To access tiered data, you [enable tiered reads][querying-tiered-data] for a query, a session, or even for all sessions. After you enable tiered reads, when you run regular SQL queries, a behind-the-scenes process transparently pulls data from wherever it's located: the standard high-performance storage tier, the object storage tier, or both.  You can `JOIN` against tiered data, build views, and even define continuous aggregates on it. In fact, because the implementation of continuous aggregates also uses $HYPERTABLEs, they can be tiered to low-cost storage as well.

The low-cost storage tier comes with the following limitations:

- **Limited schema modifications**: some schema modifications are not allowed
    on $HYPERTABLEs with tiered chunks.

    _Allowed_ modifications include: renaming the $HYPERTABLE, adding columns
    with `NULL` defaults, adding indexes, changing or renaming the $HYPERTABLE
    schema, and adding `CHECK` constraints. For `CHECK` constraints, only
    untiered data is verified.
    Columns can also be deleted, but you cannot subsequently add a new column
    to a tiered $HYPERTABLE with the same name as the now-deleted column.

    _Disallowed_ modifications include: adding a column with non-`NULL`
    defaults, renaming a column, changing the data type of a
    column, and adding a `NOT NULL` constraint to the column.

-  **Limited data changes**: you cannot insert data into, update, or delete a
    tiered chunk. These limitations take effect as soon as the chunk is
    scheduled for tiering. 

-   **Inefficient query planner filtering for non-native data types**: the query
    planner speeds up reads from our object storage tier by using metadata
    to filter out columns and row groups that don't satisfy the query. This works for all
    native data types, but not for non-native types, such as `JSON`, `JSONB`,
    and `GIS`.

*   **Latency**: S3 has higher access latency than local storage. This can affect the
    execution time of queries in latency-sensitive environments, especially
    lighter queries.

*   **Number of dimensions**: you cannot use tiered storage with $HYPERTABLEs
    partitioned on more than one dimension. Make sure your $HYPERTABLEs are
    partitioned on time only, before you enable tiered storage.

## The tiered storage workflow

The typical workflow to use tiered storage in $CLOUD_LONG is:

<Procedure>

1. **[Enable tiered storage][manage-tiering]**

   You enable tiered storage for each $SERVICE_SHORT individually.

1. **[Tier your data][move-data]**

   Choose how to move data to the low-cost tier:
   - **Automated tiering**: create an interval-based policy using
     `add_tiering_policy()` to automatically tier chunks older than a
     specified age. By default, policies run hourly, and continuously manage
     data placement.
   - **Manual tiering**: identify specific chunks to tier by querying the
     `timescaledb_information.chunks` view, then use the `tier_chunk()`
     function to move individual chunks. The tiering process is asynchronous, 
     chunks are scheduled for migration and handled by background services.

1. **[Query your data][querying-tiered-data]**:
    1. To access data stored in the object tier, set `timescaledb.enable_tiered_reads = true` for your session, query, or
       all future sessions. 
   
       Without this setting, queries only access data in the high-performance tier. 
    1. Run standard SQL queries against your $HYPERTABLEs. 
   
       The query planner automatically determines which chunks to access across both storage
       tiers based on your query filters. Chunk pruning, row group pruning,
       and column pruning optimize query performance.

1. **[Monitor and manage][monitor-data]**:

    Track tiered chunks using the `timescaledb_osm.chunks_queued_for_tiering`
    view. Modify or remove tiering policies as needed using `alter_job` and
    `remove_tiering_policy`.

</Procedure> 

[blog-data-tiering]: https://www.timescale.com/blog/expanding-the-boundaries-of-postgresql-announcing-a-bottomless-consumption-based-object-storage-layer-built-on-amazon-s3/
[querying-tiered-data]: /use-timescale/:currentVersion:/data-tiering/querying-tiered-data/
[parquet]: https://parquet.apache.org/
[manage-tiering]: /use-timescale/:currentVersion:/data-tiering/enabling-data-tiering/#low-cost-object-storage-tier
[move-data]: /use-timescale/:currentVersion:/data-tiering/enabling-data-tiering/#automate-tiering-with-policies
[monitor-data]: /use-timescale/:currentVersion:/data-tiering/enabling-data-tiering/#tier-chunks
[hypercore]: /use-timescale/:currentVersion:/hypercore
[aws-gp3]: https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html
[ebs-io2]: https://docs.aws.amazon.com/ebs/latest/userguide/provisioned-iops.html#io2-block-express
[enable-enhanced]: /use-timescale/:currentVersion:/data-tiering/enabling-data-tiering/#high-performance-storage-tier
[aws-storage-types]: https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html#vol-type-ssd