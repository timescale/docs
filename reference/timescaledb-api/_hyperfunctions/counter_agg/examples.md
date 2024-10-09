---
section: hyperfunction
subsection: counter_agg()
---

### Roll up counter aggregates and calculate deltas

Create daily counter aggregates for a counter with id `bar`:

```sql
SELECT
    date_trunc('day', ts) as dt,
    counter_agg(ts, val) AS counter_summary -- get a counter aggregate
FROM foo
WHERE id = 'bar'
GROUP BY date_trunc('day')
```

Roll up the daily aggregates to get a counter aggregate that covers all recorded
timestamps:

```sql
WITH t as (
    SELECT
        date_trunc('day', ts) as dt,
        counter_agg(ts, val) AS counter_summary -- get a counter aggregate
    FROM foo
    WHERE id = 'bar'
    GROUP BY date_trunc('day')
)
SELECT rollup(counter_summary) AS full_cs -- do a second level of aggregation to get the full counter aggregate
FROM t
```

Calculate the delta, or the difference between the final and first values, from
each daily counter aggregate. Also calculate the fraction of the total delta that
happens on each day:

```sql
WITH t as (
    SELECT
        date_trunc('day', ts) as dt,
        counter_agg(ts, val) AS counter_summary -- get a counter aggregate
    FROM foo
    WHERE id = 'bar'
    GROUP BY date_trunc('day')
), q as (
    SELECT rollup(counter_summary) AS full_cs -- do a second level of aggregation to get the full counter aggregate
    FROM t
)
SELECT
    dt,
    delta(counter_summary),  -- extract the delta from the daily counter aggregates
    delta(counter_summary) / (SELECT delta(full_cs) FROM q LIMIT 1)  as normalized -- get the fraction of the delta that happened each day compared to the full change of the counter
FROM t;
```
