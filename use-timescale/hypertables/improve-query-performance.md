---
title: Improve query performance
excerpt: How and why to use chunk skipping to optimize hypertable performance
products: [cloud, mst, self_hosted]
keywords: [hypertables, indexes, chunks]
---

# Improve query performance

When you execute a query on a hypertable, you do not parse the whole table; you only access the chunks necessary
to satisfy the query. This works well when the `WHERE` clause of a query uses the column by which a hypertable is 
partitioned. For example, in a hypertable where every day of the year is a separate chunk, a query for September 1 
accesses only the chunk for that day. However, many queries use columns other than the partitioning one. For example, 
a table might have two columns: one for when data was gathered and one for when it was added to the database. If you 
partition by the date of gathering, a query by the date of adding accesses all chunks in the hypertable and slows the 
performance.

To improve query performance, TimescaleDB enables you to skip hypertable chunks on non-partitioning columns. 

## How chunk skipping works

You enable chunk skipping on a column in a table. TimescaleDB tracks the minimum and maximum values for that column in 
each chunk. These ranges are stored in the start (inclusive) and end (exclusive) format in the `chunk_column_stats` 
catalog table. TimescaleDB uses these ranges for dynamic chunk exclusion when the `WHERE` clause of an SQL query 
specifies ranges on the column. 

You can enable chunk skipping on compressed hypertables for `smallint`, `int`, `bigint`, `serial`, `bigserial`, `date`,
`timestamp`, or `timestamptz` type columns. Best practice is to enable chunk skipping on the columns correlated to the 
partitioning column and referenced in the `WHERE` clauses. However, you can enable chunk skipping on as many columns as 
you need.

## Enable chunk skipping

To enable chunk skipping on a column, call `enable_chunk_skipping` on a `hypertable` for a `column_name`. For example, 
the following query enables chunk skipping on the `order_id` column in the `orders` table:

```sql
SELECT enable_chunk_skipping('orders', 'order_id');
```

For more details, see the [API Reference][api-reference].

[api-reference]: /api/:currentVersion:/hypertable/enable_chunk_skipping/

