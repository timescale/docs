---
api_name: rollup
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

Returns a hyperloglog by aggregating over the union of the input elements.

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
    (SELECT hyperloglog(32, v::text) logs FROM generate_series(1, 100) v)
    UNION ALL
    (SELECT hyperloglog(32, v::text) FROM generate_series(50, 150) v)
) hll;
 count
-------
   152
```


[hyperfunctions-approx-count-distincts]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/approx-count-distincts/
