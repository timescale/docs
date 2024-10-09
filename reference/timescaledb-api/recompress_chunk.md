---
api_name: recompress_chunk()
excerpt: Recompress a chunk that had new data inserted after compression
topics: [compression]
keywords: [compression, recompression, chunks]
tags: [hypertables]
api:
  license: community
  type: function
---

# recompress_chunk() <Tag type="community" content="Community" />

Recompresses a compressed chunk that had more data inserted after compression.

```sql
recompress_chunk(
    chunk REGCLASS,
    if_not_compressed BOOLEAN = false
)
```

You can also recompress chunks by
[running the job associated with your compression policy][run-job].
`recompress_chunk` gives you more fine-grained control by
allowing you to target a specific chunk.

<Highlight type="important">
`recompress_chunk` is deprecated since version 2.14 and will be removed in the future. 
The procedure is now a wrapper which calls [`compress_chunk`](/api/latest/compression/compress_chunk/) 
instead of it. 
</Highlight>

<Highlight type="important">
`recompress_chunk` is implemented as an SQL procedure and not a function. Call
the procedure with `CALL`. Don't use a `SELECT` statement.
</Highlight>

<Highlight type="note">
`recompress_chunk` only works on chunks that have previously been compressed. To compress a
chunk for the first time, use [`compress_chunk`](/api/latest/compression/compress_chunk/).
</Highlight>

## Required arguments

|Name|Type|Description|
|-|-|-|
|`chunk`|`REGCLASS`|The chunk to be recompressed. Must include the schema, for example `_timescaledb_internal`, if it is not in the search path.|

## Optional arguments

|Name|Type|Description|
|-|-|-|
|`if_not_compressed`|`BOOLEAN`|If `true`, prints a notice instead of erroring if the chunk is already compressed. Defaults to `false`.|

## Sample usage

Recompress the chunk `timescaledb_internal._hyper_1_2_chunk`:

```sql
CALL recompress_chunk('_timescaledb_internal._hyper_1_2_chunk');
```

## Troubleshooting

In TimescaleDB 2.6.0 and above, `recompress_chunk` is implemented as a procedure.
Previously, it was implemented as a function. If you are upgrading to
TimescaleDB 2.6.0 or above, the`recompress_chunk`
function could cause an error. For example, trying to run `SELECT
recompress_chunk(i.show_chunks, true) FROM...` gives the following error:

```sql
ERROR:  recompress_chunk(regclass, boolean) is a procedure
```

To fix the error, use `CALL` instead of `SELECT`. You might also need to write a
procedure to replace the full functionality in your `SELECT` statement. For
example:

```sql
DO $$
DECLARE chunk regclass;
BEGIN
  FOR chunk IN SELECT format('%I.%I', chunk_schema, chunk_name)::regclass
  FROM timescaledb_information.chunks
  WHERE is_compressed = true
  LOOP
    RAISE NOTICE 'Recompressing %', chunk::text;
    CALL recompress_chunk(chunk, true);
  END LOOP;
END
$$;
```

[run-job]: /api/:currentVersion:/actions/run_job/
