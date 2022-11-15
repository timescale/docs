---
section: hyperfunction
subsection: max_n()
---

For this example assume we have some rudimentary table of stock trades that
looks like the following:

```sql
CREATE TABLE stock_sales(
    ts TIMESTAMPTZ,
    symbol TEXT,
    price FLOAT,
    volume INT
);
```

Here's how we can query for the 10 largest transactions each day:

```sql
WITH t as (
    SELECT
        time_bucket('1 day'::interval, ts) as day,
        toolkit_experimental.max_n(price * volume, 10) AS daily_max
    FROM stock_sales
    GROUP BY time_bucket('1 day'::interval, ts)
)
SELECT
    day, toolkit_experimental.as_array(daily_max)
FROM t;
```
