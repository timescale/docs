---
title: Optimize full text search with BM25
excerpt: Set up and optimize BM25-based full-text search using pg_textsearch extension for efficient ranked text searching
keywords: [pg_textsearch, BM25, full-text search, text search, ranking, hybrid search]
tags: [search, indexing, performance, BM25]
---

import EA1125 from "versionContent/_partials/_early_access_11_25.mdx";


# Optimize full text search with BM25 

$PG full-text search at scale consistently hits a wall where performance degrades catastrophically. 
$COMPANY's [pg_textsearch][pg_textsearch-repo] brings modern BM25-based full-text search directly into $PG, using a memtable 
architecture for efficient indexing and ranking. pg_textsearch integrates seamlessly with SQL and provides better search 
quality and performance than the $PG built-in full-text search.

This guide shows you how to install pg_textsearch and configure BM25 indexes, then optimize your search capabilities. 

<EA1125 />

## Prerequisites

To use pg_textsearch you need:

* A Tiger Cloud service (available on free tier)
* $PG 17 or later
* Tables with text columns you want to search

## Install pg_textsearch on Tiger Cloud

pg_textsearch is available to all Tiger Cloud customers, including those on the free plan. This is a preview release 
designed for development and staging environments.

<Procedure>

1. **Enable the extension on your Tiger Cloud service**

   For new services, simply enable the extension:
   ```sql
   CREATE EXTENSION pg_textsearch;
   ```

1. **For existing services, update your instance**

   The extension may not be available until after your next scheduled maintenance window. You can manually pause and restart your service to pick up the update immediately.

1. **Verify installation**

   ```sql
   SELECT * FROM pg_extension WHERE extname = 'pg_textsearch';
   ```

</Procedure>

You have installed pg_textsearch on Tiger Cloud.

## Create and configure BM25 indexes

BM25 indexes provide modern relevance ranking that outperforms $PG's built-in ts_rank functions by using corpus statistics and better algorithmic design.

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
   USING pg_textsearch(description)
   WITH (text_config='english');
   ```

1. **Configure memory limit if needed**

   The size of the memtable depends primarily on the number of distinct terms in your corpus. The Timescale docs dataset produces a roughly 10MB index. For comparison, a corpus with longer documents or more varied vocabulary will require more memory per document.
   ```sql
   -- Set memory limit per index (default 64MB)
   SET pg_textsearch.index_memory_limit = '128MB';
   ```

</Procedure>

You have created a BM25 index for full-text search.

## Optimize search queries for performance

Use efficient query patterns to leverage BM25 ranking and optimize search performance.

<Procedure>

1. **Perform ranked searches using the distance operator**

   ```sql
   SELECT name, description,
          description <@> to_tpquery('ergonomic work', 'products_search_idx') as score
   FROM products
   ORDER BY description <@> to_tpquery('ergonomic work', 'products_search_idx')
   LIMIT 3;
   ```

1. **Filter results by score threshold**

   ```sql
   SELECT name,
          description <@> to_tpquery('wireless', 'products_search_idx') as score
   FROM products
   WHERE description <@> to_tpquery('wireless', 'products_search_idx') < -2.0;
   ```

1. **Combine with standard SQL operations**

   ```sql
   SELECT category, name,
          description <@> to_tpquery('ergonomic', 'products_search_idx') as score
   FROM products
   WHERE price < 500
     AND description <@> to_tpquery('ergonomic', 'products_search_idx') < -1.0
   ORDER BY description <@> to_tpquery('ergonomic', 'products_search_idx')
   LIMIT 5;
   ```

1. **Verify index usage with EXPLAIN**

   ```sql
   EXPLAIN SELECT * FROM products
   ORDER BY description <@> to_tpquery('wireless keyboard', 'products_search_idx')
   LIMIT 5;
   ```

</Procedure>

You have optimized your search queries for BM25 ranking.

## Build hybrid search with semantic and keyword search

Combine pg_textsearch with pgvector to build powerful hybrid search systems that use both semantic vector search and keyword BM25 search.

<Procedure>

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
   USING pg_textsearch(content)
   WITH (text_config='english');
   ```

1. **Perform hybrid search using Reciprocal Rank Fusion**

   ```sql
   WITH vector_search AS (
       SELECT id,
              ROW_NUMBER() OVER (ORDER BY embedding <=> '[0.1, 0.2, ...]'::vector) AS rank
       FROM articles
       ORDER BY embedding <=> '[0.1, 0.2, ...]'::vector
       LIMIT 20
   ),
   keyword_search AS (
       SELECT id,
              ROW_NUMBER() OVER (ORDER BY content <@> to_tpquery('query performance', 'articles_content_idx')) AS rank
       FROM articles
       ORDER BY content <@> to_tpquery('query performance', 'articles_content_idx')
       LIMIT 20
   )
   SELECT
       a.id,
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

Customize pg_textsearch behavior for your specific use case and data characteristics.

<Procedure>

1. **Configure language-specific text processing**

   ```sql
   -- French language configuration
   CREATE INDEX products_fr_idx ON products_fr
   USING pg_textsearch(description)
   WITH (text_config='french');

   -- Simple tokenization without stemming
   CREATE INDEX products_simple_idx ON products
   USING pg_textsearch(description)
   WITH (text_config='simple');
   ```

1. **Tune BM25 parameters**

   ```sql
   -- Adjust term frequency saturation (k1) and length normalization (b)
   CREATE INDEX products_custom_idx ON products
   USING pg_textsearch(description)
   WITH (text_config='english', k1=1.5, b=0.8);
   ```

1. **Monitor index usage and memory consumption**

   ```sql
   -- Check index usage statistics
   SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read
   FROM pg_stat_user_indexes
   WHERE indexrelid::regclass::text ~ 'pg_textsearch';

   -- View detailed index information
   SELECT tp_debug_dump_index('products_search_idx');
   ```

</Procedure>

You have configured pg_textsearch for optimal performance.

## Understanding BM25 scoring

BM25 scores in pg_textsearch are returned as negative values, where lower (more negative) numbers indicate better matches.

Key concepts:

* **Corpus-aware ranking**: BM25 uses inverse document frequency to weight rare terms higher
* **Term frequency saturation**: Prevents documents with excessive term repetition from dominating results
* **Length normalization**: Adjusts scores based on document length relative to corpus average
* **Relative ranking**: Focus on rank order rather than absolute score values

## Current limitations

The preview release (v0.0.1) focuses on core BM25 functionality:

* **Memory-only storage**: Indexes are limited by `pg_textsearch.index_memory_limit` (default 64MB)
* **Single-column indexes**: Cannot index multiple columns in one index
* **No phrase queries**: Cannot search for exact multi-word phrases yet

These limitations will be addressed in upcoming releases with disk-based segments and expanded query capabilities.

## Best practices

Follow these practices for optimal pg_textsearch performance:

* **Memory planning**: Size your `index_memory_limit` based on corpus vocabulary and document count
* **Language configuration**: Choose appropriate text search configurations for your data language
* **Hybrid search**: Combine with pgvector for applications requiring both semantic and keyword search
* **Query optimization**: Use score thresholds to filter low-relevance results
* **Index monitoring**: Regularly check index usage and memory consumption

For production applications, consider implementing result caching and pagination to improve user experience with large result sets.


[pg_textsearch-repo]: https://github.com/timescale/tapir