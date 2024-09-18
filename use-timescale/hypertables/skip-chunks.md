---
title: Skip chunks on a hypertable
excerpt: How and why to use chunk skipping to optimize hypertable performance
products: [cloud, mst, self_hosted]
keywords: [hypertables, indexes, chunks]
---

# Skip chunks

Hypertables with their built-in chunking allow the planner to access only the necessary chunks to satisfy a query. This works great when queries only use the columns designated for partitioning in `WHERE` clauses. For example, in a hypertable where every day of the year is a separate chunk, a query for September 1 will access only that specific chunk. 

However, many queries use secondary columns in `WHERE` clauses. For example, a table might have two columns: one for when data was gathered and one for when it was added to the database. If you partition by the date of gathering, querying by the added date requires accessing all chunks.

To address this, TimescaleDB allows you to set chunk-skipping indexes on columns of the `smallint`, `int`, `bigint`, `serial`, `bigserial`, `date`, `timestamp`, and `timestamptz` data types. 

After enabling chunk skipping on a column, TimescaleDB tracks the minimum and maximum values for that column in each chunk, excluding chunks where queries would find no relevant data.
 
Minimum/maximum ranges are calculated when compressing a chunk in the hypertable with the `compress_chunk` function. This will allow us to calculate and store minimum/maximum limits for the secondary columns in the metadata. 
 
These ranges are stored in the start (inclusive) and end (exclusive) format in the `chunk_column_stats` catalog table and used for dynamic chunk exclusion when the `WHERE` clause of an SQL query specifies ranges on the column. This means the column ranges in the catalog table are stored at the per-chunk level, with no active role in the data partitioning.

You can add as many chunk-skipping indexes on additional columns as you need. The best practice is to enable these indexes on columns correlated to the partitioning column and referenced in `WHERE` clauses.

