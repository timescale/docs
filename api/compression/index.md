---
title: Compression
excerpt: Timescale Cloud API reference for compressing your data. Includes SQL functions for compressing and decompressing chunks, managing compression policies, and getting compression stats
keywords: [compression]
tags: [hypertables]
products: [cloud, mst, self_hosted]
---

import Deprecated2180 from "versionContent/_partials/_deprecated_2_18_0.mdx";

# Compression (Old API, replaced by Hypercore) <Tag type="community">Community</Tag>

<Deprecated2180 /> Replaced by <a href="https://docs.timescale.com/api/latest/hypercore/">Hypercore</a>.

Compression functionality is included in Hypercore. 

Before you set up compression, you need to
[configure the hypertable for compression][configure-compression] and then
[set up a compression policy][add_compression_policy].

<Highlight type="note">
Before you set up compression for the first time, read
the compression
[blog post](https://blog.timescale.com/blog/building-columnar-compression-in-a-row-oriented-database/)
and
[documentation](https://docs.timescale.com/use-timescale/latest/compression/).
</Highlight>

You can also [compress chunks manually][compress_chunk], instead of using an
automated compression policy to compress chunks as they age.

Compressed chunks have the following limitations:

*   `ROW LEVEL SECURITY` is not supported on compressed chunks.
*   Creation of unique constraints on compressed chunks is not supported. You
    can add them by disabling compression on the hypertable and re-enabling
    after constraint creation.

## Restrictions

In general, compressing a hypertable imposes some limitations on the types
of data modifications that you can perform on data inside a compressed chunk.

This table shows changes to the compression feature, added in different versions
of TimescaleDB:

|TimescaleDB version|Supported data modifications on compressed chunks|
|-|-|
|1.5 - 2.0|Data and schema modifications are not supported.|
|2.1 - 2.2|Schema may be modified on compressed hypertables. Data modification not supported.|
|2.3|Schema modifications and basic insert of new data is allowed. Deleting, updating and some advanced insert statements are not supported.|
|2.11|Deleting, updating and advanced insert statements are supported.|

In TimescaleDB 2.1&nbsp;and later, you can modify the schema of hypertables that
have compressed chunks. Specifically, you can add columns to and rename existing
columns of compressed hypertables.

In TimescaleDB&nbsp;2.3 and later, you can insert data into compressed chunks
and to enable compression policies on distributed hypertables.

In TimescaleDB&nbsp;2.11 and later, you can update and delete compressed data.
You can also use advanced insert statements like `ON CONFLICT` and `RETURNING`.

[add_compression_policy]: /api/:currentVersion:/compression/add_compression_policy/
[compress_chunk]: /api/:currentVersion:/compression/compress_chunk/
[configure-compression]: /api/:currentVersion:/compression/alter_table_compression/
[skipscan]: /use-timescale/:currentVersion:/query-data/skipscan/
[hypercore]: /api/:currentVersion:/hypercore/
