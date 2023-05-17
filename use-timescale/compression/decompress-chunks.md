---
title: Decompression
excerpt: How to decompress a compressed chunk
products: [cloud, mst, self_hosted]
keywords: [compression, hypertables, backfilling]
tags: [decompression]
---

# Decompression

Timescale automatically supports `INSERT`s into compressed chunks. But if you
need to insert a lot of data, for example as part of a bulk backfilling
operation, you should first decompress the chunk. Inserting data into a
compressed chunk is more computationally expensive than inserting data into an
uncompressed chunk. This adds up over a lot of rows.

<Highlight type="important">
When compressing your data, you can reduce the amount of storage space for your
Timescale instance. But you should always leave some additional storage
capacity. This gives you the flexibility to decompress chunks when necessary,
for actions such as bulk inserts.
</Highlight>

This section describes commands to use for decompressing chunks. You can filter
by time to select the chunks you want to decompress. To learn how to backfill
data, see the [backfilling section][backfill].

## Decompress chunks manually

There are several methods for selecting chunks and decompressing them.

### Decompress individual chunks

To decompress a single chunk by name, run this command:

```sql
SELECT decompress_chunk('_timescaledb_internal.<chunk_name>');
```

where, `<chunk_name>` is the name of the chunk you want to decompress.

### Decompress chunks by time

To decompress a set of chunks based on a time range, you can use the output of
`show_chunks` to decompress each one:

```sql
SELECT decompress_chunk(i)
    FROM show_chunks('table_name', older_than, newer_than) i;
```

### Decompress chunks on more precise constraints

If you want to use more precise matching constraints, for example space
partitioning, you can construct a command like this:

```sql
SELECT tableoid::regclass FROM metrics
  WHERE time = '2000-01-01' AND device_id = 1
  GROUP BY tableoid;

                 tableoid
------------------------------------------
 _timescaledb_internal._hyper_72_37_chunk
```

[backfill]: /use-timescale/:currentVersion:/compression/backfill-historical-data/
