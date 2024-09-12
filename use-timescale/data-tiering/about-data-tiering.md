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

The tiered storage architecture complements Timescale's standard high-performance storage tier with a low-cost object storage tier.

You can move your hypertable data across the different storage tiers to get the best price performance.
You can use the standard high-performance storage tier for data that requires quick access,
and the low-cost object storage tier for rarely used historical data. 
Regardless of where your data is stored, you can still query it with
[standard SQL][querying-tiered-data].


## Benefits of the object storage tier

The object storage tier is more than an archiving solution:

*   **Cost effective.** Store high volumes of data cost-efficiently.
    You pay only for what you store, with no extra cost for queries.

*   **Scalable.**  Scale past the restrictions imposed by storage that can be attached
    directly to a Timescale service (currently 16 TB).

*   **Online.**  Your data is always there and can be [queried when needed][querying-tiered-data]. 

## Architecture

The tiered storage backend works by periodically and asynchronously moving older chunks to the object storage tier;
an object store built on Amazon S3.
There, it's stored in the Apache Parquet format, which is a compressed
columnar format well-suited for S3. Data remains accessible both during and after the migration.

By default, tiered data is not included when querying from a Timescale service. 
However, it is possible to access tiered data by [enabling tiered reads][querying-tiered-data] for a session, query, or even for all sessions.   

With tiered reads enabled, when you run regular SQL queries, a behind-the-scenes process transparently
pulls data from wherever it's located: the standard high-performance storage tier, the object storage tier, or both.
Various SQL optimizations limit what needs to be read from S3:

*   Chunk exclusion avoids processing chunks that fall outside the query's time window
*   The database uses metadata about row groups and columnar offsets, so only
    part of an object needs to be read from S3

The result is transparent queries across standard PostgreSQL storage and S3
storage, so your queries fetch the same data as before.

## Limitations

*   **Limited schema modifications.** Some schema modifications are not allowed
    on hypertables with tiered chunks.

    _Allowed_ modifications include: renaming the hypertable, adding columns
    with `NULL` defaults, adding indexes, changing or renaming the hypertable
    schema, and adding `CHECK` constraints. For `CHECK` constraints, only
    untiered data is verified.
    Columns can be deleted. However, you cannot add a new column with the same
    name to the hypertable after enabling tiering.

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
