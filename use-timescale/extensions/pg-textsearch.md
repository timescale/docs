---
title: Optimize full text search with BM25
excerpt: Set up and optimize BM25-based full-text search using the pg_textsearch extension
keywords: [pg_textsearch, BM25, full-text search, text search, ranking, hybrid search]
tags: [search, indexing, performance, BM25]
products: [cloud, self_hosted]
---

import EA1125 from "versionContent/_partials/_early_access_11_25.mdx";
import SINCE010 from "versionContent/_partials/_since_0_1_0.mdx";
import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Optimize full text search with BM25 

$PG full-text search at scale consistently hits a wall where performance degrades catastrophically. 
$COMPANY's [pg_textsearch][pg_textsearch-github-repo] brings modern [BM25][bm25-wiki]-based full-text search directly into $PG,
with a memtable architecture for efficient indexing and ranking. `pg_textsearch` integrates seamlessly with SQL and 
provides better search quality and performance than the $PG built-in full-text search.

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

   BM25 supports single-column indexes only. 

</Procedure>

You have created a BM25 index for full-text search.

## Optimize search queries for performance

Use efficient query patterns to leverage BM25 ranking and optimize search performance.

<Procedure>

1. **Perform ranked searches using the distance operator**

   ```sql
   SELECT name, description, description <@> 'ergonomic work' as score
   FROM products
   ORDER BY score
   LIMIT 3
   ```

1. **Filter results by score threshold**

   ```sql
   SELECT name, description <@> 'wireless' as score
   FROM products
   WHERE description <@> 'wireless' < -2.0;
   ```

1. **Combine with standard SQL operations**

   ```sql
   SELECT category, name, description <@> 'ergonomic' as score
   FROM products
   WHERE price < 500
     AND description <@> 'ergonomic' < -1.0
   ORDER BY description <@> 'ergonomic'
   LIMIT 5;
   ```

1. **Verify index usage with EXPLAIN**

   ```sql
   EXPLAIN SELECT * FROM products
   ORDER BY description <@> 'ergonomic'
   LIMIT 5;
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
       embedding vector(1536)  -- OpenAI ada-002 embedding dimension
   );
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

</Procedure>

You have implemented hybrid search combining semantic and keyword search.

## Configuration options

Customize `pg_textsearch` behavior for your specific use case and data characteristics.

<Procedure>

1. **Configure memory and performance settings**

   To manage memory usage, you control when the in-memory index spills to disk segments. When the memtable reaches the
   threshold, it automatically flushes to a segment at transaction commit.

   ```sql
   -- Set memtable spill threshold (default 800000 posting entries, ~8MB segments)
   SET pg_textsearch.memtable_spill_threshold = 1000000;

   -- Set bulk load spill threshold (default 100000 terms per transaction)
   SET pg_textsearch.bulk_load_threshold = 150000;

   -- Set default query limit when no LIMIT clause is present (default 1000)
   SET pg_textsearch.default_limit = 5000;
   ```
   <SINCE010 />

1. **Configure language-specific text processing**

   ```sql
   -- French language configuration
   CREATE INDEX products_fr_idx ON products_fr
   USING bm25(description)
   WITH (text_config='french');

   -- Simple tokenization without stemming
   CREATE INDEX products_simple_idx ON products
   USING bm25(description)
   WITH (text_config='simple');
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

      - View detailed index information
          ```sql
          SELECT bm25_dump_index('products_search_idx');
          ```

</Procedure>

You have configured `pg_textsearch` for optimal performance. For production applications, consider implementing result 
caching and pagination to improve user experience with large result sets.

## Current limitations

This preview release focuses on core BM25 functionality. In this release, you cannot search for exact multi-word phrases.


[bm25-wiki]: https://en.wikipedia.org/wiki/Okapi_BM25
[in-console-editors]: /getting-started/:currentVersion:/run-queries-from-console/
[services-portal]: https://console.cloud.timescale.com/dashboard/services
[connect-using-psql]: /integrations/:currentVersion:/psql/#connect-to-your-service
[recip-rank-fusion]: https://en.wikipedia.org/wiki/Mean_reciprocal_rank
[pg-vectorscale]: /ai/:currentVersion:/sql-interface-for-pgvector-and-timescale-vector/#installing-the-pgvector-and-pgvectorscale-extensions
[pg_textsearch-github-repo]: https://github.com/timescale/pg_textsearch
