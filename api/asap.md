---
api_name: asap_smooth()
excerpt: Downsample a time series using the ASAP smoothing algorithm
topics: [hyperfunctions]
keywords: [downsample, smooth, hyperfunctions]
tags: [toolkit]
api:
  license: community
  type: function
  experimental: true
  toolkit: true
hyperfunction:
  family: downsample
  type: one-step aggregate
# fields below will be deprecated
api_category: hyperfunction
api_experimental: true
toolkit: true
hyperfunction_family: 'downsample'
hyperfunction_subfamily: 'downsample'
hyperfunction_type: other
---

# asap_smooth()  <tag type="toolkit">Toolkit</tag><tag type="experimental-toolkit">Experimental</tag>

The [ASAP smoothing algorithm][asap-algorithm] is designed to create
human-readable graphs that preserve the rough shape and larger trends
of the input data, while minimizing the local variance between points.
The `asap_smooth` hyperfunction provides an implementation of this
algorithm that takes `(timestamptz, double precision)` data and returns
an ASAP smoothed [`timevector`][hyperfunctions-timevectors] line.

## Required arguments

|Name| Type |Description|
|-|-|-|
|`ts`|`TIMESTAMPTZ`|Column of timestamps corresponding to the values to aggregate|
|`value`|`DOUBLE PRECISION`|Column to aggregate|
|`resolution`|`INT`|Approximate number of points to return. Intended to represent the horizontal resolution in which the aggregate is graphed.|

## Returns

|Column|Type|Description|
|-|-|-|
|`timevector`|`Timevector`|An object representing a series of values occurring at set intervals from a starting time. It can be unpacked with `unnest`.|

## Sample usage

This example uses a table called `metrics`, with columns for `date` and
`reading` that contain measurements that have been accumulated over
a large interval of time. This example takes that data and provides a
smoothed representation of approximately 10 points, but that still shows
any anomalous readings:

```sql
SET TIME ZONE 'UTC';
CREATE TABLE metrics(date TIMESTAMPTZ, reading DOUBLE PRECISION);
INSERT INTO metrics
SELECT
    '2020-1-1 UTC'::timestamptz + make_interval(hours=>foo),
    (5 + 5 * sin(foo / 12.0 * PI()))
    FROM generate_series(1,168) foo;

```

```sql
SELECT * FROM unnest(
    (SELECT toolkit_experimental.asap_smooth(date, reading, 8)
     FROM metrics));
```

The output for this query:

```sql
          time          |        value
------------------------+---------------------
 2020-01-01 01:00:00+00 | 5.3664814565722665
 2020-01-01 21:00:00+00 |  5.949469264090644
 2020-01-02 17:00:00+00 |  5.582987807518377
 2020-01-03 13:00:00+00 |  4.633518543427733
 2020-01-04 09:00:00+00 |  4.050530735909357
 2020-01-05 05:00:00+00 |  4.417012192481623
 2020-01-06 01:00:00+00 |  5.366481456572268
 2020-01-06 21:00:00+00 |  5.949469264090643
```

[asap-algorithm]: https://arxiv.org/pdf/1703.00983.pdf
[hyperfunctions-timevectors]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/function-pipelines/#timevectors
