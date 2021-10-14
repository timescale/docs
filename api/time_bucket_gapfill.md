## time_bucket_gapfill() <tag type="community">Community</tag>

The `time_bucket_gapfill` function works similar to `time_bucket` but also activates gap
filling for the interval between `start` and `finish`. It can only be used with an aggregation
query. Values outside of `start` and `finish` will pass through but no gap filling will be
done outside of the specified range.

Starting with version 1.3.0, `start` and `finish` are optional arguments and will
be inferred from the WHERE clause if not supplied as arguments.

<highlight type="tip">
 We recommend using a WHERE clause whenever possible (instead of just
`start` and `finish` arguments), as start and finish arguments will not filter
input rows.  Thus without a WHERE clause, this will lead TimescaleDB's planner
to select all data and not perform constraint exclusion to exclude chunks from
further processing, which would be less performant.
</highlight>

The `time_bucket_gapfill` must be a top-level expression in a query or
subquery, as shown in the above examples.  You cannot, for example, do
something like `round(time_bucket_gapfill(...))` or cast the result of the gapfill
call (unless as a subquery where the outer query does the type cast).

For more information about gapfilling and interpolation functions, see the
[hyperfunctions documentation][hyperfunctions-gapfilling].

### Required Arguments

|Name|Type|Description|
|---|---|---|
| `bucket_width` | INTERVAL | A PostgreSQL time interval for how long each bucket is |
| `time` | TIMESTAMP | The timestamp to bucket |

### Optional Arguments

|Name|Type|Description|
|---|---|---|
| `start` | TIMESTAMP | The start of the gapfill period |
| `finish` | TIMESTAMP | The end of the gapfill period |

Note that explicitly provided `start` and `stop` or derived from WHERE clause values
need to be simple expressions. Such expressions should be evaluated to constants
at the query planning. For example, simple expressions can contain constants or
call to `now()`, but cannot reference to columns of a table.

### For Integer Time Inputs

#### Required Arguments

|Name|Type|Description|
|---|---|---|
| `bucket_width` | INTEGER | integer interval for how long each bucket is |
| `time` | INTEGER | The timestamp to bucket |

### Optional Arguments

|Name|Type|Description|
|---|---|---|
| `start` | INTEGER | The start of the gapfill period |
| `finish` | INTEGER | The end of the gapfill period |

Starting with version 1.3.0 `start` and `finish` are optional arguments and will
be inferred from the WHERE clause if not supplied as arguments.

### Sample Usage

Get the metric value every day over the last 7 days:

```sql
SELECT
  time_bucket_gapfill('1 day', time) AS day,
  device_id,
  avg(value) AS value
FROM metrics
WHERE time > now() - INTERVAL '1 week' AND time < now()
GROUP BY day, device_id
ORDER BY day;

           day          | device_id | value
------------------------+-----------+-------
 2019-01-10 01:00:00+01 |         1 |
 2019-01-11 01:00:00+01 |         1 |   5.0
 2019-01-12 01:00:00+01 |         1 |
 2019-01-13 01:00:00+01 |         1 |   7.0
 2019-01-14 01:00:00+01 |         1 |
 2019-01-15 01:00:00+01 |         1 |   8.0
 2019-01-16 01:00:00+01 |         1 |   9.0
(7 row)
```

Get the metric value every day over the last 7 days carrying forward the previous seen value if none is available in an interval:

```sql
SELECT
  time_bucket_gapfill('1 day', time) AS day,
  device_id,
  avg(value) AS value,
  locf(avg(value))
FROM metrics
WHERE time > now() - INTERVAL '1 week' AND time < now()
GROUP BY day, device_id
ORDER BY day;

           day          | device_id | value | locf
------------------------+-----------+-------+------
 2019-01-10 01:00:00+01 |         1 |       |
 2019-01-11 01:00:00+01 |         1 |   5.0 |  5.0
 2019-01-12 01:00:00+01 |         1 |       |  5.0
 2019-01-13 01:00:00+01 |         1 |   7.0 |  7.0
 2019-01-14 01:00:00+01 |         1 |       |  7.0
 2019-01-15 01:00:00+01 |         1 |   8.0 |  8.0
 2019-01-16 01:00:00+01 |         1 |   9.0 |  9.0
```

Get the metric value every day over the last 7 days interpolating missing values:

```sql
SELECT
  time_bucket_gapfill('5 minutes', time) AS day,
  device_id,
  avg(value) AS value,
  interpolate(avg(value))
FROM metrics
WHERE time > now() - INTERVAL '1 week' AND time < now()
GROUP BY day, device_id
ORDER BY day;

           day          | device_id | value | interpolate
------------------------+-----------+-------+-------------
 2019-01-10 01:00:00+01 |         1 |       |
 2019-01-11 01:00:00+01 |         1 |   5.0 |         5.0
 2019-01-12 01:00:00+01 |         1 |       |         6.0
 2019-01-13 01:00:00+01 |         1 |   7.0 |         7.0
 2019-01-14 01:00:00+01 |         1 |       |         7.5
 2019-01-15 01:00:00+01 |         1 |   8.0 |         8.0
 2019-01-16 01:00:00+01 |         1 |   9.0 |         9.0
```


[hyperfunctions-gapfilling]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/gapfilling-interpolation/
