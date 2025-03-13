---
title: Indexing data in Hypercore
excerpt: Use indexes on hybrid row-columnar data
products: [cloud,]
keywords: [hypertable, compression, row-columnar storage, hypercore]
---

import Prereq from "versionContent/_partials/_prereqs-cloud-and-self.mdx";
import HypercoreManualWorkflow from "versionContent/_partials/_hypercore_manual_workflow.mdx";

# SUGGESTION: Best practice for large amounts of data

IAIN: Hi Mats, I left this in here so you do no lose your work. 

Indexes are a central component to designing efficient and performant
databases: they allow unstructured data to be efficiently searched to
find the data of interests and in that way allow efficient execution
of queries.

Indexes are similar to a alpabetical book index: you can quickly find
the right name in the index at the end of the book because it is
alphabetical and it will give you the page and maybe the paragraph
where the name is.

Indexes uses a *key*&mdash;for example the pair first-last name "John,
Doe"&mdash;to search through the index and find the *page*.

## Indexes and Table Access Methods in PostgreSQL 

The keys of an index can be either be a single column, or consist of
multiple colums. For example, using the example hypertable from the
previous chapter:

```sql
create table metrics(
	   metric_id serial,
	   created_at timestamptz not null unique,
	   location_id smallint,
	   device_id bigint,
	   temp float8,
	   humidity float4
);
```

You can then define an index with the name `metrics_device_id_idx` for
the devices, which will allow you to efficiently find the device
information in the `metrics` table.

```sql
create index metrics_device_id_idx on metrics (device_id);
```

In the same way as indexes for books, indexes in PostgreSQL are data
structures that translate keys to a *disk page* and an *offset*, which
are in PostgreSQL called a *tuple identifier* (or just *TID*). The TID
corresponds to the page for the data in the book analogy. You can
imagine that the index is a sorted list of rows like this, with the
keys each in one column and the TID in a separate column with the page
and the offset:

| `device_id` | TID  |
|-------------|------|
|     .       |  .   |
|     .       |  .   |
|     .       |  .   |
| 2           | 5:32 |
| 3           | 6:19 |
| 3           | 7:23 |
| 3           | 4:99 |
| 4           | 1:79 |
| 4           | 4:51 |
| 5           | 2:45 |
| 6           | 1:23 |
|     .       |  .   |
|     .       |  .   |
|     .       |  .   |

When PostgreSQL then want to use the index, it can locate the TIDs for
a particular key. For example, if you execute the query:

```sql
select * from metrics where device_id = 3;
```

PostgreSQL will first use the index to locate all the TIDs for the key
`3` (that is, `6:19`, `7:23`, and `4:99`), but then it need to find
the tuples (the entire row with data) for those TIDs, so how is that
done? The answer is that it is the responsibility of the *table access
method* for the table to figure that out.

Each table in PostgreSQL has an associated table access method. The
default one is called the "heap". The TID is passed to the table
access method in question, which then returns the entire tuple.

You can see the table access method for a table in this manner:

```sql
example=# \d+ metrics
                                                                     Table "public.metrics"
   Column    |           Type           | Collation | Nullable |                  Default                   | Storage | Compression | Stats target | Description 
-------------+--------------------------+-----------+----------+--------------------------------------------+---------+-------------+--------------+-------------
 metric_id   | integer                  |           | not null | nextval('metrics_metric_id_seq'::regclass) | plain   |             |              | 
 created_at  | timestamp with time zone |           | not null |                                            | plain   |             |              | 
 location_id | smallint                 |           |          |                                            | plain   |             |              | 
 device_id   | bigint                   |           |          |                                            | plain   |             |              | 
 temp        | double precision         |           |          |                                            | plain   |             |              | 
 humidity    | real                     |           |          |                                            | plain   |             |              | 
Indexes:
    "metrics_created_at_key" UNIQUE CONSTRAINT, btree (created_at)
Access method: heap
```

Since data for the Hypercore columnstore is stored in a combined row
and columnar format (that is, some data is in row format and some are
in columnar format), Timescale has a dedicated table access method
called `hypercore` that allow chunks of a hypertable to maintain
indexes over the combined row-columnar format that Hypercore uses.

## Creating a new hypertable using Hypercore TAM

This case is normally used if you want to create a new hypertable
where all chunks uses the `hypercore` table access method.

You can create a new hypertable using the Hypercore TAM using the
following steps:

1. Create the table using `CREATE TABLE`, for example, the table
   above.
2. Transform the table into a hypertable using `create_hypertable` and
   use the `created_at` column for partitioning the hypertable.
   
   ```sql
   select create_hypertable('readings', by_range('created_at'));
   ```

3. Configure compression using `alter table` as in the previous
   chapter, but set the table access method to `hypercore`.
   
   ```sql
   alter table metrics
      set access method hypercore,
      set (timescaledb.compress_orderby = 'created_at',
   	       timescaledb.compress_segmentby = 'location_id');
   ```

   Setting the table access method in this manner for a hypertable
   means that any new chunks created when inserting data will use the
   `hypercore` table access method.

4. Set up a policy as in the previous chapter, but tell the policy to
   use the (table) access method to compress the chunks using the
   `hypercore_use_access_method` parameter.

   ```sql
   CALL add_columnstore_policy('metrics', interval '1 day',
        hypercore_use_access_method => true);
   ```

## Changing a single chunk to replaced by Hypercore TAM

If you have an existing hypertable, and want to just change a single
chunk to use the `hypercore` table access method, you can change the
table access method for that chunk only either using `alter table` or
the procedure `convert_to_columnstore`.

This can be useful if you want to experiment with indexing on
compressed data, or if you just want to index some chunks of the
hypertable.

As an example, if you have a chunk
`_timescaledb_internal._hyper_1_21_chunk` (in this case from the
`metrics` table above), you can convert it to a columnstore chunk
using the table access method either by setting the access method:

```sql
alter table _timescaledb_internal._hyper_1_21_chunk
    set access method hypercore;
```

Or using the `convert_to_columnstore` procedure with
`hypercore_use_access_method`:

```sql
call convert_to_columnstore('_timescaledb_internal._hyper_1_21_chunk',
    hypercore_use_access_method => true);
```

This will also rebuild indexes for the chunk if it was compressed, s
