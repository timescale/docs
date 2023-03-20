---
title: Compression
excerpt: Compress your hypertables
keywords: [compression]
tags: [hypertables]
---

# Compression <Tag type="community">Community</Tag>

We highly recommend reading the [blog post][blog-compression] and
[tutorial][using-compression] about compression before trying to set it up
for the first time.

Setting up compression on TimescaleDB requires users to first [configure the
hypertable for compression][configure-compression] and then [set up a
policy][add_compression_policy] for when to compress chunks.

Advanced usage of compression allows users to [compress chunks
manually][compress_chunk], instead of automatically as they age.

Compressed chunks have the following limitations:

*   `ROW LEVEL SECURITY` is not supported.
*   Constraints are not fully supported:
    *   Unique constraints (`UNIQUE`) are restricted to compression `SEGMENTBY`
      and `ORDER BY` columns.
    *   Primary Keys (`PRIMARY KEY`) are restricted to compression `SEGMENTBY`
      and `ORDER BY` columns.
    *   Constraints are restricted to compression `SEGMENTBY` columns when
    applicable. Otherwise they are unsupported.
  
### Restrictions

In general, compressing a hypertable does impose some limitations on the types
of data modifications that can occur on data inside a compressed chunk.
The table below provides a brief outline of allowed modifications
based on the version of TimescaleDB you are currently running.

|TimescaleDB Version|Supported data modifications on compressed chunks|
|---|---|
| 1.5 - 2.0 | Data and schema modifications are not supported. |
| 2.1 - 2.2 | Schema may be modified on compressed hypertables. Data modification not supported. |
| 2.3 | Schema modifications and basic insert of new data are allowed. Deleting, updating and some advanced insert statements are not supported. |

Starting with TimescaleDB 2.1, users have the ability to modify the schema
of hypertables that have compressed chunks.
Specifically, you can add columns to and rename existing columns of
such compressed hypertables.

Starting with TimescaleDB 2.3, users have the ability to insert data into compressed chunks
and to enable compression policies on distributed hypertables.

Altering data of compressed chunks still has some limitations:

*   You cannot execute `UPDATE` or `DELETE` statements on compressed chunks.
*   `INSERT` is not fully supported on compressed chunks:
    *   You cannot use the `ON CONFLICT` clause, that is, upserts are not supported.
    *   You cannot use the `OVERRIDING` clause.
    *   You cannot use the `RETURNING` clause.
*   Triggers are not fully supported when inserting into compressed chunks:
    *   You cannot use `AFTER INSERT` row-level triggers (`FOR EACH ROW`).
*   Constraints are not fully supported when inserting into compressed chunks:
    *   Unique constraints (`UNIQUE`) are not supported.
    *   Primary Keys (`PRIMARY KEY`) are not supported.

[add_compression_policy]: /api/:currentVersion:/compression/add_compression_policy/
[blog-compression]: https://blog.timescale.com/blog/building-columnar-compression-in-a-row-oriented-database/
[compress_chunk]: /api/:currentVersion:/compression/compress_chunk/
[configure-compression]: /api/:currentVersion:/compression/alter_table_compression/
[using-compression]: /use-timescale/:currentVersion:/compression/
