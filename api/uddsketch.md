## uddsketch() <tag type="toolkit">Toolkit</tag>
Timescale's UddSketch implementation is provided as an aggregate function in 
PostgreSQL. The output is currently only suitable as input to the 
the percentile approximation functions. This can be directly as part of a one-off 
SQL query, or as transient data stored in a Continuous Aggregate that is queried 
later with these functions and using the UddSketch data as input.

## Implementation details

[UddSketch](https://arxiv.org/pdf/2004.08604.pdf) is a specialization of the 
[DDSketch](https://arxiv.org/pdf/1908.10693.pdf) data structure.  It follows the 
same approach of breaking the data range into a series of logarithmically sized 
buckets such that it can guarantee a maximum relative error for any percentile 
estimate as long as it knows which bucket that percentile falls in.

Where UddSketch differs from DDSketch is in its behavior when the number of buckets 
required by a set of values exceeds some predefined maximum.  In these circumstances 
DDSketch will maintain it's original error bound, but only for a subset of the 
range of percentiles.  UddSketch, on the other hand, will combine buckets in such 
a way that it loosens the error bound, but can still estimate all percentile values.

As an example, assume both sketches were trying to capture an large set of values 
to be able to estimate percentiles with 1% relative error but were given too few 
buckets to do so.  The DDSketch implementation would still guarantee 1% relative 
error, but may only be able to provides estimates in the range (0.05, 0.95).  The 
UddSketch implementation however, might end up only able to guarantee 2% relative 
error, but would still be able to estimate all percentiles at that error.

Timescale's UddSketch implementation is provided as an aggregate function in 
PostgreSQL. It does not support moving-aggregate mode, and is not a ordered-set 
aggregate. It currently only works with `DOUBLE PRECISION` types, but we're 
intending to relax this constraint as needed.  UddSketches are partializable and 
are good candidates for [continuous aggregation](https://docs.timescale.com/latest/using-timescaledb/continuous-aggregates).

It's also worth noting that attempting to set the relative error too small or 
large can result in breaking behavior.  For this reason, the error is required 
to fall into the range [1.0e-12, 1.0).

## uddsketch() usage

```SQL ,ignore
uddsketch(
    size INTEGER,
    max_error DOUBLE PRECISION,
    value DOUBLE PRECISION
) RETURNS UddSketch
```

This will construct and return a new UddSketch with at most `size` buckets. 
The maximum relative error of the UddSketch will be bounded by `max_error` unless 
it is impossible to do so while with the bucket bound.  If the sketch has had to 
combine buckets, the new error can be found with the [uddsketch_error](#error) 
command.

Note that since the error will be increased automatically (roughly doubling at 
each step) as the number of buckets is exceeded, it is probably worth erring on 
the side of too small unless you have a good understanding of exactly what your 
error should be.

### Required arguments
|Name| Type |Description|
|---|---|---|
| `size` | `INTEGER` | Maximum number of buckets in the sketch.  Providing a larger value here will make it more likely that the aggregate will able to maintain the desired error, though will potentially increase the memory usage. |
| `max_error` | `DOUBLE PRECISION` | This is the starting maximum relative error of the sketch, as a multiple of the actual value.  The true error may exceed this if too few buckets are provided for the data distribution. |
| `value` | `DOUBLE PRECISION` |  Column to aggregate.


### Returns

|Column|Type|Description|
|---|---|---|
| `uddsketch` | `UddSketch` | A UddSketch object which may be passed to other UddSketch APIs. |


### Sample usage
For this example assume we have a table 'samples' with a column 'data' holding
`DOUBLE PRECISION` values.  The following will simply return a sketch over that column

```SQL
SELECT uddsketch(100, 0.01, data) FROM samples;
```

It may be more useful to build a view from the aggregate that we can later pass 
to other uddsketch functions.

```SQL
CREATE VIEW sketch AS
    SELECT uddsketch(100, 0.01, data)
    FROM samples;
```
