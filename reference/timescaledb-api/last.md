---
api_name: last()
excerpt: Get the last value in one column when rows are ordered by another column
topics: [hyperfunctions]
keywords: [hyperfunctions]
api:
  license: apache
  type: function
  version:
    stable: 0.0.11-beta
hyperfunction:
  type: one-step aggregate
---

# last()

The `last` aggregate allows you to get the value of one column
as ordered by another. For example, `last(temperature, time)` returns the
latest temperature value based on time within an aggregate group.

<Highlight type="important">
The `last` and `first` commands do not use indexes, they perform a sequential
scan through the group. They are primarily used for ordered selection within a
`GROUP BY` aggregate, and not as an alternative to an
`ORDER BY time DESC LIMIT 1` clause to find the latest value, which uses
indexes.
</Highlight>

### Required arguments

|Name|Type|Description|
|---|---|---|
|`value`|ANY ELEMENT|The value to return|
|`time`|TIMESTAMP or INTEGER|The timestamp to use for comparison|

### Sample usage

Get the temperature every 5 minutes for each device over the past day:

```sql
SELECT device_id, time_bucket('5 minutes', time) AS interval,
  last(temp, time)
FROM metrics
WHERE time > now () - INTERVAL '1 day'
GROUP BY device_id, interval
ORDER BY interval DESC;
```

This example uses first and last with an aggregate filter, and avoids null
values in the output:

```sql
SELECT
   TIME_BUCKET('5 MIN', time_column) AS interv,
   AVG(temperature) as avg_temp,
   first(temperature,time_column) FILTER(WHERE time_column IS NOT NULL) AS beg_temp,
   last(temperature,time_column) FILTER(WHERE time_column IS NOT NULL) AS end_temp
FROM sensors
GROUP BY interv
```
