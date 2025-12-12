---
title: Decompression
excerpt: Manually decompress compressed chunks by name, time, or more precise constraints
products: [cloud, mst, self_hosted]
keywords: [compression, hypertables, backfilling]
tags: [decompression]
---

import Deprecated2180 from "versionContent/_partials/_deprecated_2_18_0.mdx";

# Decompression

<Deprecated2180 /> Superseded by <a href="https://www.tigerdata.com/docs/api/:currentVersion:/hypercore/convert_to_rowstore/">`convert_to_rowstore`</a>. 
However, compression APIs are still supported, you do not need to migrate to the hypercore APIs.

<Highlight type="important">

When compressing your data, you can reduce the amount of storage space used. But you should always leave some additional storage
capacity. This gives you the flexibility to decompress chunks when necessary,
for actions such as bulk inserts.

</Highlight>

This section describes commands to use for decompressing chunks. You can filter
by time to select the chunks you want to decompress.

## Decompress chunks manually

Before decompressing chunks, stop any compression policy on the hypertable you are decompressing. 
The database automatically recompresses your chunks in the next scheduled job. 
If you accumulate a large amount of chunks that need to be compressed, the [troubleshooting guide][troubleshooting-oom-chunks] shows how to compress a backlog of chunks.
For more information on how to stop and run compression policies using `alter_job()`, see the [API reference][alter_job].

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
SELECT decompress_chunk(c, true)
    FROM show_chunks('table_name', older_than, newer_than) c;
```

For more information about the `decompress_chunk` function, see the `decompress_chunk`
[API reference][api-reference-decompress].

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

[api-reference-decompress]: /api/:currentVersion:/compression/decompress_chunk/
[alter_job]: /api/:currentVersion:/jobs-automation/alter_job/
[troubleshooting-oom-chunks]: /use-timescale/:currentVersion:/hypercore/troubleshooting/#out-of-memory-errors-after-enabling-the-columnstore
