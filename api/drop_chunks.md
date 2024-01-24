---
api_name: drop_chunks()
excerpt: Delete chunks by time range
topics: [data retention]
keywords: [data retention, chunks, delete]
tags: [drop]
api:
  license: apache
  type: function
---

# drop_chunks()

Removes data chunks whose time range falls completely before (or
after) a specified time. Shows a list of the chunks that were
dropped, in the same style as the `show_chunks` [function][show_chunks].

Chunks are constrained by a start and end time and the start time is
always before the end time. A chunk is dropped if its end time is
older than the `older_than` timestamp or, if `newer_than` is given,
its start time is newer than the `newer_than` timestamp.

Note that, because chunks are removed if and only if their time range
falls fully before (or after) the specified timestamp, the remaining
data may still contain timestamps that are before (or after) the
specified one.

Chunks can only be dropped based on their time intervals. They cannot be dropped
based on a hash partition.

## Required arguments

|Name|Type|Description|
|-|-|-|
|`relation`|REGCLASS|Hypertable or continuous aggregate from which to drop chunks.|

## Optional arguments

|Name|Type|Description|
|-|-|-|
|`older_than`|ANY|Specification of cut-off point where any chunks older than this timestamp should be removed.|
|`newer_than`|ANY|Specification of cut-off point where any chunks newer than this timestamp should be removed.|
|`verbose`|BOOLEAN|Setting to true displays messages about the progress of the reorder command. Defaults to false.|
|`created_before`|ANY|Specification of cut-off point where any chunks created before this timestamp should be removed.|
|`created_after`|ANY|Specification of cut-off point where any chunks created after this timestamp should be removed.|

The `older_than` and `newer_than` parameters can be specified in two ways:

*   **interval type:** The cut-off point is computed as `now() -
    older_than` and similarly `now() - newer_than`.  An error is
    returned if an INTERVAL is supplied and the time column is not one
    of a `TIMESTAMP`, `TIMESTAMPTZ`, or `DATE`.

*   **timestamp, date, or integer type:** The cut-off point is
    explicitly given as a `TIMESTAMP` / `TIMESTAMPTZ` / `DATE` or as a
    `SMALLINT` / `INT` / `BIGINT`. The choice of timestamp or integer
    must follow the type of the hypertable's time column.

The `created_before` and `created_after` parameters can be specified in two ways:

*   **interval type:** The cut-off point is computed as `now() -
    created_before` and similarly `now() - created_after`.  This uses
    the chunk creation time relative to the current time for the filtering.

*   **timestamp, date, or integer type:** The cut-off point is
    explicitly given as a `TIMESTAMP` / `TIMESTAMPTZ` / `DATE` or as a
    `SMALLINT` / `INT` / `BIGINT`. The choice of integer value
    must follow the type of the hypertable's partitioning column. Otherwise
    the chunk creation time is used for the filtering.

<Highlight type="warning">
When using just an interval type, the function assumes that
you are removing things _in the past_. If you want to remove data
in the future, for example to delete erroneous entries, use a timestamp.
</Highlight>

When both `older_than` and `newer_than` arguments are used, the
function returns the intersection of the resulting two ranges. For
example, specifying `newer_than => 4 months` and `older_than => 3
months` drops all chunks between 3 and 4 months old.
Similarly, specifying `newer_than => '2017-01-01'` and `older_than
=> '2017-02-01'` drops all chunks between '2017-01-01' and
'2017-02-01'. Specifying parameters that do not result in an
overlapping intersection between two ranges results in an error.

When both `created_before` and `created_after` arguments are used, the
function returns the intersection of the resulting two ranges. For
example, specifying `created_after` => 4 months` and `created_before`=> 3
months` drops all chunks created between 3 and 4 months from now.
Similarly, specifying `created_after`=> '2017-01-01'` and `created_before`
=> '2017-02-01'` drops all chunks created between '2017-01-01' and
'2017-02-01'. Specifying parameters that do not result in an
overlapping intersection between two ranges results in an error.

<Highlight type="note">
The `created_before`/`created_after` parameters cannot be used together with
`older_than`/`newer_than`.
</Highlight>

## Sample usage

Drop all chunks from hypertable `conditions` older than 3 months:

```sql
SELECT drop_chunks('conditions', INTERVAL '3 months');
```

Example output:

```sql
              drop_chunks
----------------------------------------
 _timescaledb_internal._hyper_3_5_chunk
 _timescaledb_internal._hyper_3_6_chunk
 _timescaledb_internal._hyper_3_7_chunk
 _timescaledb_internal._hyper_3_8_chunk
 _timescaledb_internal._hyper_3_9_chunk
(5 rows)
```

Drop all chunks from hypertable `conditions` created before 3 months:

```sql
SELECT drop_chunks('conditions', created_before => now() -  INTERVAL '3 months');
```

Drop all chunks more than 3 months in the future from hypertable
`conditions`. This is useful for correcting data ingested with
incorrect clocks:

```sql
SELECT drop_chunks('conditions', newer_than => now() + interval '3 months');
```

Drop all chunks from hypertable `conditions` before 2017:

```sql
SELECT drop_chunks('conditions', '2017-01-01'::date);
```

Drop all chunks from hypertable `conditions` before 2017, where time
column is given in milliseconds from the UNIX epoch:

```sql
SELECT drop_chunks('conditions', 1483228800000);
```

Drop all chunks older than 3 months ago and newer than 4 months ago from hypertable `conditions`:

```sql
SELECT drop_chunks('conditions', older_than => INTERVAL '3 months', newer_than => INTERVAL '4 months')
```

Drop all chunks created 3 months ago and created 4 months before from  hypertable `conditions`:

```sql
SELECT drop_chunks('conditions', created_before => INTERVAL '3 months', created_after => INTERVAL '4 months')
```

Drop all chunks older than 3 months ago across all hypertables:

```sql
SELECT drop_chunks(format('%I.%I', hypertable_schema, hypertable_name)::regclass, INTERVAL '3 months')
  FROM timescaledb_information.hypertables;
```

[show_chunks]: /api/:currentVersion:/hypertable/show_chunks/
