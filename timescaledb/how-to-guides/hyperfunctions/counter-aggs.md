# Counter aggregates
When you process counter data, it is usually assumed that if the value of the
counter goes down, the counter has been reset. For example, if you wanted to
count how many times a runner ran around a track, you would expect the values to
continuously increase: 1, 2, 3, 4, and so on. If the counter reset to 0, you
would expect that this was a new runner starting on their first lap, not the
original runner going back to 1. This can become a problem if you want to
continue counting from where you left off, rather than resetting to 0. A reset
could occur if you have had a short server outage, or any number of other
reasons. To get around this, you can analyze counter data by looking at the
change over time, which accounts for resets.

Accounting for resets can be difficult to do in SQL, so Timescale has developed
aggregate and accessor functions that handle calculations for counters in a more
practical way.

<highlight type="note">
Counter aggregates can be used in continuous aggregates, even though they are
not parallelizable in PostgreSQL. For more information, see the section on
[parallelism and ordering][#parallelism-and-ordering].
</highlight>

## Run a counter aggregate query
In this procedure, we are using an example table called `example` that contains
counter data.

### Procedure: Running a counter aggregate query
1.  Create a table called `example`:
```sql
CREATE TABLE example (
    measure_id      BIGINT,
    ts              TIMESTAMPTZ ,
    val             DOUBLE PRECISION,
    PRIMARY KEY (measure_id, ts)
);
```
1.  Create a counter aggregate as well as the delta accessor function which gives you the change in the counter's value over the time period in question, accounting for any resets.

SELECT measure_id,
    toolkit_experimental.delta(
        toolkit_experimental.counter_agg(ts, val)
    )
FROM example
GROUP BY measure_id;
We can also use the time_bucket function to produce a series of deltas over 15 minute increments.

SELECT measure_id,
    time_bucket('15 min'::interval, ts) as bucket,
    toolkit_experimental.delta(
        toolkit_experimental.counter_agg(ts, val)
    )
FROM example
GROUP BY measure_id, time_bucket('15 min'::interval, ts);
This will allow us to search for 15 minute periods where the counter increased by a larger or smaller amount.

If series are less regular and so the deltas are affected by the number of samples in the 15 minute period, you can use the extrapolated_delta function. For this we'll need to provide bounds so we know where to extrapolate to, for this we'll use the time_bucket_range function, which works just like time_bucket but produces the open ended range [start, end) of all the times in the bucket. We'll also use a CTE to do the counter_agg just so it's a little easier to understand what's going on in each part:

with t as (
    SELECT measure_id,
        time_bucket('15 min'::interval, ts) as bucket,
        toolkit_experimental.counter_agg(ts, val, bounds => toolkit_experimental.time_bucket_range('15 min'::interval, ts))
    FROM example
    GROUP BY measure_id, time_bucket('15 min'::interval, ts))
SELECT time_bucket,
    toolkit_experimental.extrapolated_delta(counter_agg, method => 'prometheus')
FROM t ;
Note that we're also using the 'prometheus' method for doing our extrapolation. Our current extrapolation function is built to mimic the Prometheus project's increase function, which measures the change of a counter extrapolated to the edges of the queried region.

Of course this might be more useful if we make a continuous aggregate out of it. We'll first have to make it a hypertable partitioned on the ts column:

SELECT create_hypertable('example', 'ts', chunk_time_interval=> '15 days'::interval, migrate_data => true);
Now we can make our continuous aggregate:

CREATE MATERIALIZED VIEW example_15
WITH (timescaledb.continuous)
AS SELECT measure_id,
    time_bucket('15 min'::interval, ts) as bucket,
    toolkit_experimental.counter_agg(ts, val, bounds => time_bucket_range('15 min'::interval, ts))
FROM example
GROUP BY measure_id, time_bucket('15 min'::interval, ts);
Note that here, we just use the counter_agg function. It's often better to do that and simply run the accessor functions on the result, it's much more flexible that way, as there are many accessor functions, and the data is there so you can run multiple of them over the same aggregate.

SELECT
    measure_id,
    bucket,
    toolkit_experimental.delta(counter_agg),
    toolkit_experimental.rate(counter_agg),
    toolkit_experimental.extrapolated_rate(counter_agg, method => 'prometheus'),
    toolkit_experimental.slope(counter_agg)
FROM example_15
Here we've used multiple other accessor functions, the rate function is a simple Δval / Δtime (both observed) calculation, whereas the extrapolated_rate with the 'prometheus' method follows the Prometheus rate function's behavior of extrapolating to the edges of the boundary and using the bounds provided rather than the observed values. The slope function calculates the slope of the least-squares fit line of the values over time. The counter resets are accounted for and "true" values are fed into the linear regression algorithm before this slope is computed.

We can also re-aggregate from the continuous aggregate into a larger bucket size quite simply:

SELECT
    measure_id,
    time_bucket('1 day'::interval, bucket),
    toolkit_experimental.delta(
        toolkit_experimental.rollup(counter_agg)
    )
FROM example_15
GROUP BY measure_id, time_bucket('1 day'::interval, bucket);
There are several other accessor functions which we haven't described in the examples here, but are listed in the API section under the accessors.


## Parallelism and ordering
The counter reset calculations we perform require a strict ordering of inputs and therefore the calculations are not parallelizable in the strict Postgres sense. This is because when Postgres does parallelism it hands out rows randomly, basically as it sees them to workers. However, if your parallelism can guarantee disjoint (in time) sets of rows, the algorithm can be parallelized, just so long as within some time range, all rows go to the same worker. This is the case for both continuous aggregates and for distributed hypertables (as long as the partitioning keys are in the group by, though the aggregate itself doesn't horribly make sense otherwise).

We throw an error if there is an attempt to combine overlapping CounterSummaries, for instance, in our example above, if you were to try to combine summaries across measure_id's it would error (assuming that they had overlapping times). This is because the counter values resetting really only makes sense within a given time series determined by a single measure_id. However, once an accessor function is applied, such as delta, a sum of deltas may be computed. Similarly, an average or histogram of rates across multiple time series might be a useful calculation to perform. The thing to note is that the counter aggregate and the reset logic should be performed first, then further calculations may be performed on top of that.

As an example, let's consider that we might want to find which of my counters had the most extreme rates of change in each 15 minute period. For this, we'll want to normalize the rate of change of each measure by dividing it by the average rate of change over all the counters in that 15 minute period. We'll use the normal avg function to do this, but we'll use it as a window function like so:

WITH t as (SELECT measure_id,
        time_bucket('15 min'::interval, ts) AS bucket,
        toolkit_experimental.rate(
            toolkit_experimental.counter_agg(ts, val)
        ) as rate
    FROM example
    GROUP BY measure_id),
SELECT measure_id,
    bucket,
    rate,
    rate / avg(rate_per_measure) OVER (PARTITION BY bucket) AS normalized_rate -- call normal avg function as a window function to get a 15 min avg to normalize our per-measure rates
FROM t;
Still, note that the counter resets are accounted for before applying the avg function in order to get our normalized rate.

Internally, the CounterSummary stores:

the first, second, penultimate, and last points seen
the sum of all the values at reset points, as well as the number of changes, and number of resets seen.
A set of 6 values used to compute all the statistical regression parameters using the Youngs-Cramer algorithm.
Optionally, the bounds as an open-ended range, over which extrapolation should occur and which represents the outer possible limit of times represented in this CounterSummary
In general, the functions support partial aggregation and partitionwise aggregation in the multinode context, but are not parallelizable (in the Postgres sense, which requires them to accept potentially overlapping input).

Because they require ordered sets, the aggregates build up a buffer of input data, sort it and then perform the proper aggregation steps. In cases where memory is proving to be too small to build up a buffer of points causing OOMs or other issues, a multi-level aggregate can be useful.

So where I might run into OOM issues if I computed the values over all time like so:

SELECT measure_id,
    toolkit_experimental.rate(
        toolkit_experimental.counter_agg(ts, val)
    ) as rate
FROM example
GROUP BY measure_id;
If I were to instead, compute the counter_agg over, say daily buckets and then combine the aggregates, I might be able to avoid OOM issues, as each day will be computed separately first and then combined, like so:

WITH t as (SELECT measure_id,
        time_bucket('1 day'::interval, ts) AS bucket,
        toolkit_experimental.counter_agg(ts, val)
    FROM example
    GROUP BY measure_id),
SELECT measure_id, \
    toolkit_experimental.rate(
        toolkit_experimental.rollup(counter_agg) --combine the daily `CounterSummaries` to make a full one over all time, accounting for all the resets, then apply the rate function
    )
FROM t;
Moving aggregate mode is not supported by counter_agg and its use as a window function may be quite inefficient.

[gh-analytics-algorithms]: https://github.com/timescale/timescale-analytics/blob/main/docs/percentile_approximation.md#advanced-usage
[toolkit-parallelism]:
