---
section: hyperfunction
subsection: stats_agg() (one variable)
---

Create a statistical aggregate to summarize daily statistical data about the
variable `val1`. Use the statistical aggregate to calculate average, standard
deviation, and skewness of the variable:

```sql
WITH t as (
    SELECT
        time_bucket('1 day'::interval, ts) as dt,
        stats_agg(val1) AS stats1D
    FROM foo
    WHERE id = 'bar'
    GROUP BY time_bucket('1 day'::interval, ts)
)
SELECT
    average(stats1D),
    stddev(stats1D),
    skewness(stats1D)
FROM t;
```
