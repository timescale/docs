---
title: Analyze financial tick data - set up compression
excerpt: Compress the dataset so you can store the financial tick data more efficiently
products: [cloud, mst, self_hosted]
keywords: [tutorials, finance, learn]
tags: [tutorials, beginner]
layout_components: [next_prev_large]
content_group: Analyze financial tick data
---

# Set up compression and compress the dataset

You have now seen how to create a hypertable for your financial tick
data and query it. When ingesting a dataset like this
is seldom necessary to update old data and over time the amount of
data in the tables grows. Over time you end up with a lot of data and
since this is mostly immutable you can compress it to save space and
avoid incurring additional cost.

It is possible to use disk-oriented compression like the support
offered by ZFS and Btrfs but since TimescaleDB is build for handling
event-oriented data (such as time-series) it comes with support for
compressing data in hypertables.

TimescaleDB compression allows you to store the data in a vastly more
efficient format allowing up to 20x compression ratio compared to a
normal PostgreSQL table, but this is of course highly dependent on the
data and configuration.

TimescaleDB compression is implemented natively in PostgreSQL and does
not require special storage formats. Instead it relies on features of
PostgreSQL to transform the data into columnar format before
compression. The use of a columnar format allows better compression
ratio since similar data is stored adjacently. For more details on how
the compression format looks, you can look at the [compression
design][compression-design] section.

A beneficial side-effect of compressing data is that certain queries
are significantly faster since less data has to be read into
memory.

<Procedure>

## Compression setup

1.  Connect to the Timescale database that contains the Bitcoin dataset.
1.  At the psql prompt, run the ALTER command to enable compression on the hypertable:
    ```sql
    ALTER TABLE stocks_real_time 
    SET (
        timescaledb.compress, 
        timescaledb.compress_segmentby='symbol', 
        timescaledb.compress_orderby='time DESC'
    );
    ``` 
    To get more details on how to pick the right columns for the job, see [here][segment-by-columns].
1.  Compress all the chunks of the hypertable:
    ```sql
    SELECT compress_chunk(c) from show_chunks('stocks_real_time') c;
    ```
    This is necessary because we did not [automate compression][automatic-compression] yet.
1.  See the dataset size before and after compression:
    ```sql
    SELECT 
        pg_size_pretty(before_compression_total_bytes) as before,
        pg_size_pretty(after_compression_total_bytes) as after
     FROM hypertable_compression_stats('stocks_real_time');
    ```
1.  The output should show considerable storage savings, something like this:
    ```sql
    before | after 
    --------+-------
    694 MB | 75 MB
    (1 row)
    ```

</Procedure>

## Automatic compression


If this was a production use-case, you could automate compression by adding a policy which would compress data after a certain age:

```sql
SELECT add_compression_policy('stocks_real_time', INTERVAL '8 days');
```

Previous command would compress the chunks after they reach 8 days of age.


## Taking advantage of query speedups


Previously, compression was set up to be segmented by `symbol` column value.
This means fetching data by filtering or grouping on that column will be 
more efficient. Ordering is also set to time descending so if you run queries
which try to order data with that ordering, you should see performance benefits. 

For instance, if you run the query example from previous section:
```sql
SELECT
    time_bucket('1 day', time) AS bucket,
    symbol,
    FIRST(price, time) AS "open",
    MAX(price) AS high,
    MIN(price) AS low,
    LAST(price, time) AS "close",
    LAST(day_volume, time) AS day_volume
FROM crypto_ticks
GROUP BY bucket, symbol;
```

You should see a decent performance difference when the dataset is compressed and
when is decompressed. Try it yourself by running the previous query, decompressing
the dataset and running it again while timing the execution time. You can enable
timing query times in psql by running:

```sql
    \timing
```

To decompress the whole dataset, run:
```sql
    SELECT decompress_chunk(c) from show_chunks('stocks_real_time') c;
```

On an example setup, speedup performance observed was significant,
3.9 sec when compressed vs 5 sec when decompressed.

Try it yourself and see what you get!


[segment-by-columns]: /use-timescale/:currentVersion:/compression/about-compression/#segment-by-columns
[automatic-compression]: /tutorials/:currentVersion:/blockchain-query/blockchain-compress/#automatic-compression
[compression-design]: /use-timescale/:currentVersion:/compression/compression-design/
