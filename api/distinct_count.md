---
api_name: distinct_count()
excerpt: Estimate the number of distinct values from values in a hyperloglog
license: community
toolkit: true
topic: hyperfunctions
keywords: [count, hyperfunctions, toolkit]
tags: [approximate, distinct, hyperloglog]
api_category: hyperfunction
api_experimental: false
hyperfunction_toolkit: true
hyperfunction_family: 'approximate count distinct'
hyperfunction_subfamily: hyperloglog
hyperfunction_type: accessor
---

# distinct_count()  <tag type="toolkit">Toolkit</tag>
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
SELECT distinct_count(hyperloglog(32768, data))
FROM generate_series(1, 100000) data

 distinct_count
----------------
         100151
```


[hyperfunctions-approx-count-distincts]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/approx-count-distincts/
