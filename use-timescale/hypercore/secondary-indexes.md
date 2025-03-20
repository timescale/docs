---
title: Improve query and upsert performance using secondary indexes
excerpt: Using secondary indexes on data in the columnstore make lookup queries 1,185x and upserts 224x faster
products: [cloud, mst, self_hosted]
keywords: [hypertable, compression, row-columnar storage, hypercore]
---

import EarlyAccess from "versionContent/_partials/_early_access.mdx";

# Improve query and upsert performance using secondary indexes

Real-time analytics applications require more than fast inserts and analytical queries. They also need high performance
when retrieving individual records, enforcing constraints, or performing upserts, something that OLAP/columnar databases
lack.

$TIMESCALE_DB supports and accelerates real-time analytics using [Hypercore][hypercore] without missing out on important  
PostgreSQL features, including support for standard PostgreSQL indexes. Hypercore is a hybrid storage engine 
because it supports deep analytics while staying true to PostgreSQL. Full support for B-tree and hash indexes
on columnstore data enables you to perform point lookups 1,185x faster, enforce unique constraints, and execute
upserts 224x faster—all while maintaining columnstore compression and analytics performance.

<EarlyAccess />

## Choose the best indexing method

[Indexes are a fundamental part of database performance optimization][blog-perf-tuning], they enable queries to 
quickly locate and retrieve data without scanning entire tables. B-tree and hash indexes are among PostgreSQL’s 
most widely used index types. However, they are designed for different query types:

- [B-tree indexes][b-tree-overview]: keep data sorted in a hierarchical structure ideal for queries that involve 
   range (>, <, BETWEEN) and equality (=) lookups. A B-tree index enables you to check unique constraints or for 
   range-based filtering. You quickly retrieve and filter the relevant rows without scanning all the data.

   When a query searches for a specific value or a range of values in an indexed column, the B-tree structure
   enables the database to quickly traverse the tree and find the relevant records in logarithmic time (`O(log n)`),
   significantly improving performance compared to a full table scan.

- [Hash indexes][hash-overview]: designed for exact-match lookups (=) and use a hashing function to map values to
  unique disk locations. When searching for a specific ID, a hash index allows direct access to the data with
  minimal overhead, and provides the fastest results

  When a query searches for a single value, such as searching for transaction by transaction ID, hash
  indexes can be even faster than B-tree indexes as they don’t require tree traversal and have an amortized constant
  (`O(1)`) lookup. Hash indexes don’t support range queries, they are ideal specifically for cases with
  frequently queried, unique keys.

The performance advantage from these indexing methods comes from optimized data structures designed for efficient key 
searching. This results in fewer disk page reads, which in turn reduces I/O spikes when locating specific data points 
or enforcing uniqueness. 

## How B-tree and hash indexes work 

PostgreSQL offers [multiple index types][postgres-index-types], For example, the default B-tree, hash, GIN, and BRIN. 
all implemented as Index Access Methods (IAMs). PostgreSQL supplies the [table access method (TAM)][postgres-tam-methods] 
interface for table storage. 

![TAM architecture](https://assets.timescale.com/docs/images/tam_architecture.png)

By default, $TIMESCALE_DB stores data in the rowstore in standard PostgreSQL row-oriented tables, using the default heap 
TAM. To make the heap TAM work with the columnstore, $TIMESCALE_DB integrates PostgreSQL [TOAST][storage-toast] to store 
columnar data as compressed arrays. However, querying columnized data returns compressed, opaque data. To support 
normal queries, $TIMESCALE_DB adds the `DecompressChunk` scan node to the PostgreSQL query plan in order to decompress data 
on-the-fly. However, the heap TAM only indexes the compressed values, not the original data.

Hypercore TAM handles decompression behind the scenes. This enables PostgreSQL to use standard interfaces for 
indexing, to collect statistics, enforce constraints and lock tuples by reference. This also allows PostgreSQL’s built-in
scan nodes, such as sequential and index scans, to operate on the columnstore. Custom scan nodes are used for 
analytical query performance optimizations, including vectorized filtering and aggregation.

Hypercore TAM supports B-tree and hash indexes, making point lookups, upserts, and unique constraint 
enforcement more efficient on the columnstore. Our benchmarks demonstrate substantial performance improvements:

* 1,185x faster point lookup queries to retrieve a single record
* 224.3x faster inserts when checking unique constraints
* 2.6x faster upserts
* 4.5x faster range queries

## When to use B-tree and hash indexes

Adding B-tree and hash indexes to compressed data enables dramatically faster lookups and inserts, but it comes with 
a trade-off: increased storage usage due to additional indexing structures.

B-tree and hash indexes are particularly helpful when:

- You need fast lookups on non-`SEGMENTBY` keys. For example, querying specific records by UUID
- Query latency on compressed data is a bottleneck for your application
- You perform frequent updates to historical data and need efficient uniqueness enforcement.

However, consider the storage tradeoff when:

- Your queries already benefit from columnstore min/max indexes or `SEGMENTBY` optimizations
- Your workloads prioritize compression efficiency over lookup speed
- You primarily run aggregations and range scans, where indexes may not provide meaningful speedups


## Enable secondary indexing

To speed up your queries using secondary indexes you enable hypercore TAM on your hypertable in the columnstore:

<Procedure>

1. **Create a table with the desired columns and constraints**
   ```sql
   create table readings (
      metric_uuid uuid default gen_random_uuid(),
      created_at timestamptz not null,
      uploaded_at timestamptz not null,
      location_id integer references locations (location_id),
      device_id integer references devices (device_id),
      temperature float,
      humidity float
   );
   ```

1. **Convert the table to a [hypertable][convert-to-hypertable]**

   ```sql
   select create_hypertable (
     'readings',
     by_range('uploaded_at')
   );
   ```
   
1. **Enable hypercore TAM for the hypertable**
   ```sql
   alter table readings
   set access method hypercore
   set (
      timescaledb.orderby = 'created_at',
      timescaledb.segmentby = 'location_id'
   );
   ```
   This enables the columnstore on the table. Hypercore TAM is applied to chunks created after you set the access 
   method. Existing chunks continue to use the default `heap`. 

   To return to the `heap` TAM, call `set access method heap`. You can also change the table access method for an 
   existing chunk with a call like `ALTER TABLE _timescaledb_internal._hyper_1_1_chunk SET ACCESS METHOD hypercore;`

1. **Move chunks from rowstore to columnstore as they age**

   ```sql
   CALL add_columnstore_policy(
      readings,
      interval '1 day'
   );
   ```

</Procedure>

Hypercore TAM is now active on all new chunks created in the hypertable. 

## Create b-tree and hash indexes

Once you have enabled hypercore TAM in your hypertable, the indexes are rebuilt when the table chunks are converted from 
the rowstore to the columnstore. When you query data, these indexes are used by the PostgreSQL query planner over the 
rowstore and columnstore.

You add hash and B-tree indexes to a hypertable the same way as a regular PostgreSQL table:

- **Hash index**
   ```sql
   CREATE INDEX readings_metric_uuid_hash_idx ON readings USING hash (metric_uuid);
   ```
- **B-tree index**
   ```sql 
   CREATE UNIQUE INDEX readings_metric_uuid_metric_uuid_uploaded_at_idx
   ON readings (metric_uuid, uploaded_at);
  ```
  
If you have existing chunks that have not been updated to use the hypercore TAM, to use B-tree and hash indexes, you
change the table access method for an existing chunk with a call like `ALTER TABLE _timescaledb_internal._hyper_1_1_chunk SET ACCESS METHOD hypercore;`

## Point lookups

Indexes are particularly useful for highly selective queries, such as retrieving a unique event by its identifier.
For example:

```sql
SELECT 
    created_at,
    device_id,
    temperature
FROM readings 
WHERE metric_uuid = 'dd19f5d3-d04b-4afc-a78f-9b231fb29e52';
```

Without an index, a query scans and filters the entire dataset, leading to slow execution and high I/O usage.
Min/max sparse indexes help when with incremental numeric IDs but do not work well for random numeric values or UUIDs.

Set a hash index on `metric_uuid` to enable a direct lookup. This significantly improves performance by decompressing 
only the relevant data segment.

```sql
CREATE INDEX readings_metric_uuid_hash_idx ON readings USING hash (metric_uuid);
```

With a hash index and hypercore TAM enabled, the same SELECT query performs 1,185x faster; hash comes in at 10.9 ms vs. 
12,915 ms and B-tree at 12.57.


## Backfill and updates to historical data

A common use case in real-time applications is backfilling or updating old data. For example, a sensor fails 
during a batch upload or gets temporarily disconnected, it resends the data later. To avoid possible duplicate
records, you have to check if the data already exists in the database before storing it.

To prevent duplicate entries, you enforce uniqueness using a primary key. Primary constraints are enforced through 
unique indexes, making conflict checks fast. Without an index, verifying uniqueness involves scanning and decompressing 
potentially large amounts of data. This significantly slows inserts and consuming excessive [IOPS][iops]. A `UNIQUE` 
constraint on a hypertable must also include the hypertable partition key. 

The following `UNIQUE` uses a B-tree index.

```sql
CREATE UNIQUE INDEX readings_metric_uuid_metric_uuid_created_at_idx
    ON readings (metric_uuid, created_at);
```    

Possible strategies for backfilling historic data include:

- **Insert data when the row does not exist**: 

   An insert statement ensuring no duplicates looks like:
   
   ```sql
   INSERT INTO readings VALUES (...) ON CONFLICT (device_id, created_at) DO NOTHING;
   ```
   Our benchmarks showed this makes inserts 224.3x faster, reducing the execution time from 289,139 ms to 1,289 ms.

- **Insert missing data or update existing data**:

   An upsert is a database operation that inserts a new row if it does not already exist, or updates the existing row 
   if a conflict occurs. This enables you to re-ingest new versions of rows instead of performing separate update 
   statements. Without an index, the system needs to scan and decompress data, considerably slowing ingestion speed. 
   With a primary key index, conflicting rows are directly located within the compressed data segment in 
   the columnstore. 
   
   The following query attempts to insert a new record. If a record for the same `metric_uuid` and `created_at` values 
   already exists, it updates `temperature` with the corresponding value from the new record.

   ```sql
   INSERT INTO readings VALUES (...) ON CONFLICT DO UPDATE SET temperature = EXCLUDED.temperature;
   ```
  
   $COMPANY benchmarks showed this makes upserts 2.6x faster, reducing the execution time from 24,805 ms to 9,520 ms.


## Fast anomaly detection

To regularly report the number of times a device has exceeded a critical temperature, you 
count the number of times the temperature was exceeded, and group by device ID.

```sql
SELECT
    device_id,
    COUNT(temperature)
FROM readings
WHERE temperature > 52.5 
GROUP BY device_id;
```

You see something like:

| device_id | count |  
| -- | -- |
68 | 1 | 
| 258 | 1 | 
| 192 | 1 | 
| 276 | 1 | 
| 114 | 1 | 
| 227 | 1 | 
| 153 | 1 | 
| 210 | 1 | 
| 266 | 1 | 
| 165 | 1 | 
| 296 | 1 | 
| 144 | 1 | 
|  93 | 1 | 
| 285 | 1 | 
| 221 | 1 | 
| 167 | 1 | 
|  14 | 1 | 
| 123 | 1 | 
| 152 | 1 | 
| 206 | 1 | 
| 230 | 1 | 
| 136 | 1 | 
| 256 |     2
|   1 | 1 | 
 
To make this query faster, use a partial B-tree index. That is, a B-tree index that only includes rows satisfying a 
specific WHERE condition. This makes a smaller index that is more efficient for queries that match that 
condition. For example, to create a partial B-tree index for temperature readings over 52.5:

```sql
CREATE INDEX ON readings (temperature) where temperature > 52.5;
```   

Compared with using a sparse min/max index in columnstore, $COMPANY benchmarks show that the B-tree index query is
4.5x faster.



[hypercore]: /use-timescale/:currentVersion:/hypercore/
[blog-perf-tuning]: https://www.timescale.com/learn/postgresql-performance-tuning-optimizing-database-indexes
[create-hypertable]: /use-timescale/:currentVersion:/compression/
[b-tree-overview]: https://www.timescale.com/learn/postgresql-performance-tuning-optimizing-database-indexes#:~:text=a%20quick%20summary%3A-,B%2DTree%20indexes%20(default%20index%20type%20in%20PostgreSQL),-CREATE%20INDEX%20index_product_id
[hash-overview]: https://www.timescale.com/learn/postgresql-performance-tuning-optimizing-database-indexes#:~:text=in%20ascending%20order.-,Hash%20indexes,-CREATE%20INDEX%20index_product_id
[storage-toast]: https://www.postgresql.org/docs/current/storage-toast.html
[postgres-index-types]: https://www.timescale.com/learn/database-indexes-in-postgres
[postgres-tam-methods]: https://www.postgresql.org/docs/current/tableam.html
[convert-to-hypertable]: /use-timescale/:currentVersion:/hypertables/create/
[iops]: https://en.wikipedia.org/wiki/IOPS
