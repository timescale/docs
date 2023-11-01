---
title: Querying Tiered Data
excerpt: How to query tiered data
product: [ cloud ]
keywords: [ data tiering, tiering ]
tags: [ storage, data management ]
---

# Querying tiered data

<!-- vale Google.Acronyms = NO -->
<!-- vale Google.Headings = NO -->

Once rarely used data is tiered and migrated to low cost object storage it can still be queried 
with standard SQL by enabling the `timescaledb.enable_tiered_reads` GUC. 

The `timescaledb.enable_tiered_reads` GUC, or Grand Unified Configuration variable, is a setting 
that controls if tiered data is queried. The configuration variable can be set at different levels,
 including globally for the entire database server, for individual databases, and for individual 
sessions.

With data tiering reads enabled, query your data normally even when it's distributed across different storage layers. Your hypertable is
spread across the layers, so queries and `JOIN`s work and fetch the same data as usual.

<!-- vale Google.Acronyms = YES -->

<Highlight type="warning">
By default, tiered data is not accessed by queries. Querying tiered data may slow down query performance as the data is not stored locally.     
</Highlight>


<Procedure>

### querying tiered data in a single query

1. Enable `timescaledb.enable_tiered_reads` before querying the hypertable with tiered data and reset it after it is complete:

```sql
set timescaledb.enable_tiered_reads = true; SELECT count(*) FROM example; set timescaledb.enable_tiered_reads = false;
```

This queries data from all chunks including tiered chunks and non tiered chunks: 

   ```sql
   ||count|
   |---|
   |1000|
   ```

</Procedure>



### Querying tiered data for an entire session

All future queries within a session can be enabled to use data tiering by enabling `timescaledb.enable_tiered_reads` within a session. 

<Procedure>

1. Enable `timescaledb.enable_tiered_reads` for an entire session:

```sql
set timescaledb.enable_tiered_reads to true;
```

1. All future queries in that session are configured to read from tiered data and locally stored data.    

</Procedure>


### Querying tiered data in all future sessions

You can also enable queries to read from tiered data always by following these steps:

<Procedure>

1. Enable `timescaledb.enable_tiered_reads` for all future sessions:

```sql
alter database tsdb set timescaledb.enable_tiered_reads to true;
```

1.  In all future created sessions, timescaledb.enable_tiered_reads initializes with enabled. 

</Procedure>

## Performance considerations

Queries over tiered data is expected to be slower than over local data. However, in a limited number of scenarios data tiering can impact query planning time over local data as well. 

* Queries without time boundaries specified are expected to perform slower when querying tiered data, both during query planning and during query execution.

* Queries with predicates computed at runtime (such as `NOW()`) are not always optimized at 
planning time and as a result might perform slower than statically assigned values when
 querying against S3.
For example, this query is optimized at planning time
```
SELECT * FROM metrics WHERE ts > '2023-01-01' AND ts < '2023-02-01' 
```

and this query does not do chunk pruning at query planning time.
```
SELECT * FROM metrics WHERE ts < now() - '10 days':: interval
```

At the moment, queries against tiered data work best when the query optimizer can apply 
planning time optimizations.

<!-- vale Google.Acronyms = NO -->
* Text and non-native types (JSON, JSONB, GIS) filtering is slower with data tiering.
<!-- vale Google.Acronyms = YES -->

