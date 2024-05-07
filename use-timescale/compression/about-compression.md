---
title: About compression
excerpt: How to compress hypertables
products: [self_hosted]
keywords: [compression, hypertables]
---

import CompressionIntro from 'versionContent/_partials/_compression-intro.mdx';

# About compression

<CompressionIntro />

This section explains how to enable native compression, and then goes into
detail on the most important settings for compression, to help you get the
best possible compression ratio.

## Key aspects of compression

Every table has a different schema but they do share some commonalities that you need to think about.

Consider the table `metrics` with the following attributes:

|Column|Type|Collation|Nullable|Default|
|-|-|-|-|-|
 time|timestamp with time zone|| not null|
 device_id| integer|| not null|
 device_type| integer|| not null|
 cpu| double precision|||
 disk_io| double precision|||

All hypertables have a primary dimension which is used to partition the table into chunks. The primary dimension is given when [the hypertable is created][create-hypertable]. In the example below, you can see a classic time-series use case with a `time` column as the primary dimension. In addition, there are two columns `cpu` and `disk_io` containing the values  that are captured over time and a column `device_id` for the device that captured the values.
Columns can be used in a few different ways:
- You can use values in a column as a lookup key, in the example above `device_id` is a typical example of such a column.
- You can use a column for partitioning a table. This is typically a time column like `time` in the example above, but it is possible to partition the table using other types as well.
- You can use a column as a filter to narrow down on what data you select. The column `device_type` is an example of where you can decide to look at, for example, only solid state drives (SSDs).
The remaining columns are typically the values or metrics you are collecting. These are typically aggregated or presented in other ways. The columns `cpu` and `disk_io` are typical examples of such columns.

<CodeBlock canCopy={false} showLineNumbers={false} children={`
SELECT avg(cpu), sum(disk_io)
FROM metrics
WHERE device_type = ‘SSD’
AND time >= now() - ‘1 day’::interval;
`} />

When chunks are compressed in a hypertable, data stored in them is reorganized and stored in column-order rather than row-order. As a result, it is not possible to use the same uncompressed schema version of the chunk and a different schema must be created. This is automatically handled by TimescaleDB, but it has a few implications:
The compression ratio and query performance is very dependent on the order and structure of the compressed data, so some considerations are needed when setting up compression.
Indexes on the hypertable cannot always be used in the same manner for the compressed data.

<Highlight type="note">
Indexes set on the hypertable are used only on chunks containing uncompressed
data. Timescale creates and uses custom indexes to incorporate the `segmentby` 
and `orderby` parameters during compression which are used when reading compressed data.
More on this in the next section.
</Highlight>

Based on the previous schema, filtering of data should happen over a certain time period and analytics are done on device granularity. This pattern of data access lends itself to organizing the data layout suitable for compression.

### Ordering and segmenting.

Ordering the data will have a great impact on the compression ratio and performance of your queries. Rows that change over a dimension should be close to each other. Since we are mostly dealing with time-series data, time dimension is a great candidate. Most of the time data changes in a predictable fashion, following a certain trend. We can exploit this fact to encode the data so it takes less space to store. For example, if you order the records over time, they will get compressed in that order and subsequently also accessed in the same order.

Using the following configuration setup on our example table:
<CodeBlock canCopy={false} showLineNumbers={false} children={`
ALTER TABLE metrics 
SET (timescaledb.compress, timescaledb.compress_orderby='time');
`} />

would produce the following data layout. 

|Timestamp|Device ID|Device Type|CPU|Disk IO|
|-|-|-|-|
|[12:00:01, 12:00:01, 12:00:02, 12:00:02, 12:00:03, 12:00:03]|[A, B, A, B, A, B]|[SSD, HDD, SSD, HDD, SSD, HDD]|[70.11, 69.70, 70.12, 69.69, 70.14, 69.70]|[13.4, 20.5, 13.2, 23.4, 13.0, 25.2]|

`time` column is used for ordering data, which makes filtering it using `time` column much more efficient.

<CodeBlock canCopy={false} showLineNumbers={false} children={`
postgres=# select avg(cpu) from metrics where time >= '2024-03-01 00:00:00+01' and time < '2024-03-02 00:00:00+01';
        avg         
--------------------
 0.4996848437842719
(1 row)
Time: 87,218 ms
postgres=# ALTER TABLE metrics 
SET (
	timescaledb.compress, 
	timescaledb.compress_segmentby = 'device_id',
	timescaledb.compress_orderby='time'
);
ALTER TABLE
Time: 6,607 ms
postgres=# SELECT compress_chunk(c) FROM show_chunks('metrics') c;
             compress_chunk             
----------------------------------------
 _timescaledb_internal._hyper_2_4_chunk
 _timescaledb_internal._hyper_2_5_chunk
 _timescaledb_internal._hyper_2_6_chunk
(3 rows)
Time: 3070,626 ms (00:03,071)
postgres=# select avg(cpu) from metrics where time >= '2024-03-01 00:00:00+01' and time < '2024-03-02 00:00:00+01';
       avg        
------------------
 0.49968484378427
(1 row)
Time: 45,384 ms
`} />

This makes the time column a perfect candidate for ordering your data since the measurements evolve as time goes on. If you were to use that as your only compression setting, you would most likely get a good enough compression ratio to save a lot of storage. However, accessing the data effectively depends on your use case and your queries. With this setup, you would always have to access the data by using the time dimension and subsequently filter all the rows based on any other criteria.

Segmenting the compressed data should be based on the way you access the data. Basically, you want to segment your data in such a way that you can make it easier for your queries to fetch the right data at the right time. That is to say, your queries should dictate how you segment the data so they can be optimized and yield even better query performance.

For example, If you want to access a single device using a specific `device_id` value (either all records or maybe for a specific time range), you would need to filter all those records one by one during row access time. To get around this, you can use device_id column for segmenting. This would allow you to run analytical queries on compressed data much faster if you are looking for specific device IDs.

Consider the following query:

<CodeBlock canCopy={false} showLineNumbers={false} children={`
SELECT device_id, AVG(cpu) AS avg_cpu, AVG(disk_io) AS avg_disk_io 
FROM metrics 
WHERE device_id = 5 
GROUP BY device_id;
`} />

As you can see, the query does a lot of work based on the `device_id` identifier by grouping all its values together. We can use this fact to speed up these types of queries by setting
up compression to segment the data around the values in this column.

Using the following configuration setup on our example table:
<CodeBlock canCopy={false} showLineNumbers={false} children={`
ALTER TABLE metrics 
SET (
	timescaledb.compress, 
	timescaledb.compress_segmentby='device_id', 
	timescaledb.compress_orderby='time'
);
`} />

would produce the following data layout.

|time|device_id|device_type|cpu|disk_io|energy_consumption|
|---|---|---|---|---|---|
|[12:00:02, 12:00:01]|1|[SSD,SSD]|[88.2, 88.6]|[20, 25]|[0.8, 0.85]|
|[12:00:02, 12:00:01]|2|[HDD,HDD]|[300.5, 299.1]|[30, 40]|[0.9, 0.95]|
|...|...|...|...|...|...|


Segmenting column `device_id` is used for grouping data points together based on the value of that column. This makes accessing a specific device much more efficient.

<CodeBlock canCopy={false} showLineNumbers={false} children={`
postgres=# \\timing
Timing is on.
postgres=# SELECT device_id, AVG(cpu) AS avg_cpu, AVG(disk_io) AS avg_disk_io 
FROM metrics 
WHERE device_id = 5 
GROUP BY device_id;
 device_id |      avg_cpu       |     avg_disk_io     
-----------+--------------------+---------------------
         5 | 0.4972598866221261 | 0.49820356730280524
(1 row)
Time: 177,399 ms
postgres=# ALTER TABLE metrics 
SET (
	timescaledb.compress, 
	timescaledb.compress_segmentby = 'device_id', 
	timescaledb.compress_orderby='time'
);
ALTER TABLE
Time: 6,607 ms
postgres=# SELECT compress_chunk(c) FROM show_chunks('metrics') c;
             compress_chunk             
----------------------------------------
 _timescaledb_internal._hyper_2_4_chunk
 _timescaledb_internal._hyper_2_5_chunk
 _timescaledb_internal._hyper_2_6_chunk
(3 rows)
Time: 3070,626 ms (00:03,071)
postgres=# SELECT device_id, AVG(cpu) AS avg_cpu, AVG(disk_io) AS avg_disk_io 
FROM metrics 
WHERE device_id = 5 
GROUP BY device_id;
 device_id |      avg_cpu      |     avg_disk_io     
-----------+-------------------+---------------------
         5 | 0.497259886622126 | 0.49820356730280535
(1 row)
Time: 42,139 ms
`} />

<Highlight type="note">
Number of rows that are compressed together in a single batch (like the ones we see above) is 1000.
If your chunk does not contain enough data to create big enough batches, your compression ratio will be reduced.
This needs to be taken into account when defining your compression settings.
</Highlight> 

[create-hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
