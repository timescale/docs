---
api_name: slope()
excerpt: Calculate the slope from values in a 2-dimensional statistical aggregate
topics: [hyperfunctions]
keywords: [statistics, statistical aggregate, hyperfunctions, toolkit]
tags: [least squares, regression]
api:
  license: community
  type: function
  toolkit: true
hyperfunction:
  family: statistical aggregates
  type: accessor, 2D
  aggregates:
    - stats_agg()
# fields below will be deprecated
api_category: hyperfunction
toolkit: true
hyperfunction_family: 'statistical aggregates'
hyperfunction_subfamily: 'statistical aggregates'
hyperfunction_type: accessor-2d
---

# slope() <tag type="toolkit" content="Toolkit" />

```sql
slope(
    summary StatsSummary2D
) RETURNS DOUBLE PRECISION
```

The slope of the [least squares fit][least-squares] line computed from
a two-dimensional statistical aggregate.

For more information about statistical aggregate functions, see the
[hyperfunctions documentation][hyperfunctions-stats-agg].

## Required arguments

|Name|Type|Description|
|-|-|-|
|`summary`|`StatsSummary2D`|The input StatsSummary from a [`stats_agg` call][stats-agg]|

## Returns

|Name|Type|Description|
|-|-|-|
|`slope`|`DOUBLE PRECISION`|The slope of the least squares fit line.|

## Sample usage

```sql
SELECT
    id,
    time_bucket('15 min'::interval, ts) AS bucket,
    slope(stats_agg(y, x)) AS summary
FROM foo
GROUP BY id, time_bucket('15 min'::interval, ts)
```

[hyperfunctions-stats-agg]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/stats-aggs/
[stats-agg]: /api/:currentVersion:/hyperfunctions/stats_aggs/stats_agg/
[least-squares]:https://en.wikipedia.org/wiki/Least_squares
