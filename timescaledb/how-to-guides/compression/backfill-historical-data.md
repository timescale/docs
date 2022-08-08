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

In the below example, we backfill data into a temporary table; such temporary
tables are short-lived and only exist for the duration of the database
session. Alternatively, if backfill is common, one might use a normal table for
this instead, which would allow multiple writers to insert into the table at
the same time before the `decompress_backfill` process.

<procedure>

## Backfilling using the `decompress_backfill` procedure

<highlight type="important">
The `decompress_backfill` function doesn't support distributed hypertables. To
backfill a distributed hypertable, manually decompress the chunks before inserting data.
</highlight>

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

</procedure>

If you are using a temporary table, the table is automatically dropped at the end of your
database session. If you are using a regular table, after you have backfilled the
data successfully, you want to truncate your table in preparation
for the next backfill (or drop it completely).

## Manually decompressing chunks for backfill

To perform these steps more manually, we first identify and turn off our
compression policy, before manually decompressing chunks. To accomplish this
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
leaves us free to decompress the chunks we need to modify via backfill or
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
You need to run 'decompress_chunk' for each chunk that is impacted
by your INSERT or UPDATE statement in backfilling data. Once your needed chunks
are decompressed you can proceed with your data backfill operations.
</highlight>

Once your backfill and update operations are complete we can simply re-enable
our compression policy job:

``` sql
SELECT alter_job(<job_id>, scheduled => true);
```

This job re-compresses any chunks that were decompressed during your backfilling
operation the next time it runs. To have it run immediately, you can expressly execute
the command via [`run_job`][run-job]:

``` sql
CALL run_job(<job_id>);
```

## Future work

One of the current limitations of TimescaleDB is that once chunks are converted
into compressed column form, we do not allow updates and deletes of the data
or changes to the schema without manual decompression, except as noted [above][compression-schema-changes].
In other words, chunks are partially immutable in compressed form.
Attempts to modify the chunks' data in those cases either errors or fails silently (as preferred by users). 
We plan to remove this limitation in future releases.

[compression-schema-changes]: /timescaledb/:currentVersion:/how-to-guides/compression/modify-a-schema/
[run-job]: /api/:currentVersion:/actions/run_job/
[timescaledb-extras-backfill]: https://github.com/timescale/timescaledb-extras/blob/master/backfill.sql
[timescaledb-extras]: https://github.com/timescale/timescaledb-extras
