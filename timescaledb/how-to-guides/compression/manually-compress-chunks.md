# Manual compression
In most cases, an automated compression policy is sufficient. However, if you
want more control over compression, you can also manually compress specific
chunks.

<highlight type="warning">
Compression alters data on your disk, so always back up before you start.
</highlight>

## Compress chunks manually
Before you start, you need a list of chunks to compress. In this example, we are
using a hypertable called `example`, and compressing these chunks that are older
than three days.

<procedure>

### Selecting chunks to compress
1.  At the psql prompt, select all chunks in the table `example` that are older
    than three days:
    ```sql
    SELECT show_chunks('example', older_than => INTERVAL '3 days');
    ```
1.  This returns a list of chunks. Take a note of the chunk names:

    ||show_chunks|
    |---|---|
    |1|_timescaledb_internal_hyper_1_2_chunk|
    |2|_timescaledb_internal_hyper_1_3_chunk|

</procedure>

When you are happy with the list of chunks, you can use the chunk names to manually compress each one.

<procedure>

### Compressing chunks manually
1.  At the psql prompt, compress the chunk:
    ```sql
    SELECT compress_chunk( '<chunk_name>');
    ```
1.  Check the results of the compression with this command:
    ```sql
    SELECT *
    FROM chunk_compression_stats('example');
    ```
    The results show the chunks for the given hypertable, their compression status, and some other statistics:

    |chunk_schema|chunk_name|compression_status|before_compression_table_bytes|before_compression_index_bytes|before_compression_toast_bytes|before_compression_total_bytes|after_compression_table_bytes|after_compression_index_bytes|after_compression_toast_bytes|after_compression_total_bytes|node_name|
    |---|---|---|---|---|---|---|---|---|---|---|---|
    |_timescaledb_internal|_hyper_1_1_chunk|Compressed|8192 bytes|16 kB|8192 bytes|32 kB|8192 bytes|16 kB|8192 bytes|32 kB||
    |_timescaledb_internal|_hyper_1_20_chunk|Uncompressed||||||||||
    
1.  Repeat for all chunks you want to compress.

</procedure>

## Manually compress chunks in a single command
Alternatively, you can select the chunks and compress them in a single command
by using the output of the `show_chunks` command to compress each one. For
example, use this command to compress chunks between one and three weeks old 
if they are not already compressed:
```sql
SELECT compress_chunk(i, if_not_compressed => true) 
  FROM show_chunks('example', now() - INTERVAL '1 week', now() - INTERVAL '3 weeks') i;
```
