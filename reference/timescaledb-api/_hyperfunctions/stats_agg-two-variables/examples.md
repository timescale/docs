---
section: hyperfunction
subsection: stats_agg() (two variables)
---

Create a statistical aggregate that summarizes daily statistical data about two
variables, `val2` and `val1`, where `val2` is the dependent variable and `val1`
is the independent variable. Use the statistical aggregate to calculate the
average of the dependent variable and the slope of the linear-regression fit:

```sql
WITH t as (
    SELECT
        time_bucket('1 day'::interval, ts) as dt,
        stats_agg(val2, val1) AS stats2D,
    FROM foo
    WHERE id = 'bar'
    GROUP BY time_bucket('1 day'::interval, ts)
)
SELECT
    average_x(stats2D),
    slope(stats2D)
FROM t;
```
