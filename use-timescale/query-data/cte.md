---
title: Get faster JOIN queries with Common Table Expressions (CTEs)
excerpt: Speed up JOIN queries by materializing hypertable queries before joining to other tables
products: [cloud, mst, self_hosted]
keywords: [queries, JOIN, CTE]
---

# Get faster JOIN queries with Common Table Expressions (CTEs)

Imagine I have a query that joins a hypertable to some other table on a shared key.

```sql
    SELECT timestamp, 
      FROM hypertable as h
      JOIN related_table as rt
        ON rt.id = h.related_table_id
     WHERE h.timestamp BETWEEN '2024-10-10 00:00:00' AND '2024-10-17 00:00:00'
```

If I `EXPLAIN` this query, I might see that the `Postgres` query planner decides that it should perform a `NestedJoin` between these two tables and thus query the hypertable multiple times.  Even if the hypertable is well indexed, if the hypertable is large this query will be slower than if `Postgres` had looked up the hypertable once.  How do we force a once-only lookup?

We can use materialized Common Table Expressions (CTEs)!

If I split my query into two parts using CTEs, I can `materialize` the hypertable lookup and thus force `Postgres` to perform only one hypertable lookup.

```sql
WITH cached_query AS materialized (
  SELECT *
    FROM hypertable
   WHERE BETWEEN '2024-10-10 00:00:00' AND '2024-10-17 00:00:00'
)
  SELECT *
    FROM cached_query as c
    JOIN related_table as rt
      ON rt.id = h.related_table_id
```

Now if I run `EXPLAIN` once again I can prove that this query performs only one lookup.  Depending on the size of your hypertable, this could result in a multi-hour query taking mere seconds.
