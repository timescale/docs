---
api_name: last()
excerpt: Get the last value in one column when rows are ordered by another column
license: apache
topic: hyperfunctions
tags: [hyperfunctions, last]
---

## last()

The `last` aggregate allows you to get the value of one column
as ordered by another. For example, `last(temperature, time)` returns the
latest temperature value based on time within an aggregate group.

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

<highlight type="warning">
 The `last` and `first` commands do **not** use indexes, and instead
 perform a sequential scan through their groups.  They are primarily used
 for ordered selection within a `GROUP BY` aggregate, and not as an
 alternative to an `ORDER BY time DESC LIMIT 1` clause to find the
 latest value (which uses indexes).
</highlight>
