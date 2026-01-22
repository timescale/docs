---
title: Optimize full text search with BM25
excerpt: Set up and optimize BM25-based full-text search using the pg_textsearch extension
keywords: [pg_textsearch, BM25, full-text search, text search, ranking, hybrid search]
tags: [search, indexing, performance, BM25]
products: [cloud, self_hosted]
---

import EA1125 from "versionContent/_partials/_early_access_11_25.mdx";
import SINCE010 from "versionContent/_partials/_since_0_1_0.mdx";
import SINCE040 from "versionContent/_partials/_since_0_4_0.mdx";
import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Optimize full text search with BM25 

$PG full-text search at scale consistently hits a wall where performance degrades catastrophically.
$COMPANY's [pg_textsearch][pg_textsearch-github-repo] brings modern [BM25][bm25-wiki]-based full-text search directly into $PG,
with a memtable architecture for efficient indexing and ranking. `pg_textsearch` integrates seamlessly with SQL and
provides better search quality and performance than the $PG built-in full-text search. With Block-Max WAND optimization,
`pg_textsearch` delivers up to **4x faster top-k queries** compared to native BM25 implementations. Advanced compression
using delta encoding and bitpacking reduces index sizes by **41%** while improving query performance by 10-20% for
shorter queries.

BM25 scores in `pg_textsearch` are returned as negative values, where lower (more negative) numbers indicate better 
matches. `pg_textsearch` implements the following:

* **Corpus-aware ranking**: BM25 uses inverse document frequency to weight rare terms higher
* **Term frequency saturation**: prevents documents with excessive term repetition from dominating results
* **Length normalization**: adjusts scores based on document length relative to corpus average
* **Relative ranking**: focuses on rank order rather than absolute score values

This page shows you how to install `pg_textsearch`, configure BM25 indexes, and optimize your search capabilities using
the following best practice: 

* **Language configuration**: choose appropriate text search configurations for your data language
* **Hybrid search**: combine with pgvector or pgvectorscale for applications requiring both semantic and keyword search
* **Query optimization**: use score thresholds to filter low-relevance results
* **Index monitoring**: regularly check index usage and memory consumption

<EA1125 /> this preview release is designed for development and staging environments. 

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

To create a BM25 index with pg_textsearch:

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

## Accelerate indexing with parallel builds

`pg_textsearch` supports parallel index builds for faster indexing of large tables. $PG automatically uses parallel workers
based on table size and the `max_parallel_maintenance_workers` configuration.

<Procedure>

1. **Configure parallel workers (optional)**

   ```sql
   -- Set parallel workers (uses server defaults if not specified)
   SET max_parallel_maintenance_workers = 4;
   ```

1. **Create index on a large table**

   ```sql
   -- Parallel workers are used automatically for large tables
   CREATE INDEX products_search_idx ON products
   USING bm25(description)
   WITH (text_config='english');
   ```

   You see a notice when parallel build is used:

   ```
   NOTICE:  Using parallel index build with 4 workers (1000000 tuples)
   ```

</Procedure>

For partitioned tables, each partition builds its index independently with parallel workers if the partition is large
enough. This enables efficient indexing of very large partitioned datasets.

## Optimize search queries for performance

Use efficient query patterns to leverage BM25 ranking and optimize search performance. The `<@>` operator provides
BM25-based ranking scores as negative values, where lower (more negative) scores indicate better matches. In `ORDER BY`
clauses, the index is automatically detected from the column. For `WHERE` clause filtering, use `to_bm25query()` with
an explicit index name.

<Procedure>

1. **Perform ranked searches using the distance operator**

   ```sql
   -- Simplified syntax: index is automatically detected in ORDER BY
   SELECT name, description, description <@> 'ergonomic work' as score
   FROM products
   ORDER BY score
   LIMIT 3;

   -- Alternative explicit syntax (works in all contexts)
   SELECT name, description, description <@> to_bm25query('ergonomic work', 'products_search_idx') as score
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
   ORDER BY description <@> to_bm25query('ergonomic', 'products_search_idx')
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

   1. **Monitor index usage and memory consumption**

      - Check index usage statistics
          ```sql
          SELECT schemaname, relname, indexrelname, idx_scan, idx_tup_read
          FROM pg_stat_user_indexes
          WHERE indexrelid::regclass::text ~ 'bm25';
          ```

      - View index summary with corpus statistics and memory usage
          ```sql
          SELECT bm25_summarize_index('products_search_idx');
          ```

      - View detailed index structure (output is truncated for display)
          ```sql
          SELECT bm25_dump_index('products_search_idx');
          ```

      - Export full index dump to a file for detailed analysis
          ```sql
          SELECT bm25_dump_index('products_search_idx', '/tmp/index_dump.txt');
          ```

      - Force memtable spill to disk (useful for testing or memory management)
          ```sql
          SELECT bm25_spill_index('products_search_idx');
          ```

</Procedure>

You have configured `pg_textsearch` for optimal performance. For production applications, consider implementing result 
caching and pagination to improve user experience with large result sets.

## Current limitations

This preview release focuses on core BM25 functionality. In this release, you cannot search for exact multi-word phrases.

[bm25-wiki]: https://en.wikipedia.org/wiki/Okapi_BM25
[connect-using-psql]: /integrations/:currentVersion:/psql/#connect-to-your-service
[in-console-editors]: /getting-started/:currentVersion:/run-queries-from-console/
[pg-vectorscale]: /ai/:currentVersion:/sql-interface-for-pgvector-and-timescale-vector/#installing-the-pgvector-and-pgvectorscale-extensions
[pg_textsearch-github-repo]: https://github.com/timescale/pg_textsearch
[recip-rank-fusion]: https://en.wikipedia.org/wiki/Mean_reciprocal_rank
[services-portal]: https://console.cloud.timescale.com/dashboard/services
