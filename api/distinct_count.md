# distinct_count() <tag type="experimental">Experimental</tag>
The `distinct_count` function gets the number of distinct values from a
hyperloglog.

For more information about hyperloglog(), see the
[Toolkit documentation][toolkit-hyperloglog].

<!---
<highlight type="note"
Use a highlight for any important information. Choose `note`, `important`, or `warning`.
</highlight>
-->

## Required Arguments

|Name|Type|Description|
|-|-|-|
|hyperloglog|Hyperloglog|The hyperloglog to extract the count from.|

## Returns

|Column|Type|Description|
|-|-|-|
|distinct_count|BIGINT|The number of distinct elements counted by the hyperloglog.|

<!---Any special notes about the returns-->

## Sample Usage
This example retrieves the distinct values from a hyperloglog
called `hyperloglog`:

``` sql
SELECT toolkit_experimental.distinct_count(toolkit_experimental.hyperloglog(64, data))
FROM generate_series(1, 100) data

 distinct_count
----------------
            114
```


[toolkit-hyperloglog]: timescaledb/:currentVersion:/how-to-guides/toolkit/hyperloglog/
