---
title: Optimize full text search with BM25
excerpt: Set up and optimize BM25-based full-text search using the pg_textsearch extension
keywords: [pg_textsearch, BM25, full-text search, text search, ranking, hybrid search]
tags: [search, indexing, performance, BM25]
products: [cloud, self_hosted]
---

import SINCE010 from "versionContent/_partials/_since_0_1_0.mdx";
import SINCE040 from "versionContent/_partials/_since_0_4_0.mdx";
import SINCE050 from "versionContent/_partials/_since_0_5_0.mdx";
import SINCE100 from "versionContent/_partials/_since_1_0_0.mdx";
import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Optimize full text search with BM25 

$PG full-text search at scale consistently hits a wall where performance degrades catastrophically.
$COMPANY's [pg_textsearch][pg_textsearch-github-repo] brings modern [BM25][bm25-wiki]-based full-text search directly into $PG,
with a memtable architecture for efficient indexing and ranking. `pg_textsearch` integrates seamlessly with SQL and
provides better search quality and performance than the $PG built-in full-text search. With Block-Max WAND optimization,
`pg_textsearch` delivers up to **4x faster top-k queries** compared to native BM25 implementations. Parallel index builds
reduce indexing times by **4x or more** for large tables. Advanced compression using delta encoding and bitpacking reduces
index sizes by **41%** while improving query performance by 10-20% for shorter queries.

BM25 scores in `pg_textsearch` are returned as negative values, where lower (more negative) numbers indicate better 
matches. `pg_textsearch` implements the following:

* **Corpus-aware ranking**: BM25 uses inverse document frequency to weight rare terms higher
* **Term frequency saturation**: prevents documents with excessive term repetition from dominating results
* **Length normalization**: adjusts scores based on document length relative to corpus average
* **Relative ranking**: focuses on rank order rather than absolute score values

This page shows you how to install `pg_textsearch`, configure BM25 indexes, and optimize your search capabilities using
the following best practices:

* **Parallel indexing**: enable parallel workers for faster index creation on large tables
* **Language configuration**: choose appropriate text search configurations for your data language
* **Hybrid search**: combine with pgvector or pgvectorscale for applications requiring both semantic and keyword search
* **Query optimization**: use score thresholds to filter low-relevance results
* **Index monitoring**: regularly check index usage and memory consumption

`pg_textsearch` v1.0.0 is production ready (March 2026). It supports $PG 17 and 18.

<SINCE100 />

## Prerequisites

<IntegrationPrereqs />

## Install pg_textsearch 

To install this $PG extension: 

<Procedure>

1. **Connect to your $SERVICE_LONG**

   In [$CONSOLE][services-portal] open an [SQL editor][in-console-editors]. You can also connect to your $SERVICE_SHORT using [psql][connect-using-psql].

1. **Enable the extension on your $SERVICE_LONG**

   - For new services, simply enable the extension:
      ```sql
      CREATE EXTENSION pg_textsearch;
      ```
   
   - For existing services, update your instance, then enable the extension:

      The extension may not be available until after your next scheduled maintenance window. To pick up the update 
      immediately, manually pause and restart your service.

1. **Verify the installation**

   ```sql
   SELECT * FROM pg_extension WHERE extname = 'pg_textsearch';
   ```

</Procedure>

You have installed `pg_textsearch` on $CLOUD_LONG.

## Create BM25 indexes on your data

BM25 indexes provide modern relevance ranking that outperforms $PG's built-in ts_rank functions by using corpus
statistics and better algorithmic design.

To create a BM25 index with `pg_textsearch`:

<Procedure>

1. **Create a table with text content**

   ```sql
   CREATE TABLE products (
       id serial PRIMARY KEY,
       name text,
       description text,
       category text,
       price numeric
   );
   ```

1. **Insert sample data**

   ```sql
   INSERT INTO products (name, description, category, price) VALUES
   ('Mechanical Keyboard', 'Durable mechanical switches with RGB backlighting for gaming and productivity', 'Electronics', 149.99),
   ('Ergonomic Mouse', 'Wireless mouse with ergonomic design to reduce wrist strain during long work sessions', 'Electronics', 79.99),
   ('Standing Desk', 'Adjustable height desk for better posture and productivity throughout the workday', 'Furniture', 599.99);
   ```

1. **Create a BM25 index**

   ```sql
   CREATE INDEX products_search_idx ON products
   USING bm25(description)
   WITH (text_config='english');
   ```

   BM25 supports single-column indexes only. For optimal performance, load your data first, then create the index.

</Procedure>

You have created a BM25 index for full-text search.

## Enable parallel indexing for faster index creation

`pg_textsearch` supports parallel index builds that can significantly reduce indexing times for large tables.
$PG automatically uses parallel workers based on table size and available resources.

<Procedure>

1. **Configure parallel workers (optional)**

   $PG uses server defaults, but you can adjust settings for your workload:

   ```sql
   -- Set number of parallel workers (uses CPU count by default)
   SET max_parallel_maintenance_workers = 4;

   -- Set memory for index builds (must be at least 64MB for parallel builds)
   SET maintenance_work_mem = '256MB';
   ```

   **Note**: The planner requires `maintenance_work_mem >= 64MB` to enable parallel index builds. With insufficient
   memory, builds fall back to serial mode silently.

1. **Create index (parallel workers used automatically for large tables)**

   ```sql
   CREATE INDEX products_search_idx ON products
   USING bm25(description)
   WITH (text_config='english');
   ```

   When parallel build is used, you see a notice:

   ```
   NOTICE:  parallel index build: launched 4 of 4 requested workers
   ```

1. **Verify parallel execution in partitioned tables**

   For partitioned tables, each partition builds its index independently with parallel workers if the partition is
   large enough. This allows efficient indexing of very large partitioned datasets.

</Procedure>

<SINCE050 />

You have configured parallel index builds for faster indexing.

## Optimize search queries for performance

Use efficient query patterns to leverage BM25 ranking and optimize search performance. The `<@>` operator provides
BM25-based ranking scores as negative values, where lower (more negative) scores indicate better matches. In `ORDER BY`
clauses, the index is automatically detected from the column. For `WHERE` clause filtering, use `to_bm25query()` with
an explicit index name.

<Procedure>

1. **Perform ranked searches using implicit syntax**

   The simplest way to query is with the implicit `<@>` syntax. The BM25 index is automatically detected from the column:

   ```sql
   SELECT name, description, description <@> 'ergonomic work' as score
   FROM products
   ORDER BY score
   LIMIT 3;
   ```

   You see something like:

   ```sql
                name           |                                    description                                    |        score
   ----------------------------+-----------------------------------------------------------------------------------+---------------------
    Ergonomic Mouse            | Wireless mouse with ergonomic design to reduce wrist strain during long work sessions | -1.8132977485656738
    Mechanical Keyboard        | Durable mechanical switches with RGB backlighting for gaming and productivity      |                   0
    Standing Desk              | Adjustable height desk for better posture and productivity throughout the workday  |                   0
   ```

1. **Use explicit index specification with `to_bm25query()`**

   For `WHERE` clause filtering or when you need to specify the index explicitly, use `to_bm25query()`:

   ```sql
   SELECT name, description <@> to_bm25query('ergonomic work', 'products_search_idx') as score
   FROM products
   ORDER BY score
   LIMIT 3;
   ```

   The implicit `text <@> 'query'` syntax does not work inside PL/pgSQL functions or DO blocks. Use
   `to_bm25query()` with an explicit index name in those contexts. See [bm25query data type](#bm25query-data-type)
   for details.

1. **Filter results by score threshold**

   For filtering with WHERE clauses, use explicit index specification with `to_bm25query()`:

   ```sql
   SELECT name, description <@> to_bm25query('wireless', 'products_search_idx') as score
   FROM products
   WHERE description <@> to_bm25query('wireless', 'products_search_idx') < -0.5;
   ```

   You see something like:

   ```sql
        name       |        score
   ----------------+---------------------
    Ergonomic Mouse | -0.9066488742828369
   ```

1. **Combine with standard SQL operations**

   ```sql
   SELECT category, name, description <@> to_bm25query('ergonomic', 'products_search_idx') as score
   FROM products
   WHERE price < 500
     AND description <@> to_bm25query('ergonomic', 'products_search_idx') < -0.5
   ORDER BY score
   LIMIT 5;
   ```

   You see something like:

   ```sql
     category   |      name       |        score
   -------------+-----------------+---------------------
    Electronics | Ergonomic Mouse | -0.9066488742828369
   ```

1. **Verify index usage with EXPLAIN**

   ```sql
   EXPLAIN SELECT * FROM products
   ORDER BY description <@> 'ergonomic'
   LIMIT 5;
   ```

   You see something like:

   ```sql
                                              QUERY PLAN
   --------------------------------------------------------------------------------------------
    Limit  (cost=8.55..8.56 rows=3 width=140)
      ->  Sort  (cost=8.55..8.56 rows=3 width=140)
            Sort Key: ((description <@> 'products_search_idx:ergonomic'::bm25query))
            ->  Seq Scan on products  (cost=0.00..8.53 rows=3 width=140)
   ```

   For small datasets, $PG may prefer sequential scans over index scans. To force index usage during testing:

   ```sql
   SET enable_seqscan = off;
   ```

   Even when `EXPLAIN` shows a sequential scan, the `<@>` operator always uses the BM25 index internally for
   corpus statistics (document counts, average document length) required for accurate BM25 scoring.

</Procedure>

You have optimized your search queries for BM25 ranking.

## Build hybrid search with semantic and keyword search

Combine `pg_textsearch` with `pgvector` or `pgvectorscale` to build powerful hybrid search systems that use both semantic vector search and keyword BM25 search.

<Procedure>

1. **Enable the [vectorscale][pg-vectorscale] extension on your $SERVICE_LONG**
   ```sql
    CREATE EXTENSION IF NOT EXISTS vectorscale CASCADE;
    ```
1. **Create a table with both text content and vector embeddings**

   ```sql
   CREATE TABLE articles (
       id serial PRIMARY KEY,
       title text,
       content text,
       embedding vector(3)  -- Using 3 dimensions for this example; use 1536 for OpenAI ada-002
   );
   ```

1. **Insert sample data**

   ```sql
   INSERT INTO articles (title, content, embedding) VALUES
   ('Database Query Optimization', 'Learn how to optimize database query performance using indexes and query planning', '[0.1, 0.15, 0.2]'),
   ('Performance Tuning Guide', 'A comprehensive guide to performance tuning in distributed systems and databases', '[0.12, 0.18, 0.25]'),
   ('Introduction to Indexing', 'Understanding how database indexes improve query performance and data retrieval', '[0.09, 0.14, 0.19]'),
   ('Advanced SQL Techniques', 'Master advanced SQL techniques for complex data analysis and reporting', '[0.5, 0.6, 0.7]'),
   ('Data Warehousing Basics', 'Getting started with data warehousing and analytical query processing', '[0.8, 0.9, 0.85]');
   ```

1. **Create indexes for both search types**

   ```sql
   -- Vector index for semantic search
   CREATE INDEX articles_embedding_idx ON articles
   USING hnsw (embedding vector_cosine_ops);

   -- Keyword index for BM25 search
   CREATE INDEX articles_content_idx ON articles
   USING bm25(content)
   WITH (text_config='english');
   ```

1. **Perform hybrid search using [reciprocal rank fusion][recip-rank-fusion]**

   ```sql
   WITH vector_search AS (
     SELECT id,
            ROW_NUMBER() OVER (ORDER BY embedding <=> '[0.1, 0.2, 0.3]'::vector) AS rank
     FROM articles
     ORDER BY embedding <=> '[0.1, 0.2, 0.3]'::vector
     LIMIT 20
   ),
   keyword_search AS (
     SELECT id,
            ROW_NUMBER() OVER (ORDER BY content <@> to_bm25query('query performance', 'articles_content_idx')) AS rank
     FROM articles
     ORDER BY content <@> to_bm25query('query performance', 'articles_content_idx')
     LIMIT 20
   )
   SELECT a.id,
          a.title,
          COALESCE(1.0 / (60 + v.rank), 0.0) + COALESCE(1.0 / (60 + k.rank), 0.0) AS combined_score
   FROM articles a
   LEFT JOIN vector_search v ON a.id = v.id
   LEFT JOIN keyword_search k ON a.id = k.id
   WHERE v.id IS NOT NULL OR k.id IS NOT NULL
   ORDER BY combined_score DESC
   LIMIT 10;
   ```

   You see something like:

   ```sql
    id |           title            |   combined_score
   ----+----------------------------+--------------------
     3 | Introduction to Indexing   | 0.0325224748810153
     1 | Database Query Optimization| 0.0322664584959667
     2 | Performance Tuning Guide   | 0.0320020481310804
     5 | Data Warehousing Basics    | 0.0310096153846154
     4 | Advanced SQL Techniques    | 0.0310096153846154
   ```

1. **Adjust relative weights for different search types**

   ```sql
     WITH vector_search AS (
     SELECT id,
            ROW_NUMBER() OVER (ORDER BY embedding <=> '[0.1, 0.2, 0.3]'::vector) AS rank
     FROM articles
     ORDER BY embedding <=> '[0.1, 0.2, 0.3]'::vector
     LIMIT 20
   ),
   keyword_search AS (
     SELECT id,
            ROW_NUMBER() OVER (ORDER BY content <@> to_bm25query('query performance', 'articles_content_idx')) AS rank
     FROM articles
     ORDER BY content <@> to_bm25query('query performance', 'articles_content_idx')
     LIMIT 20
   )
   SELECT
       a.id,
       a.title,
       0.7 * COALESCE(1.0 / (60 + v.rank), 0.0) +  -- 70% weight to vectors
       0.3 * COALESCE(1.0 / (60 + k.rank), 0.0)    -- 30% weight to keywords
   AS combined_score
   FROM articles a
   LEFT JOIN vector_search v ON a.id = v.id
   LEFT JOIN keyword_search k ON a.id = k.id
   WHERE v.id IS NOT NULL OR k.id IS NOT NULL
   ORDER BY combined_score DESC
   LIMIT 10;
   ```

   You see something like:

   ```sql
    id |           title            |   combined_score
   ----+----------------------------+--------------------
     3 | Introduction to Indexing   | 0.0163141195134849
     2 | Performance Tuning Guide   | 0.0160522273425499
     1 | Database Query Optimization| 0.0160291438979964
     4 | Advanced SQL Techniques    | 0.0155528846153846
     5 | Data Warehousing Basics    | 0.0154567307692308
   ```

</Procedure>

You have implemented hybrid search combining semantic and keyword search.

## bm25query data type

The `bm25query` type represents queries for BM25 scoring with optional index context. You need this type when using
`to_bm25query()` for explicit index specification, `WHERE` clause filtering, or PL/pgSQL compatibility.

### Constructor functions

| Function | Description |
|---|---|
| `to_bm25query(text)` | Create a bm25query without index name (for `ORDER BY` only) |
| `to_bm25query(text, text)` | Create a bm25query with query text and index name |

```sql
-- Create a bm25query with index name (required for WHERE clause and standalone scoring)
SELECT to_bm25query('search query text', 'products_search_idx');
-- Returns: products_search_idx:search query text

-- Create a bm25query without index name (only works in ORDER BY with index scan)
SELECT to_bm25query('search query text');
-- Returns: search query text
```

### Cast syntax

You can also create a `bm25query` using cast syntax with an embedded index name:

```sql
SELECT 'products_search_idx:search query text'::bm25query;
-- Returns: products_search_idx:search query text
```

### Operators

| Operator | Description |
|---|---|
| `text <@> bm25query` | BM25 scoring operator (returns negative scores; lower is better) |
| `bm25query = bm25query` | Equality comparison |

<SINCE100 />

## Configuration options

Customize `pg_textsearch` behavior for your specific use case and data characteristics.

<Procedure>

1. **Configure memory and performance settings**

   To manage memory usage, you control when the in-memory index spills to disk segments. When the memtable reaches the
   threshold, it automatically flushes to a segment at transaction commit.

   ```sql
   -- Set memtable spill threshold (default 32000000 posting entries, ~1M docs/segment)
   SET pg_textsearch.memtable_spill_threshold = 32000000;

   -- Set bulk load spill threshold (default 100000 terms per transaction)
   SET pg_textsearch.bulk_load_threshold = 150000;

   -- Set default query limit when no LIMIT clause is present (default 1000)
   SET pg_textsearch.default_limit = 5000;

   -- Enable Block-Max WAND optimization for faster top-k queries (enabled by default)
   SET pg_textsearch.enable_bmw = true;

   -- Log block skip statistics for debugging query performance (disabled by default)
   SET pg_textsearch.log_bmw_stats = false;
   ```
   <SINCE010 />

   ```sql
   -- Enable segment compression using delta encoding and bitpacking (enabled by default)
   -- Reduces index size by ~41% with 10-20% query performance improvement for shorter queries
   SET pg_textsearch.compress_segments = on;
   ```
   <SINCE040 />

   ```sql
   -- Control segments per level before automatic compaction (default 8, range 2-64)
   SET pg_textsearch.segments_per_level = 8;

   -- Log BM25 scores during scans for debugging (disabled by default)
   SET pg_textsearch.log_scores = false;
   ```
   <SINCE100 />

1. **Configure language-specific text processing**

   You can create multiple BM25 indexes on the same column with different language configurations:

   ```sql
   -- Create an additional index with simple tokenization (no stemming)
   CREATE INDEX products_simple_idx ON products
   USING bm25(description)
   WITH (text_config='simple');

   -- Example: French language configuration for a French products table
   -- CREATE INDEX products_fr_idx ON products_fr
   -- USING bm25(description)
   -- WITH (text_config='french');
   ```

1. **Tune BM25 parameters**

   ```sql
   -- Adjust term frequency saturation (k1) and length normalization (b)
   CREATE INDEX products_custom_idx ON products
   USING bm25(description)
   WITH (text_config='english', k1=1.5, b=0.8);
   ```

1. **Optimize query performance with force merge**

   After bulk loads or sustained incremental inserts, multiple index segments may accumulate. Consolidating
   them into a single segment improves query speed by reducing the number of segments scanned. This is
   analogous to Lucene's `forceMerge(1)`:

   ```sql
   SELECT bm25_force_merge('products_search_idx');
   ```

   Best used after large batch inserts, not during ongoing write traffic. The operation rewrites all segments
   into a single segment and reclaims freed pages.

   <SINCE100 />

1. **Monitor index usage and memory consumption**

      - Check index usage statistics
          ```sql
          SELECT schemaname, relname, indexrelname, idx_scan, idx_tup_read
          FROM pg_stat_user_indexes
          WHERE indexrelid::regclass::text ~ 'bm25';
          ```

      - View index summary with corpus statistics and memory usage (requires superuser)
          ```sql
          SELECT bm25_summarize_index('products_search_idx');
          ```

      - View detailed index structure (requires superuser, output is truncated for display)
          ```sql
          SELECT bm25_dump_index('products_search_idx');
          ```

          The two-argument form `bm25_dump_index('idx', '/tmp/dump.txt')` that writes output to a file is
          only available in debug builds (compiled with `-DDEBUG_DUMP_INDEX`). It is not available in
          production builds on $CLOUD_LONG.

      - Force memtable spill to disk (useful for testing or memory management)
          ```sql
          SELECT bm25_spill_index('products_search_idx');
          ```

</Procedure>

You have configured `pg_textsearch` for optimal performance. For production applications, consider implementing result
caching and pagination to improve user experience with large result sets.

## Filtering guidance

There are two ways filtering interacts with BM25 index scans:

**Pre-filtering** uses a separate index (B-tree, etc.) to reduce rows before scoring:

```sql
-- Create index on filter column
CREATE INDEX ON products (category);

-- Query filters first, then scores matching rows
SELECT * FROM products
WHERE category = 'Electronics'
ORDER BY description <@> 'ergonomic wireless'
LIMIT 10;
```

**Post-filtering** applies the BM25 index scan first, then filters results:

```sql
SELECT * FROM products
WHERE description <@> to_bm25query('ergonomic', 'products_search_idx') < -0.5
ORDER BY description <@> 'ergonomic'
LIMIT 10;
```

**Performance considerations**:

* **Pre-filtering tradeoff**: if the filter matches many rows (for example, 100K+), scoring all of them can be expensive.
  The BM25 index is most efficient when it can use top-k optimization (`ORDER BY` + `LIMIT`) to avoid scoring every
  matching document.
* **Post-filtering tradeoff**: the index returns top-k results *before* filtering. If your `WHERE` clause eliminates
  most results, you may get fewer rows than requested. Increase `LIMIT` to compensate, then re-limit in application code.
* **Best case**: pre-filter with a selective condition (matches <10% of rows), then let BM25 score the reduced set with
  `ORDER BY` + `LIMIT`.

## Crash recovery

The memtable is rebuilt from the heap on startup, so no data is lost if $PG crashes before spilling to disk.

## Self-hosted installation

For self-hosted installations, `pg_textsearch` must be loaded via `shared_preload_libraries`. Add the following to
`postgresql.conf` and restart the server:

```
shared_preload_libraries = 'pg_textsearch'  # add to existing list if needed
```

This is not required on $CLOUD_LONG, where the extension is pre-configured.

## Current limitations

Current limitations include:

* **No phrase search**: you cannot search for exact multi-word phrases. You can emulate phrase matching by combining
  BM25 ranking with a post-filter:
  ```sql
  SELECT * FROM (
      SELECT *, content <@> 'database system' AS score
      FROM documents
      ORDER BY score
      LIMIT 100  -- over-fetch to account for post-filter
  ) sub
  WHERE content ILIKE '%database system%'
  ORDER BY score
  LIMIT 10;
  ```
* **No compressed data support**: `pg_textsearch` does not work with compressed data.
* **No expression indexing**: each BM25 index covers a single text column. You cannot create an index on an expression
  like `lower(title) || ' ' || content`. As a workaround, use a generated column:
  ```sql
  ALTER TABLE documents ADD COLUMN search_text text
      GENERATED ALWAYS AS (
          COALESCE(title, '') || ' ' || COALESCE(content, '')
      ) STORED;
  CREATE INDEX ON documents USING bm25(search_text) WITH (text_config = 'english');
  ```
* **No built-in faceted search**: `pg_textsearch` does not provide dedicated faceting operators. Use standard $PG
  `GROUP BY` for facet counts:
  ```sql
  SELECT category, count(*)
  FROM products
  WHERE description <@> to_bm25query('ergonomic', 'products_search_idx') < -1.0
  GROUP BY category;
  ```
* **Insert/update performance**: sustained write-heavy workloads are not yet fully optimized. For initial data loading,
  create the index after loading data rather than using incremental inserts.
* **No background compaction**: segment compaction runs synchronously during memtable spill operations. Write-heavy
  workloads may observe compaction latency during spills.
* **Partitioned table statistics**: BM25 indexes on partitioned tables use partition-local statistics. Each partition
  maintains its own document count, average document length, and per-term document frequencies. Scores are not directly
  comparable across partitions.
* **Word length limit**: inherits $PG's tsvector word length limit of 2047 characters. Words exceeding this limit are
  ignored during tokenization.
* **PL/pgSQL limitation**: the implicit `text <@> 'query'` syntax does not work inside PL/pgSQL DO blocks, functions,
  or stored procedures. Use `to_bm25query()` with an explicit index name instead:
  ```sql
  -- Inside PL/pgSQL, use explicit index name:
  SELECT * FROM documents
  ORDER BY content <@> to_bm25query('search terms', 'docs_idx')
  LIMIT 10;
  ```

[bm25-wiki]: https://en.wikipedia.org/wiki/Okapi_BM25
[connect-using-psql]: /integrations/:currentVersion:/psql/#connect-to-your-service
[in-console-editors]: /getting-started/:currentVersion:/run-queries-from-console/
[pg-vectorscale]: /ai/:currentVersion:/sql-interface-for-pgvector-and-timescale-vector/#installing-the-pgvector-and-pgvectorscale-extensions
[pg_textsearch-github-repo]: https://github.com/timescale/pg_textsearch
[recip-rank-fusion]: https://en.wikipedia.org/wiki/Mean_reciprocal_rank
[services-portal]: https://console.cloud.timescale.com/dashboard/services
