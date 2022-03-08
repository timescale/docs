# Backfill historical data on compressed chunks
You can backfill historical data by temporarily decompressing any compressed
chunks. Backfilling means inserting data with an older timestamps, beyond the
recent past. Depending on your compression policies, the chunks corresponding to
these timestamps might already be compressed.

For help with backfilling on compressed chunks, you can use the backfilling
function in the [TimescaleDB extras][timescaledb-extras] repository. You can
also manually backfill without the function.

<highlight type="note">
Backfilling is useful for inserting batches of data, rather than individual
rows. For individual rows, use a normal `INSERT`. TimescaleDB [handles the
compression behind the scenes](https://www.timescale.com/blog/timescaledb-2-3-improving-columnar-compression-for-time-series-on-postgresql/).
</highlight>

## Backfill with the backfilling function
You can backfill data by using the `decompress_backfill` function. Before you
begin, add the [`decompress_backfill` function and its supporting
functions][timescaledb-extras-backfill] to your database.

<procedure>

## Backfilling with the backfilling function

<highlight type="note">
Backfill data by first inserting it into a temporary table. Temporary tables are
short-lived. They are automatically dropped when the database session ends. No
clean-up is required. If you backfill regularly, you can choose to use a normal
table instead. This allows multiple writers to insert data into the table at the
same time. When backfilling is complete, clean up by truncating or dropping your
table.
</highlight>

1.  At the `psql` prompt, create a table with the same schema as the hypertable
    you're backfilling into. In this example, the hypertable is named `cpu`.
    ```sql
    CREATE TEMPORARY TABLE cpu_temp AS SELECT * FROM cpu WITH NO DATA;
    ```

1.  Insert your data into the backfill table.

1.  Call the supplied backfill function. This function:
      * Halts the compression policy
      * Identifies the chunks where the backfilled data belongs
      * Decompresses the chunks
      * Inserts data from the temporary table into the hypertable
      * Re-enables the compression policy
    ```sql
    CALL decompress_backfill(staging_table=>'cpu_temp', destination_hypertable=>'cpu');
    ```

</procedure>

## Backfill manually
If you prefer not to use the `decompress_backfill` function, you can perform its
steps manually. In this procedure, you turn off your compression policy and
identify your compressed chunks before inserting your backfilled data.

<procedure>

### Backfilling manually
1.  At the `psql` prompt, find the `job_id` of the compression policy:
    ```sql
    SELECT s.job_id
    FROM timescaledb_information.jobs j
      INNER JOIN timescaledb_information.job_stats s ON j.job_id = s.job_id
      WHERE j.proc_name = 'policy_compression' AND s.hypertable_name = <TARGET_TABLE>;
    ```
1.  Pause compression to prevent the policy from trying to compress chunks that
    you're currently working on:
    ``` sql
    SELECT alter_job(<JOB_ID>, scheduled => false);
    ```
1.  Decompress the chunks that you want to modify:
    ``` sql
    SELECT decompress_chunk('_timescaledb_internal._hyper_2_2_chunk');
    ```
    Repeat for each chunk. Alternatively, you can decompress a set of chunks
    based on a time range using [`show_chunks`][show_chunks]:
    ``` sql
    SELECT decompress_chunk(i) 
      FROM show_chunks(
        '<TARGET_TABLE>', 
        newer_than => '<NEWER_THAN_DATE>', 
        older_than => '<OLDER_THAN_DATE>'
      ) i;
    ```
1.  When you have decompressed all the chunks you want to modify, perform the
    `INSERT` or `UPDATE` commands to backfill the data.
1.  Restart the compression policy job. The next time the job runs, it
    recompresses any chunks that were decompressed.
    ``` sql
    SELECT alter_job(<JOB_ID>, scheduled => true);
    ```
    To recompress chunks immediately, use the `run_job` command:
    ``` sql
    CALL run_job(<JOB_ID>);
    ```

</procedure>

## Future Work [](future-work)

One of the current limitations of TimescaleDB is that once chunks are converted
into compressed column form, we do not allow updates and deletes of the data
or changes to the schema without manual decompression, except as noted [above][compression-schema-changes].
In other words, chunks are partially immutable in compressed form.
Attempts to modify the chunks' data in those cases either errors or fails silently (as preferred by users). 
We plan to remove this limitation in future releases.


[timescaledb-extras]: https://github.com/timescale/timescaledb-extras
[compression-schema-changes]: /how-to-guides/compression/modify-a-schema/
[timescaledb-extras-backfill]: https://github.com/timescale/timescaledb-extras/blob/master/backfill.sql
[run-job]: /api/:currentVersion:/actions/run_job/
[show_chunks]: /api/:currentVersion:/hypertable/show_chunks/