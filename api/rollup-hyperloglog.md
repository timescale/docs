## rollup()

```SQL
rollup(
    log hyperloglog
) RETURNS Hyperloglog
```

Returns a hyperloglog by aggregating over the union of the input elements.

For more information about hyperloglog(), see the
[Toolkit documentation][toolkit-hyperloglog].

### Required arguments

|Name| Type |Description|
|---|---|---|
|`log`|`Hyperloglog`|Column of Hyperloglogs to be united.|

### Returns

|Column|Type|Description|
|---|---|---|
|`hyperloglog`|`Hyperloglog`|A hyperloglog containing the count of the union of the input hyperloglogs.|


### Sample usage

```SQL
SELECT toolkit_experimental.distinct_count(toolkit_experimental.rollup(logs))
FROM (
    (SELECT toolkit_experimental.hyperloglog(32, v::text) logs FROM generate_series(1, 100) v)
    UNION ALL
    (SELECT toolkit_experimental.hyperloglog(32, v::text) FROM generate_series(50, 150) v)
) hll;
 count
-------
   152
```
