# Manual compression [](manual-compression)

Although most users compress data using an automated compression
policy that runs in the background and compresses chunks older than a certain age,
some users want more control over when compression is scheduled or simply want to
compress chunks manually.  Here we will show you how to compress particular chunks
explicitly.

We start by getting a list of the chunks we want to compress. In this case our hypertable
is named 'conditions', and we are looking for the chunks associated with this hypertable
with data older than three days.

``` sql
SELECT show_chunks('conditions', older_than => INTERVAL '3 days');
```

||show_chunks|
|---|---|
|1|_timescaledb_internal_hyper_1_2_chunk|
|2|_timescaledb_internal_hyper_1_3_chunk|

From here we can begin the process of compressing each of the listed chunks with the
following command:

``` sql
SELECT compress_chunk( '<chunk_name>');
```

You can see the results of the compression of that given chunk by running the following:

``` sql
SELECT *
FROM chunk_compression_stats('conditions');
```

| chunk_schema | chunk_name | compression_status | before_compression_table_bytes | before_compression_index_bytes | before_compression_toast_bytes | before_compression_total_bytes | after_compression_table_bytes | after_compression_index_bytes | after_compression_toast_bytes | after_compression_total_bytes | node_name |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| _timescaledb_internal | _hyper_1_1_chunk | Compressed | 8192 bytes | 16 kB | 8192 bytes |  32 kB  | 8192 bytes   | 16 kB  | 8192 bytes | 32 kB | |
| _timescaledb_internal | _hyper_1_20_chunk | Uncompressed | | | | | | | | | |

This result set shows you the chunks for the given hypertable, whether those
chunks are compressed, and stats about those chunks.

We could then proceed to compress all of the chunks in this example that are
more than three days old by repeating the process for the remaining chunks
in the list we generated.

If you want to select which chunks to compress based on their time range in a
more programmatic manner, you can use the output of `show_chunks` to feed a set
of chunks to `compress_chunks` in order to compress each of the chunks:

``` sql
SELECT compress_chunk(i) from show_chunks('conditions', newer_than, older_than) i;
```
