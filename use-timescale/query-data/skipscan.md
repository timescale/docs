---
title: Get faster DISTINCT queries with SkipScan
excerpt: Speed up DISTINCT queries by setting up a hypertable to take advantage of SkipScan
products: [cloud, mst, self_hosted]
keywords: [queries, DISTINCT, SkipScan]
---

import Since220 from "versionContent/_partials/_since_2_2_0.mdx";

# Get faster `DISTINCT` queries with $SKIPSCAN_SHORT

$SKIPSCAN_LONG dramatically speeds up `DISTINCT` queries. It jumps directly to the first row of each distinct value in an 
index instead of scanning all rows. First introduced for the rowstore hypertables and relational tables, 
$SKIPSCAN_SHORT now extends to columnstore hypertables, distinct aggregates like `COUNT(DISTINCT)`, and even multiple columns.

<Since220 />

## Speed up `DISTINCT` queries

You use `DISTINCT` queries to get only the unique values in your data. For example, the IDs of customers who placed orders, the countries where your users are located, or the devices reporting into an IoT system. You might also have graphs and alarms that repeatedly query the most recent values for every device or service.

As your tables get larger, `DISTINCT` queries tend to get slower. Even when your index matches
the exact order and columns for these kinds of queries, $PG has to scan the
entire index and then run deduplication. As the table grows, this operation keeps
getting slower.

$SKIPSCAN_SHORT is an optimization for `DISTINCT` and `DISTINCT ON` queries, including multi-column `DISTINCT`. $SKIPSCAN_SHORT allows queries to incrementally jump from one ordered value to the next,
without reading the rows in between. Conceptually, $SKIPSCAN_SHORT is a regular IndexScan that skips across an
index looking for the next value that is greater than the current value.

When you issue a query that uses $SKIPSCAN_SHORT, the `EXPLAIN` output includes a new `Custom Scan (SkipScan)` 
operator, or node, that can quickly return distinct items from a properly
ordered index. As it locates one item, the $SKIPSCAN_SHORT node quickly restarts the search for
the next item. This is a much more efficient way of finding distinct items in an
ordered index.

$SKIPSCAN_SHORT cost is based on the ratio of distinct tuples to total tuples. If the number of distinct tuples is close to the total number of tuples, $SKIPSCAN_SHORT is unlikely to be used due to its higher estimated cost.

Multi-column $SKIPSCAN_SHORT is supported for queries that do not produce NULL distinct values. For example:

```sql
CREATE INDEX ON metrics(region, device, metric_type);
-- All distinct columns have filters which don't allow NULLs: can use SkipScan
SELECT DISTINCT ON (region, device, metric_type) *
FROM   metrics
WHERE region IN ('UK','EU','JP') AND device > 1 AND metric_type IS NOT NULL
ORDER  BY region, device, metric_type, time DESC;
-- Distinct columns are declared NOT NULL: can use SkipScan
CREATE TABLE metrics(region TEXT NOT NULL, device INT NOT NULL, ...);
SELECT DISTINCT ON (region, device) *
FROM   metrics
ORDER  BY region, device, time DESC;
```

For benchmarking information on how $SKIPSCAN_SHORT compares to regular `DISTINCT`
queries, see the [SkipScan blog post][blog-skipscan].

## Use $SKIPSCAN_SHORT queries

Design your layout:

- Rowstore: create an index starting with the `DISTINCT` columns, followed by your time sort. If the `DISTINCT` columns are not the first in your index, ensure any leading columns are used as constraints in your query. This means that if you are asking a question such as "retrieve a list of unique IDs in order" and "retrieve the last reading of each ID," you need at least one index like this:

    ```sql
    CREATE INDEX "cpu_customer_tags_id_time_idx" \
    ON readings (customer_id, tags_id, time DESC)
    ```
  
- Columnstore: set `timescaledb.compress_segmentby` to the distinct columns and `compress_orderby` to match your query’s sort. Compress your historical chunks.

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

[blog-skipscan]: https://www.tigerdata.com/blog/skipscan-in-timescaledb-why-distinct-was-slow-how-we-built-it-and-how-you-can-use-it
