---
title: Querying Tiered Data
excerpt: How to query tiered data
product: [ cloud ]
keywords: [ tiered storage, tiering ]
tags: [ storage, data management ]
---

# Querying tiered data

Once rarely used data is tiered and migrated to the object storage tier, it can still be queried 
with standard SQL by enabling the `timescaledb.enable_tiered_reads` GUC. 
By default, the GUC is set to `false`, so that queries do not touch tiered data.

The `timescaledb.enable_tiered_reads` GUC, or Grand Unified Configuration variable, is a setting 
that controls if tiered data is queried. The configuration variable can be set at different levels,
 including globally for the entire database server, for individual databases, and for individual 
sessions.

With tiered reads enabled, you can query your data normally even when it's distributed across different storage tiers.
Your hypertable is spread across the tiers, so queries and `JOIN`s work and fetch the same data as usual.

By default, tiered data is not accessed by queries. Querying tiered data may slow down query performance 
as the data is not stored locally on Timescale's high-performance storage tier. See [Performance considerations](#performance-considerations).

## Enable querying tiered data for a single query

<Procedure>

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

## Enable querying tiered data for a single session

All future queries within a session can be enabled to use the object storage tier by enabling `timescaledb.enable_tiered_reads` within a session. 

<Procedure>

1. Enable `timescaledb.enable_tiered_reads` for an entire session:

    ```sql
    set timescaledb.enable_tiered_reads = true;
    ```

    All future queries in that session are configured to read from tiered data and locally stored data.    

</Procedure>


## Enable querying tiered data in all future sessions

You can also enable queries to read from tiered data always by following these steps:

<Procedure>

1. Enable `timescaledb.enable_tiered_reads` for all future sessions:

   ```sql
   alter database tsdb set timescaledb.enable_tiered_reads = true;
   ```

   In all future created sessions, `timescaledb.enable_tiered_reads` initializes with `enabled`. 

</Procedure>

## Query data in the object storage tier

This section illustrates how querying tiered storage works.

Consider a simple database with a standard `devices` table and a `metrics` hypertable. After enabling tiered storage, you can see which chunks are tiered to the object storage tier:

```sql
    chunk_name    |      range_start       |       range_end        
------------------+------------------------+------------------------
 _hyper_2_4_chunk | 2015-12-31 00:00:00+00 | 2016-01-07 00:00:00+00
 _hyper_2_3_chunk | 2017-08-17 00:00:00+00 | 2017-08-24 00:00:00+00
(2 rows)
```

The following query fetches data only from the object storage tier. This makes sense based on the
`WHERE` clause specified by the query and the chunk ranges listed above for this
hypertable.

```sql
 EXPLAIN SELECT * FROM metrics where ts < '2017-01-01 00:00+00';
                             QUERY PLAN                              
---------------------------------------------------------------------
 Foreign Scan on osm_chunk_2  (cost=0.00..0.00 rows=2 width=20)
   Filter: (ts < '2017-01-01 00:00:00'::timestamp without time zone)
   Match tiered objects: 1
   Row Groups:
     _timescaledb_internal._hyper_2_4_chunk: 0
(5 rows)
```

If your query does not need to touch the object storage tier, it will only
process the chunks in the standard storage. The following query refers to newer data that is not yet tiered to the object storage tier.
`Match tiered objects :0 ` in the plan indicates that no tiered data matches the query constraint. So data in the object storage is not touched at all.

```sql
 EXPLAIN SELECT * FROM metrics where ts > '2022-01-01 00:00+00';
                                                    QUERY PLAN                  
                                  
--------------------------------------------------------------------------------
----------------------------------
 Append  (cost=0.15..25.02 rows=568 width=20)
   ->  Index Scan using _hyper_2_5_chunk_metrics_ts_idx on _hyper_2_5_chunk  (co
st=0.15..22.18 rows=567 width=20)
         Index Cond: (ts > '2022-01-01 00:00:00'::timestamp without time zone)
   ->  Foreign Scan on osm_chunk_2  (cost=0.00..0.00 rows=1 width=20)
         Filter: (ts > '2022-01-01 00:00:00'::timestamp without time zone)
         Match tiered objects: 0
         Row Groups:
(7 rows)
```

Here is another example with a `JOIN` that does not touch tiered data:

```sql
 EXPLAIN SELECT ts, device_id, description FROM metrics
   JOIN devices ON metrics.device_id = devices.id
   WHERE metrics.ts > '2023-08-01'; 
                            QUERY PLAN            
                                              
--------------------------------------------------------------------------------
 Hash Join  (cost=32.12..184.55 rows=3607 width=44)
   Hash Cond: (devices.id = _hyper_4_9_chunk.device_id)
   ->  Seq Scan on devices  (cost=0.00..22.70 rows=1270 width=36)
   ->  Hash  (cost=25.02..25.02 rows=568 width=12)
         ->  Append  (cost=0.15..25.02 rows=568 width=12)
               ->  Index Scan using _hyper_4_9_chunk_metrics_ts_idx on _hyper_4_
9_chunk  (cost=0.15..22.18 rows=567 width=12)
                     Index Cond: (ts > '2023-08-01 00:00:00+00'::timestamp with 
time zone)
               ->  Foreign Scan on osm_chunk_3  (cost=0.00..0.00 rows=1 width=12
)
                     Filter: (ts > '2023-08-01 00:00:00+00'::timestamp with time
 zone)
                     Match tiered objects: 0
                     Row Groups:
(11 rows)
```


## Performance considerations

Queries over tiered data are expected to be slower than over local data. However, in a limited number of scenarios tiered reads can impact query planning time over local data as well. In order to prevent any unexpected performance degradation for application queries, we keep the GUC `timescaledb.enable_tiered_reads` set to `false`.

* Queries without time boundaries specified are expected to perform slower when querying tiered data, both during query planning and during query execution. Timescale's chunk exclusion algorithms cannot be applied for this case.

  ```sql
  SELECT * FROM device_readings WHERE id = 10;
  ```

* Queries with predicates computed at runtime (such as `NOW()`) are not always optimized at 
  planning time and as a result might perform slower than statically assigned values
  when querying against the object storage tier.

  For example, this query is optimized at planning time:

  ```sql
  SELECT * FROM metrics WHERE ts > '2023-01-01' AND ts < '2023-02-01' 
  ```

  The following query does not do chunk pruning at query planning time:

  ```sql
  SELECT * FROM metrics WHERE ts < now() - '10 days':: interval
  ```

  At the moment, queries against tiered data work best when the query optimizer can apply planning time optimizations.

* Text and non-native types (JSON, JSONB, GIS) filtering is slower when querying tiered data.

