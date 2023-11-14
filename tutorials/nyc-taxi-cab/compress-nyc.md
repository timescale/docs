---
title: Query time-series data tutorial - set up compression
excerpt: Compress the dataset so you can store the NYC taxi trip data more efficiently
products: [cloud, mst, self_hosted]
keywords: [tutorials, query]
tags: [tutorials, beginner]
layout_components: [next_prev_large]
content_group: Analyze NYC taxi cab data
---

# Set up compression and compress the dataset

You have now seen how to create a hypertable for your NYC taxi trip
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
    ALTER TABLE rides 
    SET (
        timescaledb.compress, 
        timescaledb.compress_segmentby='vendor_id', 
        timescaledb.compress_orderby='pickup_datetime DESC'
    );
    ``` 
    To get more details on how to pick the right columns for the job, see [here][segment-by-columns].
1.  Compress all the chunks of the hypertable:
    ```sql
    SELECT compress_chunk(c) from show_chunks('rides') c;
    ```
    This is necessary because we did not [automate compression][automatic-compression] yet.
1.  See the dataset size before and after compression:
    ```sql
    SELECT 
        pg_size_pretty(before_compression_total_bytes) as before,
        pg_size_pretty(after_compression_total_bytes) as after
     FROM hypertable_compression_stats('rides');
    ```
1.  The output should show considerable storage savings, something like this:
    ```sql
    before  | after  
    ---------+--------
    1741 MB | 603 MB
    ```

</Procedure>

## Add a compression policy

To avoid running the compression step each time you have some data to
compress you can set up a compression policy. The compression policy
allows you to compress data that is older than a particular age, for
example, to compress all chunks that are older than 8 days:

```sql
SELECT add_compression_policy('rides', INTERVAL '8 days');
```

Compression policies run on a regular schedule, by default once every
day, which means that you might have up to 9 days of uncompressed data
with the setting above.

You can find more information on compression policies in the
[add_compression_policy][add_compression_policy] section.


## Taking advantage of query speedups


Previously, compression was set up to be segmented by `vendor_id` column value.
This means fetching data by filtering or grouping on that column will be 
more efficient. Ordering is also set to time descending so if you run queries
which try to order data with that ordering, you should see performance benefits. 

For instance, if you run the query example from previous section:
```sql
SELECT rate_code, COUNT(vendor_id) AS num_trips
FROM rides
WHERE pickup_datetime < '2016-01-08'
GROUP BY rate_code
ORDER BY rate_code;
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
    SELECT decompress_chunk(c) from show_chunks('rides') c;
```

On an example setup, speedup performance observed was pretty significant,
700 ms when compressed vs 1,2 sec when decompressed.

Try it yourself and see what you get!


[segment-by-columns]: /use-timescale/:currentVersion:/compression/about-compression/#segment-by-columns
[automatic-compression]: /tutorials/:currentVersion:/nyc-tax-cab/compress-nyc/#add-a-compression-policy
[compression-design]: /use-timescale/:currentVersion:/compression/compression-design/
[add_compression_policy]: /api/:currentVersion:/compression/add_compression_policy/
