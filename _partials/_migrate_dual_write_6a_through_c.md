Dump the data from your source database on a per-table basis into CSV format,
and restore those CSVs into the target database using the
`timescaledb-parallel-copy` tool.

### 6a. Determine the time range of data to be copied

Determine the window of data that to be copied from the source database to the
target. Depending on the volume of data in the source table, it may be sensible
to split the source table into multiple chunks of data to move independently.
In the following steps, this time range is called `<start>` and `<end>`.

Usually the `time` column is of type `timestamp with time zone`, so the values
of `<start>` and `<end>` must be something like `2023-08-01T00:00:00Z`. If the
`time` column is not a `timestamp with time zone` then the values of `<start>`
and `<end>` must be the correct type for the column.

If you intend to copy all historic data from the source table, then the value
of `<start>` can be `'-infinity'`, and the `<end>` value is the value of the
completion point `T` that you determined.

### 6b. Remove overlapping data in the target

The dual-write process may have already written data into the target database
in the time range that you want to move. In this case, the dual-written data
must be removed. This can be achieved with a `DELETE` statement, as follows:

```bash
psql $TARGET -c "DELETE FROM <hypertable> WHERE time >= <start> AND time < <end>);"
```

<Highlight type="important">
The BETWEEN operator is inclusive of both the start and end ranges, so it is
not recommended to use it.
</Highlight>

### 6c. Turn off compression policies in the target for the hypertable

Compression policies must be turned off for the target hypertable while data is
being backfilled. This prevents the compression policy from compressing chunks
which are only half full.

In the following command, replace `<hypertable>` with the fully qualified table
name of the target hypertable, for example `public.metrics`:

```bash
psql -d $TARGET -f -v hypertable=<hypertable> - <<'EOF'
SELECT public.alter_job(j.id, scheduled=>false)
FROM _timescaledb_config.bgw_job j
JOIN _timescaledb_catalog.hypertable h ON h.id = j.hypertable_id
WHERE j.proc_schema IN ('_timescaledb_internal', '_timescaledb_functions')
  AND j.proc_name = 'policy_compression'
  AND j.id >= 1000
  AND format('%I.%I', h.schema_name, h.table_name)::text::regclass = :'hypertable'::text::regclass;
EOF
```
