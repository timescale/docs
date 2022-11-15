---
section: hyperfunction
subsection: max_n_by()
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

Here's how we can find the 10 largest transactions in the table, what time
they occurred, and what symbol was being traded.

```sql
SELECT 
    (data).time, 
    (data).symbol, 
    value AS transaction 
FROM
    toolkit_experimental.into_values((
        SELECT toolkit_experimental.max_n_by(price * volume, stock_sales, 10)
        FROM stock_sales
    ), 
    NULL::stock_sales);
```
