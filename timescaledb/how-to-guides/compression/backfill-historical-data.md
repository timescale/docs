# Backfill historical data on compressed chunks

In the [TimescaleDB extras][timescaledb-extras] GitHub repository, we provide
explicit functions for [backfilling batch data to compressed
chunks][timescaledb-extras-backfill], which is useful for inserting a *batch*
of backfilled data (as opposed to individual row inserts). By "backfill", we
mean inserting data corresponding to a timestamp well in the past, which given
its timestamp, already corresponds to a compressed chunk.

In the below example, we backfill data into a temporary table; such temporary
tables are short-lived and only exist for the duration of the database
session. Alternatively, if backfill is common, one might use a normal table for
this instead, which would allow multiple writers to insert into the table at
the same time before the `decompress_backfill` process.

To use this procedure:

1. Create a table with the same schema as the hypertable (in
  this example, `cpu`) that we are backfilling into:

 ```sql
 CREATE TEMPORARY TABLE cpu_temp AS SELECT * FROM cpu WITH NO DATA;
 ```

1. Insert data into the backfill table.

1. Use a supplied backfill procedure to perform the above steps: halt
  compression policy, identify those compressed chunks to which the backfilled
  data corresponds, decompress those chunks, insert data from the backfill
  table into the main hypertable, and then re-enable compression policy:

 ```sql
 CALL decompress_backfill(staging_table=>'cpu_temp', destination_hypertable=>'cpu');`
 ```

If using a temp table, the table is automatically dropped at the end of your
database session.  If using a normal table, after you are done backfilling the
data successfully, you will likely want to truncate your table in preparation
for the next backfill (or drop it completely).

## Manually decompressing chunks for backfill

To perform these steps more manually, we first identify and turn off our
compression policy, before manually decompressing chunks.  To accomplish this
we first find the job_id of the policy using:

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

We have now paused the compress chunk policy from the hypertable which
will leave us free to decompress the chunks we need to modify via backfill or
update. To decompress the chunk(s) that we will be modifying, for each chunk:

``` sql
SELECT decompress_chunk('_timescaledb_internal._hyper_2_2_chunk');
```

Similar to above, you can also decompress a set of chunks based on a
time range by first looking up this set of chunks via `show_chunks`:

``` sql
SELECT decompress_chunk(i) from show_chunks('conditions', newer_than, older_than) i;
```

<highlight type="tip">
You need to run 'decompress_chunk' for each chunk that will be impacted
by your INSERT or UPDATE statement in backfilling data. Once your needed chunks
are decompressed you can proceed with your data backfill operations.
</highlight>

Once your backfill and update operations are complete we can simply re-enable
our compression policy job:

``` sql
SELECT alter_job(<job_id>, scheduled => true);
```

This job will re-compress any chunks that were decompressed during your backfilling
operation the next time it runs. To have it run immediately, you can expressly execute
the command via [`run_job`][run-job]:

``` sql
CALL run_job(<job_id>);
```

## Future Work [](future-work)

One of the current limitations of TimescaleDB is that once chunks are converted
into compressed column form, we do not currently allow updates and deletes
of the data or changes to the schema without manual
decompression, except as noted [above][compression-schema-changes]. In other
words, chunks are partially immutable in compressed form. Attempts to modify
the chunks' data in those cases will either error or fail silently (as
preferred by users). We plan to remove this limitation in future releases.


[timescaledb-extras]: https://github.com/timescale/timescaledb-extras
[compression-schema-changes]: /how-to-guides/compression/modify-a-schema/
[timescaledb-extras-backfill]: https://github.com/timescale/timescaledb-extras/blob/master/backfill.sql
[run-job]: /api/:currentVersion:/actions-and-automation/run_job/
