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
|`older_than`|ANY|Specification of cut-off point where any full chunks older than this timestamp should be shown.|
|`newer_than`|ANY|Specification of cut-off point where any full chunks newer than this timestamp should be shown.|

The `older_than` and `newer_than` parameters can be specified in two ways:

*   **interval type:** The cut-off point is computed as `now() -
    older_than` and similarly `now() - newer_than`. An error is returned if an
    INTERVAL is supplied and the time column is not one of a TIMESTAMP,
    TIMESTAMPTZ, or DATE.

*   **timestamp, date, or integer type:** The cut-off point is explicitly given
    as a TIMESTAMP / TIMESTAMPTZ / DATE or as a SMALLINT / INT / BIGINT. The
    choice of timestamp or integer must follow the type of the hypertable's time
    column.

When both arguments are used, the function returns the intersection of the
resulting two ranges. For example, specifying `newer_than => 4 months` and
`older_than => 3 months` shows all full chunks that are between 3 and 4 months
old. Similarly, specifying `newer_than => '2017-01-01'` and
`older_than => '2017-02-01'` shows all full chunks between '2017-01-01' and
'2017-02-01'. Specifying parameters that do not result in an overlapping
intersection between two ranges results in an error.

## Sample usage

Get list of all chunks associated with a table:

```sql
SELECT show_chunks('conditions');
```

Get all chunks from hypertable `conditions` older than 3 months:

```sql
SELECT show_chunks('conditions', older_than => INTERVAL '3 months');
```

Get all chunks from hypertable `conditions` before 2017:

```sql
SELECT show_chunks('conditions', older_than => DATE '2017-01-01');
```

[drop_chunks]: /api/:currentVersion:/hypertable/drop_chunks
