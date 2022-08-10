---
title: Backfill historical data on compressed chunks
excerpt: How to backfill a batch of historical data on a compressed hypertable
keywords: [compression, backfill, hypertables]
---

# Backfill historical data on compressed chunks

In the [TimescaleDB extras][timescaledb-extras] GitHub repository, we provide
explicit functions for
[backfilling batch data to compressed chunks][timescaledb-extras-backfill],
which is useful for inserting a *batch* of backfilled data (as opposed to
individual row inserts). When you backfill data, you insert data corresponding to
a timestamp well in the past, which has a timestamp that already corresponds to
a compressed chunk.

In this example, data is backfilled into a temporary table. Temporary tables are
short-lived and only exist for the duration of the database session.
Alternatively, if backfill is common, one might use a normal table for this
instead, which would allow multiple writers to insert into the table at the same
time before the `decompress_backfill` process.

<procedure>

## Backfilling using the `decompress_backfill` procedure

<highlight type="important">
The `decompress_backfill` function doesn't support distributed hypertables. To
backfill a distributed hypertable, manually decompress the chunks before
inserting data.
</highlight>

To use this procedure:

1.  Create a table with the same schema as the hypertable (in
  this example, `cpu`) that we are backfilling into:

 ```sql
 CREATE TEMPORARY TABLE cpu_temp AS SELECT * FROM cpu WITH NO DATA;
 ```

1.  Insert data into the backfill table.

1.  Use a supplied backfill procedure to perform the above steps: halt
  compression policy, identify those compressed chunks to which the backfilled
  data corresponds, decompress those chunks, insert data from the backfill
  table into the main hypertable, and then re-enable compression policy:

 ```sql
 CALL decompress_backfill(staging_table=>'cpu_temp', destination_hypertable=>'cpu');`
 ```

</procedure>

If you are using a temporary table, the table is automatically dropped at the
end of your database session. If you are using a regular table, after you have
backfilled the data successfully, you want to truncate your table in preparation
for the next backfill (or drop it completely).

## Manually decompressing chunks for backfill

To perform these steps more manually, we first identify and turn off our
compression policy, before manually decompressing chunks. To accomplish this we
first find the job_id of the policy using:

```sql
SELECT s.job_id
FROM timescaledb_information.jobs j
  INNER JOIN timescaledb_information.job_stats s ON j.job_id = s.job_id
WHERE j.proc_name = 'policy_compression' AND s.hypertable_name = <target table>;
```

Next, pause the job with:

``` sql
SELECT alter_job(<job_id>, scheduled => false);
```

You have now paused the compress chunk policy from the hypertable, which leaves
you free to decompress the chunks you need to modify, using either backfill or
update. To decompress the chunks that need to be modified, for each chunk:

``` sql
SELECT decompress_chunk('_timescaledb_internal._hyper_2_2_chunk');
```

Similar to above, you can also decompress a set of chunks based on a
time range by first looking up this set of chunks via `show_chunks`:

``` sql
SELECT decompress_chunk(i) from show_chunks('conditions', newer_than, older_than) i;
```

<highlight type="tip">
You need to run `decompress_chunk` for each chunk that is impacted
by your INSERT or UPDATE statement in backfilling data. Once your needed chunks
are decompressed you can proceed with your data backfill operations.
</highlight>

## Backfill with the backfilling procedure

You can backfill data by using the `decompress_backfill` stored procedure. This
procedure:

1.  Halts the compression policy
1.  Identifies the chunks where the backfilled data belongs
1.  Decompresses the chunks
1.  Inserts data from a temporary table into the hypertable
1.  Re-enables the compression policy

Before you begin, add the [`decompress_backfill` stored procedure and its
supporting functions][timescaledb-extras-backfill] to your database. You can
copy and paste the procedure and function declarations from `backfill.sql` and
run them in your database.

<procedure>

## Backfilling with the backfilling procedure

<highlight type="note">
Backfill data by first inserting it into a temporary table. Temporary tables are
automatically dropped when the database session ends. No clean-up is required.
If you backfill regularly, you can choose to use a normal table instead. This
allows multiple writers to insert data into the table at the same time. When
backfilling is complete, clean up by truncating or dropping your table.
</highlight>

1.  At the `psql` prompt, create a table with the same schema as the hypertable
    you're backfilling into. In this example, the hypertable is named `cpu`.

    ```sql
    CREATE TEMPORARY TABLE cpu_temp AS SELECT * FROM cpu WITH NO DATA;
    ```

1.  Insert your data into the backfill table.
1.  Call the supplied backfill procedure.

    ```sql
    CALL decompress_backfill(staging_table=>'cpu_temp', destination_hypertable=>'cpu');
    ```

</procedure>

## Backfill manually

If you prefer not to use the `decompress_backfill` stored procedure, you can
perform the steps manually. To do so, turn off the compression policy and
identify your compressed chunks before inserting the backfilled data.

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

    Repeat for each chunk.
1.  *OPTIONAL* Alternatively, decompress a set of chunks based on a time range
    using [`show_chunks`][show_chunks]:

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

## Future work

One of the current limitations of TimescaleDB is that once chunks are converted
into compressed column form, you cannot update or delete the data, or change the
schema, without manual decompression, except as noted
[in this section][compression-schema-changes]. In other words, chunks are
partially immutable in compressed form. Attempts to modify the chunks' data in
those cases either errors or fails silently.

[compression-schema-changes]: /timescaledb/:currentVersion:/how-to-guides/compression/modify-a-schema/
[run-job]: /api/:currentVersion:/actions/run_job/

[timescaledb-extras-backfill]: https://github.com/timescale/timescaledb-extras/blob/master/backfill.sql
[timescaledb-extras]: https://github.com/timescale/timescaledb-extras
