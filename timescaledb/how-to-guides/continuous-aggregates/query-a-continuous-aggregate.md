## Querying Continuous Aggregates

To query data from a continuous aggregate, use a `SELECT` query on
the continuous aggregate view. For instance, you can get the average,
minimum, and maximum for the first quarter of 2020 for device 5:

```sql
SELECT * FROM conditions_summary_hourly
WHERE device = 5
  AND bucket >= '2020-01-01' AND bucket < '2020-04-01';
```

Or we can do more complex queries on the aggregates themselves, for instance, if
we wanted to know the top 20 largest metric spreads in that quarter, we could do
something like:

```sql
SELECT * FROM conditions_summary_hourly
WHERE max - min > 1800
  AND bucket >= '2020-01-01' AND bucket < '2020-04-01'
ORDER BY bucket DESC, device DESC LIMIT 20;
```
