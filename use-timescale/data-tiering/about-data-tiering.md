---
title: About the object storage tier
excerpt: Learn how the object storage tier helps you save on storage costs
product: [cloud]
keywords: [tiered storage]
tags: [storage, data management]
cloud_ui:
    path:
        - [services, :serviceId, overview]
---

# About the object storage tier

Timescale's tiered storage architecture includes a standard high-performance storage tier and a low-cost object storage tier built on Amazon S3. You can use the standard tier for data that requires quick access, and the object tier for rarely used historical data. Chunks from a single hypertable, including compressed chunks, can stretch across these two storage tiers. A compressed chunk uses a different storage representation after tiering.

In the high-performance storage, chunks are stored in the block format. In the object storage, they are stored in a compressed, columnar format. For better interoperability across various platforms, this format is different from that of the internals of the database. It allows for more efficient columnar scans across longer time periods, and Timescale Cloud uses other metadata and query optimizations to reduce the amount of data that needs to be fetched from the object storage tier to satisfy a query.

Regardless of where your data is stored, you can still query it with standard SQL. A single SQL query transparently pulls data from the appropriate chunks using the chunk exclusion algorithms. You can `JOIN` against tiered data, build views, and even define continuous aggregates on it. In fact, because the implementation of continuous aggregates also uses hypertables, they can be tiered to low-cost storage as well. 

## Benefits of the object storage tier

The object storage tier is more than an archiving solution. It is also:

*   **Cost-effective:** store high volumes of data at a lower cost.
    You pay only for what you store, with no extra cost for queries.

*   **Scalable:** scale past the restrictions imposed by storage that can be attached
    directly to a Timescale service (currently 16 TB).

*   **Online:** your data is always there and can be [queried when needed][querying-tiered-data]. 

## Architecture

The tiered storage backend works by periodically and asynchronously moving older chunks from the high-performance storage to the object storage. 
There, it's stored in the Apache Parquet format, which is a compressed columnar format well-suited for S3. Within a Parquet file, a set of rows is grouped together to form a row group. Within a row group, values for a single column across multiple rows are stored together.

By default, tiered data is not included when querying from a Timescale service. 
However, you can access tiered data by [enabling tiered reads][querying-tiered-data] for a query, a session, or even for all sessions. After you enable tiered reads, when you run regular SQL queries, a behind-the-scenes process transparently pulls data from wherever it's located: the standard high-performance storage tier, the object storage tier, or both.

Various SQL optimizations limit what needs to be read from S3:

* **Chunk pruning** - exclude the chunks that fall outside the query time window.
* **Row group pruning** - identify the row groups within the Parquet object that satisfy the query.
* **Column pruning** - fetch only columns that are requested by the query.

The result is transparent queries across high-performance storage and object storage, so your queries fetch the same data as before.

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
1. Prune row groups and limit the fetch to a subset of the offsets in the
Parquet object that potentially match the query filter. Only fetch the data
for `device_uuid`, `sensor_id`, and `observed_at` as the query needs only these 3 columns.

## Limitations

*   **Limited schema modifications.** Some schema modifications are not allowed
    on hypertables with tiered chunks.

    _Allowed_ modifications include: renaming the hypertable, adding columns
    with `NULL` defaults, adding indexes, changing or renaming the hypertable
    schema, and adding `CHECK` constraints. For `CHECK` constraints, only
    untiered data is verified.
    Columns can also be deleted, but you cannot subsequently add a new column
    to a tiered hypertable with the same name as the now-deleted column.

    _Disallowed_ modifications include: adding a column with non-`NULL`
    defaults, renaming a column, changing the data type of a
    column, and adding a `NOT NULL` constraint to the column.

*   **Limited data changes.** You cannot insert data into, update, or delete a
    tiered chunk. These limitations take effect as soon as the chunk is
    scheduled for tiering. 

*   **Inefficient query planner filtering for non-native data types.** The query
    planner speeds up reads from our object storage tier by using metadata
    to filter out columns and row groups that don't satisfy the query. This works for all
    native data types, but not for non-native types, such as `JSON`, `JSONB`,
    and `GIS`.

*   **Latency.** S3 has higher access latency than local storage. This can affect the
    execution time of queries in latency-sensitive environments, especially
    lighter queries.

*   **Number of dimensions.** You cannot use tiered storage with hypertables
    partitioned on more than one dimension. Make sure your hypertables are
    partitioned on time only, before you enable tiered storage.

[blog-data-tiering]: https://www.timescale.com/blog/expanding-the-boundaries-of-postgresql-announcing-a-bottomless-consumption-based-object-storage-layer-built-on-amazon-s3/
[querying-tiered-data]: /use-timescale/:currentVersion:/data-tiering/querying-tiered-data/
