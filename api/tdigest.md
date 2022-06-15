---
api_name: tdigest()
excerpt: Aggregate data in a `tdigest` for further calculation of percentile estimates
license: community
toolkit: true
api_category: hyperfunction
api_experimental: false
hyperfunction_toolkit: true
hyperfunction_family: 'percentile approximation'
hyperfunction_subfamily: 'advanced aggregation'
hyperfunction_type: aggregate
---

# tdigest() <tag type="toolkit">Toolkit</tag>
```SQL
tdigest(
    buckets INTEGER,
    value DOUBLE PRECISION
) RETURNS TDigest
```

This constructs and returns a `tdigest` with the specified number of buckets
over the given values.

TimescaleDB provides an implementation of the `tdigest` data structure for
quantile approximations. A `tdigest` is a space efficient aggregation which
provides increased resolution at the edges of the distribution. This allows for
more accurate estimates of extreme quantiles than traditional methods.

Timescale's `tdigest` is implemented as an aggregate function in PostgreSQL. It
does not support moving-aggregate mode and is not an ordered-set aggregate. It
is parallelizable and is a good candidate for continuous
aggregation. Aggregating with `tdigest` is currently restricted to float values.

The `tdigest` function is somewhat dependent on the order of inputs. The
percentile approximations should be nearly equal for the same underlying data,
especially at the extremes of the quantile range where the  `tdigest` is
inherently more accurate. They are unlikely to be identical if built in a
different order. While this should have little effect on the accuracy of the
estimates, it is worth noting that repeating the creation of the `tdigest` might
have subtle differences if the call is being parallelized by PostgreSQL.

*   For more information about percentile approximation functions, see the
    [hyperfunctions documentation][hyperfunctions-percentile-approx].
*   For some more technical details and usage examples of this algorithm,
    see the [developer documentation][gh-tdigest].


### Required arguments

|Name| Type |Description|
|-|-|-|
|`buckets`|`INTEGER`|Number of buckets in the digest. Increasing this provides more accurate quantile estimates, but requires more memory.|
|`value`|`DOUBLE PRECISION`|Column to aggregate|

### Returns

|Column|Type|Description|
|-|-|-|
|||A  `tdigest` object which can be passed to other  `tdigest` APIs|

### Sample usage
This example uses a table called `samples`, with a column called `weights`, that
holds `DOUBLE PRECISION` values. This query returns a digest over that column:
```SQL
SELECT tdigest(100, data) FROM samples;
```

This example builds a view from the aggregate that can be passed to other
tdigest functions:
```SQL
CREATE VIEW digest AS
    SELECT tdigest(100, data)
    FROM samples;
```


[hyperfunctions-percentile-approx]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/percentile-approx/
[gh-tdigest]: https://github.com/timescale/timescaledb-toolkit/blob/main/docs/tdigest.md
