---
api_name: first()
excerpt: Get the first value in one column when rows are ordered by another column
license: apache
topic: hyperfunctions
tags: [hyperfunctions, first]
---

## first()

The `first` aggregate allows you to get the value of one column
as ordered by another. For example, `first(temperature, time)` returns the
earliest temperature value based on time within an aggregate group.

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

<highlight type="warning">
 The `last` and `first` commands do **not** use indexes, and instead
 perform a sequential scan through their groups. They are primarily used
 for ordered selection within a `GROUP BY` aggregate, and not as an
 alternative to an `ORDER BY time DESC LIMIT 1` clause to find the
 latest value (which uses indexes).
</highlight>
