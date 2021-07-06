## locf() <tag type="community">Community</tag> 

The `locf` function (last observation carried forward) allows you to carry the last seen value in an aggregation group forward.
It can only be used in an aggregation query with [time_bucket_gapfill](/hyperfunctions/time_bucket_gapfill/).
The `locf` function call cannot be nested inside other function calls.

### Required Arguments

|Name|Type|Description|
|---|---|---|
| `value` | ANY ELEMENT | The value to carry forward |

### Optional Arguments

|Name|Type|Description|
|---|---|---|
| `prev` | EXPRESSION | The lookup expression for values before gapfill start |
| `treat_null_as_missing` | BOOLEAN | Ignore NULL values in locf and only carry non-NULL values forward |

Because the locf function relies on having values before each bucketed period
to carry forward, it might not have enough data to fill in a value for the first
bucket if it does not contain a value.
For example, the function would need to look before this first
time bucket period, yet the query's outer time predicate WHERE time > ...
normally restricts the function to only evaluate values within this time range.
Thus, the `prev` expression tell the function how to look for
values outside of the range specified by the time predicate.
The `prev` expression will only be evaluated when no previous value is returned
by the outer query (i.e., the first bucket in the queried time range is empty).

### Sample Usage 

Get the average temperature every day for each device over the last 7 days carrying forward the last value for missing readings:
```sql
SELECT
  time_bucket_gapfill('1 day', time, now() - INTERVAL '1 week', now()) AS day,
  device_id,
  avg(temperature) AS value,
  locf(avg(temperature))
FROM metrics
WHERE time > now () - INTERVAL '1 week'
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
(7 row)
```

Get the average temperature every day for each device over the last 7 days carrying forward the last value for missing readings with out-of-bounds lookup
```sql
SELECT
  time_bucket_gapfill('1 day', time, now() - INTERVAL '1 week', now()) AS day,
  device_id,
  avg(temperature) AS value,
  locf(
    avg(temperature),
    (SELECT temperature FROM metrics m2 WHERE m2.time < now() - INTERVAL '2 week' AND m.device_id = m2.device_id ORDER BY time DESC LIMIT 1)
  )
FROM metrics m
WHERE time > now () - INTERVAL '1 week'
GROUP BY day, device_id
ORDER BY day;

           day          | device_id | value | locf
------------------------+-----------+-------+------
 2019-01-10 01:00:00+01 |         1 |       |  1.0
 2019-01-11 01:00:00+01 |         1 |   5.0 |  5.0
 2019-01-12 01:00:00+01 |         1 |       |  5.0
 2019-01-13 01:00:00+01 |         1 |   7.0 |  7.0
 2019-01-14 01:00:00+01 |         1 |       |  7.0
 2019-01-15 01:00:00+01 |         1 |   8.0 |  8.0
 2019-01-16 01:00:00+01 |         1 |   9.0 |  9.0
(7 row)
```