---
title: Improve query and upsert performance
excerpt: Use segmenting and ordering data in the columnstore to make lookup queries 1,185x and upserts 224x faster
products: [cloud, self_hosted]
keywords: [hypertable, compression, row-columnar storage, hypercore]
---

# Improve query and upsert performance

Real-time analytics applications require more than fast inserts and analytical queries. They also need high performance
when retrieving individual records, enforcing constraints, or performing upserts, something that OLAP/columnar databases
lack. This pages explains how to improve performance by segmenting and ordering data.

To improve query performance using indexes for a production environment, see [About indexes][about-index] and [Indexing data][create-index].

## Segmenting and ordering data

To optimize query performance, $TIMESCALE_DB enables you to explicitly control the way your data is physically organized 
in the $COLUMNSTORE. By structuring data effectively, queries can minimize disk reads and execute more efficiently, using
vectorized execution for parallel batch processing where possible.

<center>
<img
  class="main-content__illustration"
  width="80%"
  src="https://assets.timescale.com/docs/images/columnstore-segmentby.png"
  alt=""
/>
</center>

* **Group related data together to improve scan efficiency**: organizing rows into logical segments ensures that queries 
   filtering by a specific value only scan relevant data sections. For example, in the above, querying for a specific ID 
   is particularly fast. 
* **Sort data within segments to accelerate range queries**: defining a consistent order reduces the need for post-query 
  sorting, making time-based queries and range scans more efficient. 
* **Reduce disk reads and maximize vectorized execution**: a well-structured storage layout enables efficient batch 
  processing (Single Instruction, Multiple Data, or SIMD vectorization) and parallel execution, optimizing query performance.

By combining segmentation and ordering, $TIMESCALE_DB ensures that columnar queries are not only fast but also 
resource-efficient, enabling high-performance real-time analytics.


### Improve performance in the $COLUMNSTORE by segmenting and ordering data 

Ordering data in the $COLUMNSTORE has a large impact on the compression ratio and performance of your queries. 
Rows that change over a dimension should be close to each other. As $HYPERTABLEs contain time-series data, 
they are partitioned by time. This makes the time column a perfect candidate for ordering your data since the 
measurements evolve as time goes on.

If you use `orderby` as your only columnstore setting, you get a good enough compression ratio to save a lot of 
storage and your queries are faster. However, if you only use `orderby`, you always have to access your data using the 
time dimension, then filter the rows returned on other criteria.  

Accessing the data effectively depends on your use case and your queries. You segment data in the $COLUMNSTORE 
to match the way you want to access it. That is, in a way that makes it easier for your queries to fetch the right data 
at the right time. When you segment your data to access specific columns, your queries are optimized and yield even better performance.

For example, to access information about a single device with a specific `device_id`, you segment on the `device_id` column. 
This enables you to run analytical queries on compressed data in the $COLUMNSTORE much faster.

For example for the following $HYPERTABLE:

```sql
CREATE TABLE metrics (
  time TIMESTAMPTZ,
  user_id INT,
  device_id INT,
  data JSONB
) WITH (
  tsdb.hypertable,
  tsdb.partition_column='time'
);
```

<Procedure>

1. **Execute a query on a regular $HYPERTABLE**
   1. Query your data
      ```sql
      SELECT device_id, AVG(cpu) AS avg_cpu, AVG(disk_io) AS avg_disk_io 
      FROM metrics
      WHERE device_id = 5
      GROUP BY device_id;
      ```
      Gives the following result:
      ```sql
      device_id |      avg_cpu       |     avg_disk_io     
      -----------+--------------------+---------------------
      5 | 0.4972598866221261 | 0.49820356730280524
      (1 row)
      Time: 177,399 ms
      ```

1. **Execute a query on the same data segmented and ordered in the $COLUMNSTORE**

   1. Control the way your data is ordered in the $COLUMNSTORE:
  
      ```sql
      ALTER TABLE metrics SET (
        timescaledb.enable_columnstore = true,
        timescaledb.orderby = 'time',
        timescaledb.segmentby = 'device_id'
      );
      ```

   1. Query your data
      ```sql
       select avg(cpu) from metrics where time >= '2024-03-01 00:00:00+01' and time < '2024-03-02 00:00:00+01';
       ```
      Gives the following result:
      ```sql
      device_id |      avg_cpu      |     avg_disk_io     
      -----------+-------------------+---------------------
      5 | 0.497259886622126 | 0.49820356730280535
      (1 row)
      Time: 42,139 ms
      ```

   As you see, using `orderby` and `segmentby` not only reduces the amount of space taken by your data, but also 
   vastly improves query speed.  

</Procedure>

The number of rows that are compressed together in a single batch (like the ones we see above) is 1000.
If your chunk does not contain enough data to create big enough batches, your compression ratio will be reduced.
This needs to be taken into account when you define your $COLUMNSTORE settings.

[hypercore]: /use-timescale/:currentVersion:/hypercore/
[blog-perf-tuning]: https://www.timescale.com/learn/postgresql-performance-tuning-optimizing-database-indexes
[hash-overview]: https://www.timescale.com/learn/postgresql-performance-tuning-optimizing-database-indexes#:~:text=in%20ascending%20order.-,Hash%20indexes,-CREATE%20INDEX%20index_product_id
[storage-toast]: https://www.postgresql.org/docs/current/storage-toast.html
[postgres-index-types]: https://www.timescale.com/learn/postgresql-performance-tuning-optimizing-database-indexes
[postgres-tam-methods]: https://www.postgresql.org/docs/current/tableam.html
[convert-to-hypertable]: /use-timescale/:currentVersion:/hypertables/hypertable-crud/#create-a-hypertable
[iops]: https://en.wikipedia.org/wiki/IOPS
[segmenting-and-ordering]: /use-timescale/:currentVersion:/hypercore/secondary-indexes/#segmenting-and-ordering-data
[about-index]: /use-timescale/:currentVersion:/schema-management/about-indexing/
[create-index]: https://docs.tigerdata.com/api/latest/hypertable/create_index/
