---
title: Skip chunks on a hypertable
excerpt: How and why to use chunk skipping to optimize hypertable performance
products: [cloud, mst, self_hosted]
keywords: [hypertables, indexes, chunks]
---

# Skip chunks

When you execute a query on a hypertable, you only access the necessary chunks to satisfy it, instead of parsing the whole table. This works great when the `WHERE` clause of a query uses the column by which a hypertable is partitioned. For example, in a hypertable where every day of the year is a separate chunk, a query for September 1 will access only that specific chunk. 

However, many queries use columns other than the partitioning one. For example, a table might have two columns: one for when data was gathered and one for when it was added to the database. If you partition by the date of gathering, querying by the date of adding requires accessing all chunks.

To address this, TimescaleDB allows you to enable chunk skipping on non-partitioning columns. 

## How chunk skipping works 

You can enable chunk skipping on compressed hypertables for `smallint`, `int`, `bigint`, `serial`, `bigserial`, `date`, `timestamp`, or `timestamptz` type columns. 

After enabling, TimescaleDB tracks the minimum and maximum values for that column in each chunk. These ranges are stored in the start (inclusive) and end (exclusive) format in the `chunk_column_stats` catalog table. They are then used for dynamic chunk exclusion when the `WHERE` clause of an SQL query specifies ranges on the column. 

You can enable chunk skipping on as many columns as you need. The best practice is to enable it on columns correlated to the partitioning column and referenced in the `WHERE` clauses.

## Enable chunk skipping

Use `enable_chunk_skipping` to enable chunk skipping on a column, passing in the `hypertable` and `column_name` required arguments. 

For example, the following query enables chunk skipping on the `order_id` column in the `orders` table:

```sql
SELECT enable_chunk_skipping('orders', 'order_id');
```

For more details, see [API Reference][api-reference].

[api-reference]: /api/:currentVersion:/hypertable/enable_chunk_skipping/

