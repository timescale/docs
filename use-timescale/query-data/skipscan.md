---
title: Get faster DISTINCT queries with SkipScan
excerpt: Speed up DISTINCT queries by setting up a hypertable to take advantage of SkipScan
products: [cloud, mst, self_hosted]
keywords: [queries, DISTINCT, SkipScan]
---

# Get faster `DISTINCT` queries with `SkipScan`

SkipScan improves query times for `DISTINCT` queries. It works on PostgreSQL
tables, Timescale hypertables, and Timescale distributed hypertables.
SkipScan is included in TimescaleDB&nbsp;2.2.1 and later.

<Highlight type="note">
This page discusses the Timescale Skipscan feature. SkipScan is not currently
available in standard PostgreSQL.
</Highlight>

## Speed up `DISTINCT` queries

To query your database and find the most recent value of an item, you
could use a `DISTINCT` query. For example, you might want to find the latest
stock or cryptocurrency price for each of your investments. Or you might have graphs
and alarms that repeatedly query the most recent values for every device or
service.

As your tables get larger, `DISTINCT` queries tend to get slower. This is
because PostgreSQL does not currently have a good mechanism for pulling a list
of unique values from an ordered index. Even when you have an index that matches
the exact order and columns for these kinds of queries, PostgreSQL scans the
entire index to find all unique values. As a table grows, this operation keeps
getting slower.

<Highlight type="note">
Timescale SkipScan does not currently work on compressed chunks.
</Highlight>

SkipScan allows queries to incrementally jump from one ordered value to the next
without reading all of the rows in between. Without support for this feature,
the database engine has to scan the entire ordered index and then de-duplicate
at the end, which is a much slower process.

SkipScan is an optimization for queries of the form `SELECT DISTINCT ON
column_name`. Conceptually, SkipScan is a regular IndexScan that skips across an
index looking for the next value that is greater than the current value.

When you issue a query that uses SkipScan, the `EXPLAIN` output includes a new
operator, or node, that can quickly return distinct items from a properly
ordered index. With an IndexOnly scan, PostgreSQL has to scan the entire index,
but SkipScan incrementally searches for each successive item in the ordered
index. As it locates one item, the SkipScan node quickly restarts the search for
the next item. This is a much more efficient way of finding distinct items in an
ordered index.

For benchmarking information on how SkipScan compares to regular `DISTINCT`
queries, see the [SkipScan blog post][blog-skipscan].

## Use SkipScan queries

SkipScan is included in TimescaleDB&nbsp;2.2.1 and later. This section describes
how to set up your database index and query to use a SkipScan node.

Your index must:

*   Contain the `DISTINCT` column as the first column.
*   Be a `BTREE` index.
*   Match the `ORDER BY` used in your query.

Your query must:

*   Use the `DISTINCT` keyword on a single column.

If the `DISTINCT` column is not the first column of the index, ensure any
leading columns are used as constraints in your query. This means that if you
are asking a question such as "retrieve a list of unique IDs in order" and
"retrieve the last reading of each ID," you need at least one index like this:

```sql
CREATE INDEX "cpu_customer_tags_id_time_idx" \
ON readings (customer_id, tags_id, time DESC)
```

With your index set up correctly, you should start to see immediate benefit for
`DISTINCT` queries. When SkipScan is chosen for your query, the `EXPLAIN
ANALYZE` output shows one or more `Custom Scan (SkipScan)` nodes, like this:

```sql
->  Unique
  ->  Merge Append
    Sort Key: _hyper_8_79_chunk.tags_id, _hyper_8_79_chunk."time" DESC
     ->  Custom Scan (SkipScan) on _hyper_8_79_chunk
      ->  Index Only Scan using _hyper_8_79_chunk_cpu_tags_id_time_idx on _hyper_8_79_chunk
          Index Cond: (tags_id > NULL::integer)
     ->  Custom Scan (SkipScan) on _hyper_8_80_chunk
      ->  Index Only Scan using _hyper_8_80_chunk_cpu_tags_id_time_idx on _hyper_8_80_chunk
         Index Cond: (tags_id > NULL::integer)
```

[blog-skipscan]: https://www.timescale.com/blog/how-we-made-distinct-queries-up-to-8000x-faster-on-postgresql/
