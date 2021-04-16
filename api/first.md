## first() 

The `first` aggregate allows you to get the value of one column
as ordered by another. For example, `first(temperature, time)` will return the
earliest temperature value based on time within an aggregate group.

### Required Arguments

|Name|Type|Description|
|---|---|---|
| `value` | The value to return (anyelement) |
| `time` | The timestamp to use for comparison (TIMESTAMP/TIMESTAMPTZ or integer type)  |

### Sample Usage 

Get the earliest temperature by device_id:
```sql
SELECT device_id, first(temp, time)
FROM metrics
GROUP BY device_id;
```

<highlight type="warning">
 The `last` and `first` commands do **not** use indexes, and instead
 perform a sequential scan through their groups.  They are primarily used
 for ordered selection within a `GROUP BY` aggregate, and not as an
 alternative to an `ORDER BY time DESC LIMIT 1` clause to find the
 latest value (which will use indexes).
</highlight>