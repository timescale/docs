---
section: hyperfunction
subsection: time_weight()
---

### Aggregate data into a `TimeWeightSummary` and calculate the average

Given a table `foo` with data in a column `val`, aggregate data into a daily
`TimeWeightSummary`. Use that to calculate the average for column `val`:

```sql
WITH t as (
    SELECT
        time_bucket('1 day'::interval, ts) as dt,
        time_weight('Linear', ts, val) AS tw
    FROM foo
    WHERE measure_id = 10
    GROUP BY time_bucket('1 day'::interval, ts)
)
SELECT
    dt,
    average(tw)
FROM t;
```

## Advanced usage

### Parallelism and ordering

Time-weighted average calculations are not strictly parallelizable, as defined
by PostgreSQL. These calculations require inputs to be strictly ordered, but
in general, PostgreSQL parallelizes by assigning rows randomly to workers.

However, the algorithm can be parallelized if it is guaranteed that all rows
within some time range go to the same worker. This is the case for both
continuous aggregates and distributed hypertables. (Note that the partitioning
keys of the distributed hypertable must be within the `GROUP BY` clause, but
this is usually the case.)

### Combining aggregates across measurement series

If you try to combine overlapping `TimeWeightSummaries`, an error is thrown.
For example, you might create a `TimeWeightSummary` for `device_1` and a
separate `TimeWeightSummary` for `device_2`, both covering the same period of
time. You can't combine these because the interpolation techniques only make
sense when restricted to a single measurement series.

If you want to calculate a single summary statistic across all devices, use a
simple average, like this:

```sql
WITH t as (SELECT measure_id,
        average(
            time_weight('LOCF', ts, val)
        ) as time_weighted_average
    FROM foo
    GROUP BY measure_id)
SELECT avg(time_weighted_average) -- use the normal avg function to average the time-weighted averages
FROM t;
```

### Parallelism in multi-node

The time-weighted average functions are not strictly parallelizable in the
PostgreSQL sense. PostgreSQL requires that parallelizable functions accept
potentially overlapping input. As explained above, the time-weighted functions
do not. However, they do support partial aggregation and partition-wise
aggregation in multi-node setups.

### Reducing memory usage

Because the time-weighted aggregates require ordered sets, they build up a
buffer of input data, sort it, and then perform the aggregation steps. When
memory is too small to build up a buffer of points, you might see Out of Memory
failures or other issues. In these cases, try using a multi-level aggregate. For
example:

```sql
WITH t as (SELECT measure_id,
    time_bucket('1 day'::interval, ts),
    time_weight('LOCF', ts, val)
    FROM foo
    GROUP BY measure_id, time_bucket('1 day'::interval, ts)
    )
SELECT measure_id,
    average(
        rollup(time_weight)
    )
FROM t
GROUP BY measure_id;
```
