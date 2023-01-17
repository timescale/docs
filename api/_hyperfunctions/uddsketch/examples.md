---
section: hyperfunction
subsection: uddsketch()
---

### Aggregate and roll up percentile data to calculate daily percentiles using `percentile_agg`

Create an hourly continuous aggregate that contains a percentile aggregate:

```sql
CREATE MATERIALIZED VIEW foo_hourly
WITH (timescaledb.continuous)
AS SELECT
    time_bucket('1 h'::interval, ts) as bucket,
    percentile_agg(value) as pct_agg
FROM foo
GROUP BY 1;
```

You can use accessors to query directly from the continuous aggregate for
hourly data. You can also roll the hourly data up into daily buckets, then
calculate approximate percentiles:

```sql
SELECT
    time_bucket('1 day'::interval, bucket) as bucket,
    approx_percentile(0.95, rollup(pct_agg)) as p95,
    approx_percentile(0.99, rollup(pct_agg)) as p99
FROM foo_hourly
GROUP BY 1;
```

### Aggregate and roll up percentile data to calculate daily percentiles using `uddsketch`

Create an hourly continuous aggregate that contains a percentile aggregate:

```sql
CREATE MATERIALIZED VIEW foo_hourly
WITH (timescaledb.continuous)
AS SELECT
    time_bucket('1 h'::interval, ts) as bucket,
    uddsketch(value) as uddsketch
FROM foo
GROUP BY 1;
```

You can use accessors to query directly from the continuous aggregate for
hourly data. You can also roll the hourly data up into daily buckets, then
calculate approximate percentiles:

```sql
SELECT
    time_bucket('1 day'::interval, bucket) as bucket,
    approx_percentile(0.95, rollup(uddsketch)) as p95,
    approx_percentile(0.99, rollup(uddsketch)) as p99
FROM foo_hourly
GROUP BY 1;
```
