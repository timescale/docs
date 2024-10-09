---
api_name: first()
excerpt: Get the first value in one column when rows are ordered by another column
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

# first()

The `first` aggregate allows you to get the value of one column
as ordered by another. For example, `first(temperature, time)` returns the
earliest temperature value based on time within an aggregate group.

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
|`value`|TEXT|The value to return|
|`time`|TIMESTAMP or INTEGER|The timestamp to use for comparison|

### Sample usage

Get the earliest temperature by device_id:

```sql
SELECT device_id, first(temp, time)
FROM metrics
GROUP BY device_id;
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
