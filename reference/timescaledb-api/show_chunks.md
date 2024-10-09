---
api_name: show_chunks()
excerpt: Show the chunks belonging to a hypertable
topics: [hypertables]
keywords: [chunks, hypertables]
tags: [show, get]
api:
  license: apache
  type: function
---

# show_chunks()

Get list of chunks associated with a hypertable.

Function accepts the following required and optional arguments. These arguments
have the same semantics as the `drop_chunks` [function][drop_chunks].

## Required arguments

|Name|Type|Description|
|-|-|-|
|`relation`|REGCLASS|Hypertable or continuous aggregate from which to select chunks.|

## Optional arguments

|Name|Type|Description|
|-|-|-|
|`older_than`|ANY|Specification of cut-off point where any chunks older than this timestamp should be shown.|
|`newer_than`|ANY|Specification of cut-off point where any chunks newer than this timestamp should be shown.|
|`created_before`|ANY|Specification of cut-off point where any chunks created before this timestamp should be shown.|
|`created_after`|ANY|Specification of cut-off point where any chunks created after this timestamp should be shown.|



The `older_than` and `newer_than` parameters can be specified in two ways:

*   **interval type:** The cut-off point is computed as `now() -
    older_than` and similarly `now() - newer_than`. An error is returned if an
    INTERVAL is supplied and the time column is not one of a TIMESTAMP,
    TIMESTAMPTZ, or DATE.

*   **timestamp, date, or integer type:** The cut-off point is explicitly given
    as a TIMESTAMP / TIMESTAMPTZ / DATE or as a SMALLINT / INT / BIGINT. The
    choice of timestamp or integer must follow the type of the hypertable's time
    column.

The `created_before` and `created_after` parameters can be specified in two ways:

*   **interval type:** The cut-off point is computed as `now() -
    created_before` and similarly `now() - created_after`.  This uses
    the chunk creation time for the filtering.

*   **timestamp, date, or integer type:** The cut-off point is
    explicitly given as a `TIMESTAMP` / `TIMESTAMPTZ` / `DATE` or as a
    `SMALLINT` / `INT` / `BIGINT`. The choice of integer value
    must follow the type of the hypertable's partitioning column. Otherwise
    the chunk creation time is used for the filtering.

When both `older_than` and `newer_than` arguments are used, the
function returns the intersection of the resulting two ranges. For
example, specifying `newer_than => 4 months` and `older_than => 3
months` shows all chunks between 3 and 4 months old.
Similarly, specifying `newer_than => '2017-01-01'` and `older_than
=> '2017-02-01'` shows all chunks between '2017-01-01' and
'2017-02-01'. Specifying parameters that do not result in an
overlapping intersection between two ranges results in an error.

When both `created_before` and `created_after` arguments are used, the
function returns the intersection of the resulting two ranges. For
example, specifying `created_after`=> 4 months` and `created_before`=> 3
months` shows all chunks created between 3 and 4 months from now.
Similarly, specifying `created_after`=> '2017-01-01'` and `created_before`
=> '2017-02-01'` shows all chunks created between '2017-01-01' and
'2017-02-01'. Specifying parameters that do not result in an
overlapping intersection between two ranges results in an error.

<Highlight type="note">
The `created_before`/`created_after` parameters cannot be used together with
`older_than`/`newer_than`.
</Highlight>

## Sample usage

Get list of all chunks associated with a table:

```sql
SELECT show_chunks('conditions');
```

Get all chunks from hypertable `conditions` older than 3 months:

```sql
SELECT show_chunks('conditions', older_than => INTERVAL '3 months');
```

Get all chunks from hypertable `conditions` created before 3 months:

```sql
SELECT show_chunks('conditions', created_before => INTERVAL '3 months');
```

Get all chunks from hypertable `conditions` created in the last 1 month:

```sql
SELECT show_chunks('conditions', created_after => INTERVAL '1 month');
```

Get all chunks from hypertable `conditions` before 2017:

```sql
SELECT show_chunks('conditions', older_than => DATE '2017-01-01');
```

[drop_chunks]: /api/:currentVersion:/hypertable/drop_chunks
