# 7. Create a compression policy

TimescaleDB comes with native compression capabilities which enable you to analyze and query massive amounts of historical time-series data inside a database, while also saving on storage costs. 

TimescaleDB uses best-in-class compression algorithms along with a novel method to create hybrid row/columnar storage. This gives up to 96% lossless compression rates and speeds up common queries on older data. Compressing data increases the amount of time that your data is "useful" (i.e in a database and not in a low-performance object store), without the corresponding increase in storage usage and bill.

<highlight type="tip">

> All postgresql data types can be used in compression.

</highlight>

At a high level, TimescaleDB's built-in job scheduler framework will asynchronously convert recent data from an uncompressed row-based form to a compressed columnar form across chunks of TimescaleDB hypertables.

Let’s set up a compression policy on our hypertable to see how it works.

<highlight type="tip">
* For more information on how native compression in TimescaleDB works, as well as the compression algorithms involved, see this in depth blog post on the topic:  [Building columnar compression in a row-oriented database](https://blog.timescale.com/blog/building-columnar-compression-in-a-row-oriented-database/).
</highlight>

* For an introduction to compression algorithms, see this blog post: [Time-series compression algorithms, explained](https://blog.timescale.com/blog/time-series-compression-algorithms-explained/)

## Create a Compression Policy

Just like with Continuous Aggregates, there are two ways to compress data in TimescaleDB: manually, via a one-time command, or using a compression policy to automatically compress data according to a schedule.

The easiest method to compress data is by using a compression policy. Let’s create a policy to compress all data older than 10 years.

```sql
-- Enable compression
ALTER TABLE weather_metrics SET (
 timescaledb.compress,
 timescaledb.compress_segmentby = 'city_name'
);
```

This enables compression on the hypertable `weather_metrics`. 

The `segmentby` option determines the main key by which compressed data is accessed. In particular, queries that reference the `segmentby` columns in the WHERE clause are very efficient. Thus, it is important to pick the correct set of `segmentby` columns. In this case, we pick `city_name` for the `segmentby` option, since it is common to query older data for just a single city over a long period of time.

<highlight type="tip">
> To learn more about the `segmentby` and `orderby` options for compression in TimescaleDB and how to pick the right columns, see this detailed explanation in the [TimescaleDB compression docs](https://docs.timescale.com/latest/using-timescaledb/compression#react-docs).
</highlight>

We can also view the compression settings for our hypertables by using the `compression_settings` informational view, which returns information about each compression option and its `orderby` and `segmentby` attributes:

```sql
-- See info about compression
SELECT * FROM timescaledb_information.compression_settings;
```

Now that compression is enabled, we need to schedule a policy to automatically compress data according to the settings defined above. We will set a policy to compress data older than 10 years by using the following query:

```sql
-- Add compression policy
SELECT add_compression_policy('weather_metrics', INTERVAL '10 years');
```

Just like for automated policies for continuous aggregates, we can view information and statistics about our compression background job in the following two information views:

```sql
-- Informational view for policy details
SELECT * FROM timescaledb_information.jobs;

-- Informational view for stats from run jobs
SELECT * FROM timescaledb_information.job_stats;
```

**Manual Compression**

While we recommend using compression policies to automated compression data, there might be situations where you need to manually compress chunks. Here’s a query which manually compresses chunks that entirely consist of data older than 10 years:

```sql
---------------------------------------------------
-- Manual compression
---------------------------------------------------
SELECT compress_chunk(i)
FROM show_chunks('weather_metrics', older_than => INTERVAL ' 10 years');
```
We can see the size of the compressed chunks before and after applying compression by using the following query:

```sql
-- See effect of compression
SELECT pg_size_pretty(before_compression_total_bytes) as "before compression",
  pg_size_pretty(after_compression_total_bytes) as "after compression"
  FROM hypertable_compression_stats('weather_metrics');
```

## Benefits of Compression

**Disk Space Savings**

A straightforward benefit of compressing data in TimescaleDB is that you enjoy disk space savings, enabling you to store more data in a fixed amount of disk space than you otherwise would in other databases (e.g [TimescaleDB uses 10% of the disk space to store the same number of time-series metrics as MongoDB](https://blog.timescale.com/blog/how-to-store-time-series-data-mongodb-vs-timescaledb-postgresql-a73939734016/)). 

This is especially beneficial when backups and high-availability replicas are taken into account, as you’d save disk space and storage costs on all databases.

**Better Query Performance**

In addition to saving storage space and costs, compressing data might increase query performance on certain kinds of queries. Compressed data tends to be older data and older data tends to have different query patterns than recent data.

**Newer data tends to be queried in a shallow and wide fashion**. In this case, shallow refers to the length of time and wide refers to the range of columns queried. These are often debugging or "whole system" queries. For example, "Show me all the metrics for all cities in the last 2 days." In this case the uncompressed, row based format that is native to PostgreSQL will give us the best query performance.

**Older data tends to be queried in a deep and narrow fashion.** In this case, deep refers to the length of time and narrow refers to the range of columns queried. As data begins to age, queries tend to become more analytical in nature and involve fewer columns. For example, "Show me the average annual temperature for city A in the past 20 years". This type of queries greatly benefit from the compressed, columnar format.

TimescaleDB’s compression design allows you to get the best of both worlds: recent data is ingested in an uncompressed, row format for efficient shallow and wide queries, and then automatically converted to a compressed, columnar format after it ages and is most often queried using deep and narrow queries. 

Here’s an example of a deep and narrow query on our compressed data. It calculates the average temperature for New York City for all years in the dataset before 2010. Data for these years will be compressed, since we compressed all data older than 10 years with either our policy or the manual compression method above.

```sql
-- Deep and narrow query on compressed data
SELECT avg(temp_c) FROM weather_metrics
WHERE city_name LIKE 'New York'
AND time < '2010-01-01';
```


For more information, see compression docs: [https://docs.timescale.com/latest/using-timescaledb/compression#react-docs](https://docs.timescale.com/latest/using-timescaledb/compression#react-docs)


