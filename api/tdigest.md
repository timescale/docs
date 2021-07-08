## tdigest()
TimescaleDB Toolkit provides an implementation of the t-digest data structure 
for quantile approximations. A t-digest is a space efficient aggregation which 
provides increased resolution at the edges of the distribution. This allows for 
more accurate estimates of extreme quantiles than traditional methods.

Timescale's t-digest is implemented as an aggregate function in PostgreSQL. They 
do not support moving-aggregate mode, and are not ordered-set aggregates. Presently 
they are restricted to float values, but the goal is to make them polymorphic. 
They are partializable and are good candidates for continuous aggregation.

One additional thing to note about TDigests is that they are somewhat dependant 
on the order of inputs. The percentile approximations should be nearly equal for 
the same underlying data, especially at the extremes of the quantile range where 
the TDigest is inherently more accurate, they are unlikely to be identical if 
built in a different order. While this should have little effect on the accuracy 
of the estimates, it is worth noting that repeating the creation of the TDigest 
might have subtle differences if the call is being parallelized by Postgres.

## tdigest() usage

```SQL
tdigest(
    buckets INTEGER,
    value DOUBLE PRECISION
) RETURNS TDigest
```

This will construct and return a TDigest with the specified number of buckets over the given values.

### Required Arguments 
|Name| Type |Description|
|---|---|---|
| `buckets` | `INTEGER` | Number of buckets in the digest.  Increasing this will provide more accurate quantile estimates, but will require more memory.|
| `value` | `DOUBLE PRECISION` |  Column to aggregate.

### Returns

|Column|Type|Description|
|---|---|---|
| `tdigest` | `TDigest` | A t-digest object which may be passed to other t-digest APIs. |

### Sample Usages
For this example, assume we have a table 'samples' with a column 'weights' holding `DOUBLE PRECISION` values.  The following will simply return a digest over that column

```SQL
SELECT tdigest(100, data) FROM samples;
```

It may be more useful to build a view from the aggregate that can later be passed to other tdigest functions.

```SQL
CREATE VIEW digest AS
    SELECT tdigest(100, data)
    FROM samples;
```