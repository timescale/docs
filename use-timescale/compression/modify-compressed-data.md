---
title: Inserting or modifying data in the columnstore
excerpt: In TimescaleDB, compressed data can still be modified. Learn to insert data into compressed chunks and modify data in the columnstore.
products: [cloud, mst, self_hosted]
keywords: [compression, backfilling, hypertables, columnstore]
---


# Insert and modify data in the $COLUMNSTORE

In $TIMESCALE_DB [v2.11.0](tsdb-release-2-11-0) and later, you can use the `UPDATE` and `DELETE`
commands to modify existing rows in compressed chunks. This works in a similar
way to `INSERT` operations. To reduce the amount decompression that is done, $TIMESCALE_DB only attempts to decompress data where it is necessary.
However, if there are no qualifiers, or if the qualifiers cannot be used as filters, calls to `UPDATE` and `DELETE` may convert large amounts of data to the rowstore and back to the columnstore.
To avoid large scale conversion, filter on the columns you use to `segementby` and `orderby`. This filters as much data as possible before any data is modified, and reduces the amount of data conversions.

DML operations on the $COLUMNSTORE work if the data you are inserting has 
unique constraints. Constraints are preserved during the insert operation. 
$TIMESCALE_DB uses a $PG function that decompresses relevant data during the insert 
to check if the new data breaks unique checks. This means that any time you insert data
into the $COLUMNSTORE, a small amount of data is decompressed to allow a
speculative insertion, and block any inserts which could violate constraints.

For $TIMESCALE_DB [v2.17.0](tsdb-release-2-17-0) and later, delete performance is improved on compressed 
hypertables when a large amount of data is affected. When you delete whole segments of 
data, filter your deletes by `segmentby` column(s) instead of separate deletes. 
This considerably increases performance by skipping the decompression step. 
Since $TIMESCALE_DB [v2.21.0](tsdb-release-2-21-0) and later, `DELETE` operations on the $COLUMNSTORE
are executed on the batch level, which allows more performant deletion of data of non-segmentby columns
and reduces IO usage.

## Earlier versions of $TIMESCALE_DB (< v2.11.0)

<Highlight type="warning">

This feature requires $PG 14 or later

</Highlight>

<Tabs>

<Tab title="TimescaleDB&nbsp;2.3-2.10">

From $TIMESCALE_DB v2.3.0, you can insert data into compressed chunks with some
limitations. The primary limitation is that you can't insert data with unique
constraints. Additionally, newly inserted data needs to be compressed at the
same time as the data in the chunk, either by a running recompression policy, or
by using `recompress_chunk` manually on the chunk.

</Tab>

<Tab title="TimescaleDB&nbsp;2.2 and earlier">

In $TIMESCALE_DB v2.2.0 and earlier, you cannot insert data into compressed chunks.

</Tab>

</Tabs>

[tsdb-release-2-21-0]: https://github.com/timescale/timescaledb/releases/2.21.0
[tsdb-release-2-17-0]: https://github.com/timescale/timescaledb/releases/2.17.0
[tsdb-release-2-11-0]: https://github.com/timescale/timescaledb/releases/2.11.0
