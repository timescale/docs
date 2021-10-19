# distinct_count()  <tag type="toolkit">Toolkit</tag><tag type="experimental">Experimental</tag>
The `distinct_count` function gets the number of distinct values from a
hyperloglog.

For more information about approximate count distinct functions, see the
[hyperfunctions documentation][hyperfunctions-approx-count-distincts].

## Required arguments

|Name|Type|Description|
|-|-|-|
|hyperloglog|Hyperloglog|The hyperloglog to extract the count from.|

## Returns

|Column|Type|Description|
|-|-|-|
|distinct_count|BIGINT|The number of distinct elements counted by the hyperloglog.|

## Sample usage
This example retrieves the distinct values from a hyperloglog
called `hyperloglog`:

``` sql
SELECT distinct_count(hyperloglog(64, data))
FROM generate_series(1, 100) data

 distinct_count
----------------
            114
```


[hyperfunctions-approx-count-distincts]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/approx-count-distincts/
