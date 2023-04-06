---
section: hyperfunction
subsection: max_n()
---

### Get the 10 largest transactions from a table of stock trades

This example assumes that you have a table of stock trades in this format:

```sql
CREATE TABLE stock_sales(
    ts TIMESTAMPTZ,
    symbol TEXT,
    price FLOAT,
    volume INT
);
```

You can query for the 10 largest transactions each day:

```sql
WITH t as (
    SELECT
        time_bucket('1 day'::interval, ts) as day,
        max_n(price * volume, 10) AS daily_max
    FROM stock_sales
    GROUP BY time_bucket('1 day'::interval, ts)
)
SELECT
    day, as_array(daily_max)
FROM t;
```
