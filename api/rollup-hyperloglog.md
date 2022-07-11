---
api_name: rollup()
excerpt: Roll up multiple hyperloglogs
license: community
toolkit: true
topic: hyperfunctions
keywords: [rollup, hyperloglog, hyperfunctions, toolkit]
tags: [approximate, count, distinct]
api_category: hyperfunction
api_experimental: false
hyperfunction_toolkit: true
hyperfunction_family: 'approximate count distinct'
hyperfunction_subfamily: hyperloglog
hyperfunction_type: rollup
---

# rollup()  <tag type="toolkit">Toolkit</tag>

```SQL
rollup(
    log hyperloglog
) RETURNS Hyperloglog
```

Returns a hyperloglog by aggregating over the union of the input elements. Since hyperloglog is designed to merge well, `rollup`
does not compound errors. Union of hyperloglogs of different bucket size is currently not supported.

For more information about approximate count distinct functions, see the
[hyperfunctions documentation][hyperfunctions-approx-count-distincts].

## Required arguments

|Name| Type |Description|
|-|-|-|
|`log`|`Hyperloglog`|Column of Hyperloglogs to be united.|

## Returns

|Column|Type|Description|
|-|-|-|
|`hyperloglog`|`Hyperloglog`|A hyperloglog containing the count of the union of the input hyperloglogs.|


## Sample usage

```SQL
SELECT distinct_count(rollup(logs))
FROM (
    (SELECT hyperloglog(32768, v::text) logs FROM generate_series(1, 100000) v)
    UNION ALL
    (SELECT hyperloglog(32768, v::text) FROM generate_series(50000, 150000) v)
) hll;

 distinct_count 
----------------
         150147
```


[hyperfunctions-approx-count-distincts]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/approx-count-distincts/
