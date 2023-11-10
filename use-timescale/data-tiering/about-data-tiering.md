---
title: About tiered storage
excerpt: Learn how tiered storage helps you save on storage costs
product: [cloud]
keywords: [tiered storage]
tags: [storage, data management]
cloud_ui:
    path:
        - [services, :serviceId, overview]
---

# About tiered storage

Tiered storage complements Timescale's standard high-performance storage tier with a low-cost bottomless storage tier backed by S3.

You can move your hypertable data across the different storage tiers to get the best price performance.
You can use the standard high-performance storage tier for data that requires quick access,
and the low-cost bottomless storage tier for rarely used historical data. 
Regardless of where your data is stored, you can still query it with
[standard SQL][querying-tiered-data].


## Benefits of tiered storage

Tiered storage is more than an archiving solution:

*   **Cost effective.** Store high volumes of data cost-efficiently.
    You pay only for what you store, with no extra cost for queries.

*   **Scalable.**  Scale past the restrictions imposed by storage that can be attached
    directly to a Timescale service (currently 16 TB).

*   **Online.**  Your data is always there and can be [queried when needed][querying-tiered-data]. 

## Architecture

Tiered storage works by periodically and asynchronously moving older chunks to S3
storage. There, it's stored in the Apache Parquet format, which is a compressed
columnar format well-suited for S3. Data remains accessible both during and
after migration.

By default, tiered data is not included when querying from a Timescale instance. 
However, it is possible to access tiered data by [enabling tiered storage reads][querying-tiered-data] for a session, query, or even for all sessions.   

With tiered storage reads enabled, when you run regular SQL queries, a behind-the-scenes process transparently
pulls data from wherever it's located: the standard high-performance storage tier, the low-cost bottomless storage tier, or both.
Various SQL optimizations limit what needs to be read from S3:

*   Chunk exclusion avoids processing chunks that fall outside the query's time
    window
*   The database uses metadata about row groups and columnar offsets, so only
    part of an object needs to be read from S3

The result is transparent queries across standard PostgreSQL storage and S3
storage, so your queries fetch the same data as before.

For more about how tiered storage works, see the
[blog post on tiered storage][blog-data-tiering].

## Limitations

*   **Limited schema modifications.** Some schema modifications are not allowed
    on hypertables with tiered chunks.

    _Allowed_ modifications include: renaming the hypertable, adding columns
    with `NULL` defaults, adding indexes, changing or renaming the hypertable
    schema, and adding `CHECK` constraints. For `CHECK` constraints, only
    untiered data is verified.

    _Disallowed_ modifications include: adding a column with non-`NULL`
    defaults, renaming a column, deleting a column, changing the data type of a
    column, and adding a `NOT NULL` constraint to the column.

*   **Limited data changes.** You cannot insert data into, update, or delete a
    tiered chunk. These limitations take effect as soon as the chunk is
    scheduled for tiering.

*   **Inefficient query planner filtering for non-native data types.** The query
    planner speeds up reads from our low-cost bottomless storage tier by using metadata
    to filter out columns and row groups that don't satisfy the query. This works for all
    native data types, but not for non-native types, such as `JSON`, `JSONB`,
    and `GIS`.

*   **Latency.** S3 has higher access latency than local storage. This can affect the
    execution time of queries in latency-sensitive environments, especially
    lighter queries.

*   **Number of dimensions.** You cannot use tiered storage on hypertables
    partitioned on more than one dimension. Make sure your hypertables are
    partitioned on time only, before you enable tiered storage.

[blog-data-tiering]: https://www.timescale.com/blog/expanding-the-boundaries-of-postgresql-announcing-a-bottomless-consumption-based-object-storage-layer-built-on-amazon-s3/
[querying-tiered-data]: /use-timescale/:currentVersion:/data-tiering/querying-tiered-data/
