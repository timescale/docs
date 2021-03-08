# Decompressing Chunks [](decompress-chunks)

In order to decompress individual chunks, you can run a `decompress_chunk`
command in much the same way you can manually compress an individual chunk:

``` sql
SELECT decompress_chunk('_timescaledb_internal._hyper_2_2_chunk');
```

Similar to above, you can also decompress a set of chunks based on a
time range by first looking up this set of chunks via `show_chunks`:

``` sql
SELECT decompress_chunk(i) from show_chunks('conditions', newer_than, older_than) i;
```

Or if you want to have more precise matching constraints, including that you
are using space partitioning (e.g., based on `device_id`):

``` sql
SELECT tableoid::regclass FROM metrics
  WHERE time = '2000-01-01' AND device_id = 1
  GROUP BY tableoid;

                 tableoid
------------------------------------------
 _timescaledb_internal._hyper_72_37_chunk
```

Decompression might often be employed in the event that you need to backfill or
update data that lives in a compressed chunk, as TimescaleDB does not currenty
support modifying (inserting into, updating, deleted from) compressed chunks.

Next we walk you through the instructions for preparing your table for
inserting or backfilling data.   The general approach has four steps:

1. Temporarily turn off any compression policy (as otherwise that policy will attempt
to re-compress the chunks that we are currently working on)

1. Decompress chunks that will be effected by modifications or backfill

1. Perform the modifications or backfill

1. Re-enable compression policy (which will have the effect of recompressing
any of our recently-decompressed chunks)

In the next sections, we describe some automated helper functions we provide
that perform all five steps in a more automatic fashion, and then also walk you
through more manual instructions.


## Storage considerations for decompressing chunks [](storage-for-decompression)

Another factor to be mindful of when planning your compression strategy is the
additional storage overhead needed to decompress chunks. This is key when you are
provisioning storage for use with TimescaleDB. You want to ensure that you plan for
enough storage headroom to decompress some chunks if needed.