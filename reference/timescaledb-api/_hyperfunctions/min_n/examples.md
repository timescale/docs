---
section: hyperfunction
subsection: min_n()
---

This example assumes that you have a table of stock trades in this format:

```sql
CREATE TABLE stock_sales(
    ts TIMESTAMPTZ,
    symbol TEXT,
    price FLOAT,
    volume INT
);
```

You can query for the 10 smallest transactions each day:

```sql
WITH t as (
    SELECT
        time_bucket('1 day'::interval, ts) as day,
        min_n(price * volume, 10) AS daily_min
    FROM stock_sales
    GROUP BY time_bucket('1 day'::interval, ts)
)
SELECT
    day, as_array(daily_max)
FROM t;
```
