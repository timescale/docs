## uddsketch() <tag type="toolkit">Toolkit</tag>
Timescale's UddSketch implementation is provided as an aggregate function in
PostgreSQL. The output is currently only suitable as input to the
the percentile approximation functions. This can be directly as part of a one-off
SQL query, or as transient data stored in a Continuous Aggregate that is queried
later with these functions and using the UddSketch data as input.

*   For more information about percentile approximation functions, see the
    [hyperfunctions documentation][hyperfunctions-percentile-approx].
*   For some more technical details and usage examples of this algorithm,
    see the [developer documentation][gh-uddsketch].


## uddsketch() usage

```SQL ,ignore
uddsketch(
    size INTEGER,
    max_error DOUBLE PRECISION,
    value DOUBLE PRECISION
) RETURNS UddSketch
```

This will construct and return a new UddSketch with at most `size` buckets.
The maximum relative error of the UddSketch is bounded by `max_error` unless
it is impossible to do so while with the bucket bound.  If the sketch has had to
combine buckets, the new error can be found with the [uddsketch_error](#error)
command.

Note that since the error is increased automatically (roughly doubling at each
step) as the number of buckets is exceeded, start smaller unless you have a good
understanding of exactly what your error should be.

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

[hyperfunctions-percentile-approx]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/percentile-approx/
[gh-uddsketch]: https://github.com/timescale/timescaledb-toolkit/blob/main/docs/`tdigest`.md
