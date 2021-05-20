## Compression <tag type="community">Community</tag>

We highly recommend reading the [blog post][blog-compression] and
[tutorial][using-compression] about compression before trying to set it up
for the first time.

Setting up compression on TimescaleDB requires users to first [configure the
hypertable for compression](/compression/alter_table_compression/) and then [set up a
policy](/compression/add_compression_policy/) for when to compress chunks.

Advanced usage of compression allows users to [compress chunks
manually](/compression/compress_chunk), instead of automatically as they age.

### Restrictions

The current version does not support altering or inserting data into compressed
chunks. The data can be queried without any modifications, however if you
need to backfill or update data in a compressed chunk you will need to
decompress the chunk(s) first.

Starting with TimescaleDB 2.1, users have the ability to modify the schema
of hypertables that have compressed chunks.
Specifically, you can add columns to and rename existing columns of
such compressed hypertables.

[blog-compression]: https://blog.timescale.com/blog/building-columnar-compression-in-a-row-oriented-database/
[using-compression]: /how-to-guides/compression/index/
