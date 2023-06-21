---
title: Inserting or modifying data in compressed chunks
excerpt: What happens when you try to modify data in a compressed hypertable
products: [cloud, mst, self_hosted]
keywords: [compression, backfilling, hypertables]
---

# Insert and modify compressed data

In TimescaleDB&nbsp;2.11 and later, you can insert data into compressed chunks,
and modify data in compressed rows.

## Insert data into compressed chunks

<Tabs>

<Tab title="TimescaleDB&nbsp;2.11 and later>

In TimescaleDB&nbsp;2.11 and later, you can insert data into compressed chunks.
This works even if the data you are inserting has unique constraints, and those
constraints are preserved during the insert operation. This is done by using a
PostgreSQL function that decompresses relevant data on the fly to check if the
new data breaks unique checks. This means that any time you insert data into a
compressed chunk, a small amount of data is decompressed to allow a speculative
insertion, and block any inserts which could violate constraints.

</Tab>

<Tab title="TimescaleDB&nbsp;2.10">

In TimescaleDB&nbsp;2.10, you can insert data into compressed chunks with some
limitations. The primary limitation is that you can't insert data with unique
constraints. Additionally, newly inserted data needs to be compressed at the
same time as the data in the chunk, either by a running recompression policy, or
by using `recompress_chunk` manually on the chunk.

</Tab>

<Tab title="TimescaleDB&nbsp;2.9 and earlier">

In TimescaleDB&nbsp;2.9 and earlier, you cannot insert data into compressed chunks.

</Tab>

</Tabs>

## Modify data in compressed rows

In TimescaleDB&nbsp;2.11 and later, you can also use `UPDATE` and `DELETE`
commands to modify existing rows in compressed chunks. This works in a similar
way to insert operations, where a small amount of data is decompressed to be
able to run the modifications. The system attempts to only decompress data that
is necessary, to reduce the amount decompression that is done, but in some cases
the modification commands can end up decompressing a large amount of data. This
often happens if there are no qualifiers, or if the qualifiers can't be used to
filter. You can try and avoid this by using columns for `segmentby` and
`orderby`, which allows as much data as possible to be filtered out before the
decompression and modification operations.
