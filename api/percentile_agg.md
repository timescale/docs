---
api_name: percentile_agg()
excerpt: Aggregate data into a percentile aggregate for further analysis
license: community
toolkit: true
topic: hyperfunctions
keywords: [percentiles, aggregate, hyperfunctions, toolkit]
api_category: hyperfunction
api_experimental: false
hyperfunction_toolkit: true
hyperfunction_family: 'percentile approximation'
hyperfunction_subfamily: 'percentile approximation'
hyperfunction_type: aggregate
---

# percentile_agg()  <tag type="toolkit">Toolkit</tag>

```sql
percentile_agg(
    value DOUBLE PRECISION
) RETURNS UddSketch
```

This creates a `Uddsketch` percentile estimator. It is usually used with the
[approx_percentile][approx_percentile] accessor function to extract an
approximate percentile, however it is in a form that can be re-aggregated using
the [rollup][rollup] function or any of the percentile approximation accessor
functions.

This is the default percentile aggregation function. It uses the `UddSketch`
algorithm with 200 buckets and an initial maximum error of 0.001. This is
appropriate for most common use cases of percentile approximation.

*   For more information about percentile approximation algorithms, see
    [advanced aggregation methods][advanced-agg].
*   For more information about percentile approximation functions, see the
    [hyperfunctions documentation][hyperfunctions-percentile-approx].

## Required arguments

|Name|Type|Description|
|-|-|-|
|`value`|`DOUBLE PRECISION`|Column to aggregate|

## Returns

|Column|Type|Description|
|-|-|-|
|`percentile_agg`|`UddSketch`|A UddSketch percentile estimator object which may be passed to other percentile approximation APIs|

The `percentile_agg` function uses the UddSketch algorithm, so it returns the
`UddSketch` data structure for use in further calls.

## Sample usage
Get the approximate first percentile using the `percentile_agg()` plus the
[`approx_percentile`][approx_percentile] accessor function:
```SQL
SELECT
    approx_percentile(0.01, percentile_agg(data))
FROM generate_series(0, 100) data;
```
```output
approx_percentile
-------------------
             0.999
```

The `percentile_agg` function can be used to create continuous aggregates,
after which you can use multiple accessors for retrospective analysis:

```SQL
CREATE MATERIALIZED VIEW foo_hourly
WITH (timescaledb.continuous)
AS SELECT
    time_bucket('1 h'::interval, ts) as bucket,
    percentile_agg(value) as pct_agg
FROM foo
GROUP BY 1;
```


[approx_percentile]: /api/:currentVersion:/hyperfunctions/percentile-approximation/approx_percentile/
[rollup]: /api/:currentVersion:/hyperfunctions/percentile-approximation/rollup-percentile/
[hyperfunctions-percentile-approx]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/percentile-approx/
[advanced-agg]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/percentile-approx/advanced-agg/
