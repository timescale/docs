# Decompression
If you need to backfill or update data in a compressed chunk, decompress
the chunk first. Inserting data into a compressed chunk is more computationally
expensive than inserting data into an uncompressed chunk, so decompressing the
chunk is also a good idea if you need to backfill large amounts of data.

<highlight type="tip">
When you are planning your compression strategy, make sure you leave enough
additional storage capacity for decompressing chunks if you need to.
</highlight>

These are the main steps for decompressing chunks in preparation for inserting
or backfilling data:
1.  Temporarily turn off any existing compression policy. This stops the policy
    trying to compress chunks that you are currently working on.
1.  Decompress chunks.
1.  Perform the insertion or backfill.
1.  Re-enable the compression policy. This re-compresses the chunks you worked on.

## Decompress chunks manually
There are several methods for selecting chunks and decompressing them.

### Decompress individual chunks
To decompress a single chunk by name, run this command:
```sql
SELECT decompress_chunk('_timescaledb_internal.<chunk_name>');
```
In this example, `chunk_name` is the name of the chunk that you want to decompress.
### Decompress chunks by time
To decompress a set of chunks based on a time range, you can use the output of
`show_chunks` to decompress each one:
```sql
SELECT decompress_chunk(i) from show_chunks('table_name', newer_than, older_than) i;
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

# Backfill historical data on compressed chunks
When you backfill data, you are inserting data that has a timestamp in the past
into a corresponding chunk that has already been compressed.

In this section, we explain how to backfill data into a temporary table.
Temporary tables only exist for the duration of the database session, and then
are automatically dropped, This is the simplest method for doing a large
backfill operation.

If you backfill regularly, you might prefer to use a regular table instead, so
that multiple writers can insert into the table at the same time before the
`decompress_backfill` process. In this case, after you are done backfilling the
data, clean up by truncating your table in preparation for the next backfill, or
drop it completely.

## Backfill with a supplied function
If you need to insert a batch of backfilled data, the [TimescaleDB
extras][timescaledb-extras] GitHub repository includes functions for
[backfilling batch data to compressed chunks][timescaledb-extras-backfill].  In this procedure, we describe how to use the `decompress_backfill` function.

<procedure>

###  Backfilling with a supplied function
1.  At the psql prompt, create a temporary table with the same schema as the hypertable you want to backfill into. In this example, our table is called `example`, and the data column is `cpu_temp`:
    ```sql
    CREATE TEMPORARY TABLE cpu_temp AS SELECT * FROM example WITH NO DATA;
    ```
1.  Insert your data into the backfill table.
1.  Use a supplied backfill function. This function halts the compression
    policy, identifies the compressed chunks that the backfilled data
    corresponds to, decompresses the chunks, inserts data from the backfill
    table into the main hypertable, and then re-enables the compression policy:
    ```sql
    CALL decompress_backfill(staging_table=>'cpu_temp', destination_hypertable=>'example');
    ```

</procedure>

## Backfill manually
If you don't want to use a supplied function, you can perform the steps
manually. In this procedure, we describe how to identify and turn off your
compression policy, before manually decompressing chunks.

<procedure>

### Backfilling manually
1.  At the psql prompt, find the `job_id` of the policy:
    ```sql
    SELECT s.job_id
    FROM timescaledb_information.jobs j
      INNER JOIN timescaledb_information.job_stats s ON j.job_id = s.job_id
      WHERE j.proc_name = 'policy_compression' AND s.hypertable_name = <target table>;
    ```
1.  Pause compression, to prevent the policy trying to compress chunks that you
    are currently working on:
    ``` sql
    SELECT alter_job(<job_id>, scheduled => false);
    ```
1.  Decompress the chunks that you want to modify.
    ``` sql
    SELECT decompress_chunk('_timescaledb_internal._hyper_2_2_chunk');
    ```
    Repeat for each chunk. Alternatively, you can decompress a set of chunks
    based on a time range using `show_chunks`:
    ``` sql
    SELECT decompress_chunk(i) from show_chunks('conditions', newer_than, older_than) i;
    ```
1.  When you have decompressed all the chunks you want to modify, perform the
    `INSERT` or `UPDATE` commands to backfill the data.
1.  Restart the compression policy job. The next time the job runs, it
    recompresses any chunks that were decompressed.
    ``` sql
    SELECT alter_job(<job_id>, scheduled => true);
    ```
    Alternatively, to recompress chunks immediately, use the `run_job` command:
    ``` sql
    CALL run_job(<job_id>);
    ```

</procedure>

[timescaledb-extras]: https://github.com/timescale/timescaledb-extras
[timescaledb-extras-backfill]: https://github.com/timescale/timescaledb-extras/blob/master/backfill.sql
