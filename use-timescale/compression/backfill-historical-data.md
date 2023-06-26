---
title: Backfill historical data on compressed chunks
excerpt: How to backfill a batch of historical data on a compressed hypertable
products: [cloud, mst, self_hosted]
keywords: [compression, backfilling, hypertables]
---

# Backfill historical data on compressed chunks

When you backfill data, you are inserting data into a chunk that has already
been compressed. As of version 2.10, this has been greatly simplified by running
insert commands on compressed chunks directly. When doing bulk backfilling,
it is recommended to pause the compression job until finished so the policy
doesn't compress the chunk you are working on.

This section contains procedures for bulk backfilling, taking
you through these steps:

1.  Temporarily turning off any existing compression policy. This stops the
    policy from trying to compress chunks that you are currently working on.
1.  Performing the insertion or backfill.
1.  Re-enabling the compression policy. This re-compresses the chunks you worked
    on.
    
Caveats:
  *  Backfilling compressed chunks with unique constraints is only supported in version 2.11 and above.
  *  In order to backfill the data and enforce unique constraints, it is possible that we end up decompressing some data. If we are backfilling larger amounts of data, it might be more performant to manully decompress the chunk that you are working on (as shown in the section [Backfilling manually][backfilling-manually] below).


## Backfill with a supplied function

To make backfilling easier, you can use the
[backfilling functions][timescaledb-extras-backfill] in the
[TimescaleDB extras][timescaledb-extras] GitHub repository. In particular, the
`decompress_backfill` procedure automates many of the backfilling steps for you.

<Highlight type="note">
This section shows you how to bulk backfill data using a temporary table.
Temporary tables only exist for the duration of the database session, and then
are automatically dropped. If you backfill regularly, you might prefer to use a
regular table instead, so that multiple writers can insert into the table at the
same time. In this case, after you are done backfilling the data, clean up by
truncating your table in preparation for the next backfill.
</Highlight>

<Procedure>

### Backfilling with a supplied function

1.  At the psql prompt, create a temporary table with the same schema as the
    hypertable you want to backfill into. In this example, the table is named
    `example`, and the temporary table is named `cpu_temp`:

    ```sql
    CREATE TEMPORARY TABLE cpu_temp AS SELECT * FROM example WITH NO DATA;
    ```

1.  Insert your data into the temporary table.
1.  Call the `decompress_backfill` procedure. This procedure halts the
    compression policy, identifies the compressed chunks that the backfilled
    data corresponds to, decompresses the chunks, inserts data from the backfill
    table into the main hypertable, and then re-enables the compression policy:

    ```sql
    CALL decompress_backfill(
        staging_table=>'cpu_temp', destination_hypertable=>'example'
    );
    ```

</Procedure>

## Backfill manually

If you don't want to use a supplied function, you can perform the steps
manually.

<Procedure>

### Backfilling manually

1.  At the psql prompt, find the `job_id` of the policy:

    ```sql
    SELECT j.job_id
        FROM timescaledb_information.jobs j
        WHERE j.proc_name = 'policy_compression'
            AND j.hypertable_name = <target table>;
    ```

1.  Pause compression, to prevent the policy from trying to compress chunks that
    you are currently working on:

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
    SELECT decompress_chunk(i)
        FROM show_chunks('conditions', newer_than, older_than) i;
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

</Procedure>

[timescaledb-extras]: https://github.com/timescale/timescaledb-extras
[timescaledb-extras-backfill]: https://github.com/timescale/timescaledb-extras/blob/master/backfill.sql
[backfilling-manually]: /use-timescale/:currentVersion:/compression/backfill-historical-data/#backfilling-manually
