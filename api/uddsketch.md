---
api_name: uddsketch()
excerpt: Aggregate data in a `uddsketch` for further calculation of percentile estimates
topics: [hyperfunctions]
keywords: [percentiles, hyperfunctions, toolkit]
tags: [uddsketch]
api:
  license: community
  type: function
  toolkit: true
hyperfunction:
  family: percentile approximation
  type: aggregate
# fields below will be deprecated
api_category: hyperfunction
toolkit: true
hyperfunction_family: 'percentile approximation'
hyperfunction_subfamily: 'advanced aggregation'
hyperfunction_type: aggregate
---

# uddsketch() <tag type="toolkit">Toolkit</tag>

```SQL ,ignore
uddsketch(
    size INTEGER,
    max_error DOUBLE PRECISION,
    value DOUBLE PRECISION
) RETURNS UddSketch
```

This constructs and returns a new `UddSketch` with at most `size` buckets.
The maximum relative error of the `UddSketch` is bounded by `max_error` unless
it is impossible to do so while with the bucket bound.

If the sketch has to combine buckets, the new error can be found with the
[uddsketch_error][error] command. Because the error is increased automatically
(roughly doubling at each step) as the number of buckets is exceeded, start
smaller unless you have a good understanding of exactly what your error should
be.

Timescale's `UddSketch` implementation is provided as an aggregate function in
PostgreSQL. The output is currently only suitable as input to the percentile
approximation functions; it can be used directly as part of a one-off SQL query
or as data stored in a continuous aggregate that is queried later with
percentile approximation functions.

*   For more information about percentile approximation functions, see the
    [hyperfunctions documentation][hyperfunctions-percentile-approx].
*   For some more technical details and usage examples of this algorithm,
    see the [developer documentation][gh-uddsketch].

## Required arguments

|Name| Type |Description|
|-|-|-|
|`size`|`INTEGER`|Maximum number of buckets in the sketch. Providing a larger value here makes it more likely that the aggregate is able to maintain the desired error, but  potentially increases the memory usage.|
|`max_error`|`DOUBLE PRECISION`|This is the starting maximum relative error of the sketch, as a multiple of the actual value. The true error may exceed this if too few buckets are provided for the data distribution.|
|`value`|`DOUBLE PRECISION`|Column to aggregate|

## Returns

|Column|Type|Description|
|-|-|-|
|`uddsketch`|`UddSketch`|A UddSketch object which can be passed to other UddSketch APIs|

## Sample usage

This example uses a table called `samples` with a column called `data` that
holds `DOUBLE PRECISION` values. This query returns a Uddsketch over that
column:

```SQL
SELECT uddsketch(100, 0.01, data) FROM samples;
```

This example builds a view from the aggregate that you can pass to other
Uddsketch functions:

```SQL
CREATE VIEW sketch AS
    SELECT uddsketch(100, 0.01, data)
    FROM samples;
```

[hyperfunctions-percentile-approx]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/percentile-approx/
[gh-uddsketch]: https://github.com/timescale/timescaledb-toolkit/blob/main/docs/uddsketch.md
[error]: /api/:currentVersion:/hyperfunctions/percentile-approximation/error/
