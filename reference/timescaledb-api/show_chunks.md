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

Retrieve the list of chunks associated with a hypertable. By default, you retrieve information
about all chunks in `relation`, you can also specify the time period to retrieve the chunk list for. 

## Samples

- Return all chunks associated with a table:

  ```sql
  SELECT show_chunks('conditions');
  ```

- Return chunks added to the `conditions` hypertable more than 3 months ago:

  ```sql
  SELECT show_chunks('conditions', older_than => INTERVAL '3 months');
  ```

- Return chunks added to the `conditions` hypertable in the last 3 months:

  ```sql
  SELECT show_chunks('conditions', created_before => INTERVAL '3 months');
  ```

- Return chunks added to the `conditions` hypertable in the last 1 month:

  ```sql
  SELECT show_chunks('conditions', created_after => INTERVAL '1 month');
  ```

- Return chunks added to the `conditions` hypertable before 2017:

  ```sql
  SELECT show_chunks('conditions', older_than => DATE '2017-01-01');
  ```


## Parameters

|Name|Type| Default | Required | Description | 
|-|-|-|-|-|
|`relation`|REGCLASS| - | ✔                     | Hypertable or continuous aggregate from which to select chunks. |
|`older_than`|ANY| - | ✖️ | Return chunks older than this timestamp. |
|`newer_than`|ANY|- |✖️ | Return chunks newer than this timestamp.     |
|`created_before`|ANY|- |✖️ | Return chunks created before this timestamp. |
|`created_after`|ANY|- |✖️ | Return hunks created after this timestamp.   |

<Highlight type="note">

You cannot use `created_before`/`created_after` together with `older_than`/`newer_than`.

</Highlight>

You use `older_than` and `newer_than` in the following ways:

  *   **interval type:** The cut-off point is computed as `now() -
    older_than` and similarly `now() - newer_than`. An error is returned if an
    INTERVAL is supplied and the time column is not one of a TIMESTAMP,
    TIMESTAMPTZ, or DATE.

  *   **timestamp, date, or integer type:** The cut-off point is explicitly given
      as a TIMESTAMP / TIMESTAMPTZ / DATE or as a SMALLINT / INT / BIGINT. The
      choice of timestamp or integer must follow the type of the hypertable's time
      column.

  When both `older_than` and `newer_than` arguments are used, the
  function returns the intersection of the resulting two ranges. For
  example, specifying `newer_than => 4 months` and `older_than => 3
  months` shows all chunks between 3 and 4 months old.
  Similarly, specifying `newer_than => '2017-01-01'` and `older_than
  => '2017-02-01'` shows all chunks between '2017-01-01' and
  '2017-02-01'. Specifying parameters that do not result in an
  overlapping intersection between two ranges results in an error.

You use `created_before` and `created_after` in the following ways:

  *   **interval type:** The cut-off point is computed as `now() -
    created_before` and similarly `now() - created_after`.  This uses
    the chunk creation time for the filtering.

  *   **timestamp, date, or integer type:** The cut-off point is
        explicitly given as a `TIMESTAMP` / `TIMESTAMPTZ` / `DATE` or as a
        `SMALLINT` / `INT` / `BIGINT`. The choice of integer value
        must follow the type of the hypertable's partitioning column. Otherwise
        the chunk creation time is used for the filtering.

  When both `created_before` and `created_after` arguments are used, the
  function returns the intersection of the resulting two ranges. For
  example, specifying `created_after`=> 4 months` and `created_before`=> 3
  months` shows all chunks created between 3 and 4 months from now.
  Similarly, specifying `created_after`=> '2017-01-01'` and `created_before`
  => '2017-02-01'` shows all chunks created between '2017-01-01' and
  '2017-02-01'. Specifying parameters that do not result in an
  overlapping intersection between two ranges results in an error.

These arguments have the same semantics as [`drop_chunks`][drop_chunks].

## Returns

I need to ask about this one. 

[drop_chunks]: /api/:currentVersion:/hypertable/drop_chunks
