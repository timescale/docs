---
section: hyperfunction
subsection: max_n_by()
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

Find the 10 largest transactions in the table, what time they occurred, and what
symbol was being traded:

```sql
SELECT 
    (data).time, 
    (data).symbol, 
    value AS transaction 
FROM
    into_values((
        SELECT max_n_by(price * volume, stock_sales, 10)
        FROM stock_sales
    ), 
    NULL::stock_sales);
```
