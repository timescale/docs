---
title: About data tiering
excerpt: Learn how data tiering helps you save on storage costs
product: [cloud]
keywords: [data tiering]
tags: [storage, data management]
cloud_ui:
    path:
        - [services, :serviceId, overview]
---

import ExperimentalPrivateBeta from "versionContent/_partials/_early_access.mdx";
import UsageBasedStorage from "versionContent/_partials/_usage-based-storage-intro.mdx";

# About data tiering

Save on storage costs by tiering data to a low-cost object-storage layer.

Timescale includes traditional disk storage, and a low-cost object-storage
layer built on Amazon S3. You can move your hypertable data across the different
storage tiers to get the best price performance. You can use primary storage for
data that requires quick access, and low-cost object storage for historical
data. Regardless of where your data is stored, you can query it with standard
SQL.

<UsageBasedStorage />

## Benefits of data tiering

With data tiering, you get:

*   **Low-cost scalability.** Store high volumes of time-series data
    cost-efficiently in the object store. You pay only for what you store, with
    no extra cost for queries.

*   **Data warehousing.** Access all your data without leaving Timescale.
    Rather than running a separate system to tier and archive historical data,
    move it to native object storage.

*   **Transparent SQL queries.** You can interact with your data normally even
    when it's distributed across different storage layers. Your hypertable is
    spread across the layers, so queries and `JOIN`s work and fetch the same
    data as usual.

## Architecture

Data tiering works by periodically and asynchronously moving older chunks to S3
storage. There, it's stored in the Apache Parquet format, which is a compressed
columnar format well-suited for S3. Data remains accessible both during and
after migration.

When you run regular SQL queries, a behind-the-scenes process transparently
pulls data from wherever it's located: disk storage, object storage, or both.
Various SQL optimizations limit what needs to be read from S3:

*   Chunk exclusion avoids processing chunks that fall outside the query's time
    window
*   The database uses metadata about row groups and columnar offsets, so only
    part of an object needs to be read from S3

The result is transparent queries across standard PostgreSQL storage and S3
storage, so your queries fetch the same data as before, with minimal added
latency.

For more about how data tiering works, see the
[blog post on data tiering][blog-data-tiering].

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
    planner speeds up reads from object storage by using metadata to filter out
    columns and row groups that don't satisfy the query. This works for all
    native data types, but not for non-native types, such as `JSON`, `JSONB`,
    and `GIS`.

*   **Latency.** S3 has higher access latency than EBS however, S3 has
    comparatively greater throughput for large scans. This can affect the
    execution time of queries in latency-sensitive environments, especially
    lighter queries.

*   **Number of dimensions.** You cannot use data tiering on hypertables
    partitioned on more than one dimension. Make sure your hypertables is
    partitioned on time only, before you enable data tiering.

## Learn more

Learn [how data tiering works][how-to].

[blog-data-tiering]: https://www.timescale.com/blog/expanding-the-boundaries-of-postgresql-announcing-a-bottomless-consumption-based-object-storage-layer-built-on-amazon-s3/
[how-to]: /use-timescale/:currentVersion:/data-tiering/tier-data-object-storage/
