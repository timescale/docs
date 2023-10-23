---
title: Quick tour of data tiering
excerpt: A tour of the data tiering feature
product: [cloud]
keywords: [data tiering]
tags: [storage, data management]
---

# Data tiering

Timescale offers a new cloud capability to allow users to store data 
long-term on Timescale Cloud in a cost-effective manner. In particular,
 users have the ability to transparently tier hypertables chunks into 
object storage (S3) on Timescale Cloud for highly scalable, long-term storage.

But this is not just an archive! Once tiered, these chunks remain fully and 
directly queryable from within your database using standard SQL. Chunks for a 
given hypertable can now stretch across standard storage (in block form) and 
tiered storage (in object form), but a single SQL query transparently 
pulls data from the appropriate chunks using TimescaleDB’s chunk exclusion algorithms.
 In fact, chunks in object storage are stored in compressed, columnar format 
(in a different format from the internals of the database, for better 
interoperability across various platforms). This format allows for more 
efficient columnar scans across longer time periods, and Timescale uses other 
metadata and query optimizations to reduce the amount of data that needs to be 
fetched from object storage to satisfy a query.

Let's get started!

First, [enable data tiering][enabling-data-tiering] from the UI on Timescale Cloud console.

In an existing database service with a hypertable, you can tier chunks to
 object storage via automated policies on the hypertable, or via manual 
commands on specific chunks. While users will likely adopt automated policies 
in production scenarios, the manual command is a good way to start
experimenting with data tiering.

## Manually tier a specific chunk

Users can move a single chunk to tiered S3 storage by explicitly specifying the chunk’s name.


```
SELECT tier_chunk('_timescaledb_internal._hyper_2_3_chunk');
```

To get the name of a chunk for tiering, you can use the chunks informational 
view. For example:


```
SELECT chunk_schema, chunk_name, range_start, range_end FROM timescaledb_information.chunks WHERE hypertable_name = 'metrics_table';
-[ RECORD 1 ]+-----------------------
chunk_schema | _timescaledb_internal
chunk_name   | _hyper_2_3_chunk
range_start  | 2017-08-02 20:00:00-04
range_end    | 2017-08-09 20:00:00-04

```
Executing the tier_chunk command on a specific chunk does not immediately and 
synchronously move the chunk to tiered storage, but instead schedules the 
chunk for migration. In the background, a cloud service will asynchronously 
migrate the chunk to object storage, and only mark the chunk as migrated 
(and delete it from within the database’s primary storage) once it has been 
durably stored in the tiered storage.

You can view chunks in the tiering queue, that is, chunks that are scheduled
 to be tiered, by using this query.

```
try=# SELECT * FROM timescaledb_osm.chunks_queued_for_tiering ;
-[ RECORD 1 ]-----+-----------------
hypertable_schema | public
hypertable_name   | metrics_table
chunk_name        | _hyper_2_3_chunk
```

For smaller chunks, this asynchronous migration should happen within seconds or
a few minutes, although the chunk will remain fully queryable while it is being
 migrated: the database engine continues to access the chunk in primary storage
 until it fully switches over to use the chunk in tiered storage. And yes, 
you can tier a compressed chunk seamlessly, although it uses a different 
storage representation once tiered to object storage.


## Automate through a data tiering policy

Users can create a data tiering policy to automate moving data to object 
storage, such that any chunks whose time range falls before the move_after 
threshold will be moved to object storage. This interval-threshold-based 
policy is similar to age thresholds with compression and data retention policies.  

The data tiering policy operates at a chunk level, such that the policy starts 
up a job periodically that will asynchronously move SELECTed chunks over to 
object storage. By default, the tiering policy runs hourly on your database; 
this can be modified via alter_job. 

Example:

```
	SELECT add_tiering_policy('metrics', INTERVAL '4 weeks');
```

We also provide a [remove tiering policy][creating-data-tiering-policy] interface if you want to stop tiering 
data.

This function removes the background job that automates tiering. Any chunks 
that were already moved to object storage will remain there, however. Any 
chunks that are scheduled for tiering will also not be affected by this command. 

## List a set of tiered chunks

You can review the set of chunks that are tiered into object storage via a 
standard informational view within the database:

```
 SELECT * FROM timescaledb_osm.tiered_chunks;

-[ RECORD 1 ]-----+-----------------------
hypertable_schema | public
hypertable_name   | metrics
chunk_name        | _hyper_1_4_chunk
range_start       | 2022-04-28 00:00:00+00
range_end         | 2022-05-05 00:00:00+00
-[ RECORD 2 ]-----+-----------------------
hypertable_schema | public
hypertable_name   | metrics
chunk_name        | _hyper_1_1_chunk
range_start       | 2022-05-26 00:00:00+00
range_end         | 2022-06-02 00:00:00+00
```

## Querying data in tiered storage

Once a hypertable is tiered across storage, you can continue to query it as 
normal, including JOINing it with other relational tables, and all that SQL 
goodness.

Consider a simple database with a standard devices table and a metrics hypertable.

```
CREATE TABLE devices ( id integer, description text);
CREATE TABLE metrics ( ts timestamp with time zone, device_id integer, val float);
SELECT create_hypertable('metrics', 'ts');
```

Once you insert data into the tables, you can then tier some of the hypertable’s data to object storage. A simple query against the informational view illustrates which chunks are tiered to object storage.

```
 SELECT chunk_name, range_start, range_end FROM timescaledb_osm.tiered_chunks where hypertable_name = 'metrics';
    chunk_name    |      range_start       |       range_end        
------------------+------------------------+------------------------
 _hyper_2_4_chunk | 2015-12-31 00:00:00+00 | 2016-01-07 00:00:00+00
 _hyper_2_3_chunk | 2017-08-17 00:00:00+00 | 2017-08-24 00:00:00+00
(2 rows)

```

By default, querying tiered storage is disabled. Lets first enable this and 
then run the query. See [querying tiered data][querying-tiered-data] for 
detailed steps on enabling reads from tiered storage.
```
set timescaledb.enable_tiered_reads = true;
```

This query fetches data only from tiered storage. This makes sense based on the
WHERE clause specified by the query an the chunk ranges listed above for this
hypertable.
```
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

If your query predicate never needs to touch object storage, it will only 
process those chunks stored in regular storage; in this case, the time 
predicate refers to newer data that is not yet tiered to object storage.
This query does not touch tiered storage at all. We know that because 
`Match tiered objects :0 ` in the plan indicates that no tiered data matches
 the query constraint.

```
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

Here is another example with a JOIN that does not touch tiered data.

```
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

## Digging deeper into querying tiered data
Lets dig a bit deeper into how data is organized on S3. When chunks are tiered 
they are written out as Parquet objects. Parquet is a columnar storage format.
Within a Parquet file, we group a set of rows together to form a row group.
Within the row group, values for a single column (across multiple rows) are 
stored together. The query planner optimizes object storage access at
 multiple stages:
1. Chunk pruning - match only chunks that satisfy the query constraints.
This is done by looking at the hypertable's dimension column metadata, typically a timestamp.
2. Row group pruning - Identify the row groups within the Parquet object that satisfy the query.
3. Column pruning - Fetch only columns that are requested by the query.

The following query is against a bigger data set tiered on S3 and you can see
the query optimizations in action here.
EXPLAIN will illustrate which chunks are being pulled in from object storage.
First, we only fetch data from chunks 42, 43 and 44 from object storage. Then
 we prune row groups and limit the fetch to a subset of the offsets in the
 Parquet object that potentially match the query filter. We only fetch the data
for the columns device_uuid, sensor_id and observed_at as the query needs
only these 3 columns.

```
EXPLAIN ANALYZE 
SELECT count(*) FROM
( SELECT device_uuid,  sensor_id FROM public.device_readings 
  WHERE observed_at > '2023-08-28 00:00+00' and observed_at < '2023-08-29 00:00+00' 
  GROUP BY device_uuid,  sensor_id ) q;
            QUERY PLAN                                                                  
           
-------------------------------------------------------------------------------------------------
 Aggregate  (cost=7277226.78..7277226.79 rows=1 width=8) (actual time=234993.749..234993.750 rows=1 loops=1)
   ->  HashAggregate  (cost=4929031.23..7177226.78 rows=8000000 width=68) (actual time=184256.546..234913.067 rows=1651523 loops=1)
         Group Key: osm_chunk_1.device_uuid, osm_chunk_1.sensor_id
         Planned Partitions: 128  Batches: 129  Memory Usage: 20497kB  Disk Usage: 4429832kB
         ->  Foreign Scan on osm_chunk_1  (cost=0.00..0.00 rows=92509677 width=68) (actual time=345.890..128688.459 rows=92505457 loops=1)
               Filter: ((observed_at > '2023-08-28 00:00:00+00'::timestamp with time zone) AND (observed_at < '2023-08-29 00:00:00+00'::timestamp with t
ime zone))
               Rows Removed by Filter: 4220
               Match tiered objects: 3
               Row Groups:
                 _timescaledb_internal._hyper_1_42_chunk: 0-74
                 _timescaledb_internal._hyper_1_43_chunk: 0-29
                 _timescaledb_internal._hyper_1_44_chunk: 0-71
               S3 requests: 177
               S3 data: 224423195 bytes
 Planning Time: 6.216 ms
 Execution Time: 235372.223 ms
(16 rows)
```

## Dropping tiered data
You can drop tiered data by using the Timescale [data retention policy and API ][about-data-retention]

[enabling-data-tiering]: /use-timescale/:currentVersion:/data-tiering/enabling-data-tiering/
[querying-tiered-data]: /use-timescale/:currentVersion:/data-tiering/querying-tiered-data/
[creating-data-tiering-policy]: /use-timescale/:currentVersion:/data-tiering/creating-data-tiering-policy/
[about-data-retention]: /use-timescale/:currentVersion:/data-retention/about-data-retention
