# Decompression
If you need backfill or update data in a compressed chunk, you should decompress
the chunk first. Inserting data into a compressed chunk is more computationally
expensive than inserting data into an uncompressed chunk, so decompressing the
chunk is also a good idea if you need to backfill large amounts of data.

<highlight type="tip">
When you are planning your compression strategy, make sure you leave enough
additional storage capacity for decompressing chunks if you need to.
</highlight>

These are the main steps for decompressing chunks in preparation for inserting or backfilling data:
1.  Temporarily turn off any existing compression policy. This stops the policy trying to compress chunks that you are currently working on.
1.  Decompress chunks.
1.  Perform the insertion or backfill.
1.  Re-enable the compression policy. This will re-compress the chunks you worked on.

## Decompress chunks manually
There are several methods for selecting chunks and decompressing them.

### Decompress individual chunks
To decompress a single chunk by name, run this command:
```sql
SELECT decompress_chunk('chunk_name');
```

### Decompress chunks by time
To decompress a set of chunks based on a time range, you can use the output of `show_chunks` to decompress each one:
```sql
SELECT decompress_chunk(i) from show_chunks('table_name', newer_than, older_than) i;
```

### Decompress chunks on more precise constraints
If you want to use more precise matching constraints, for example space partitioning, you can construct a command like this:
```sql
SELECT tableoid::regclass FROM metrics
  WHERE time = '2000-01-01' AND device_id = 1
  GROUP BY tableoid;

                 tableoid
------------------------------------------
 _timescaledb_internal._hyper_72_37_chunk
```
