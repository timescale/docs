---
title: Query the Bitcoin blockchain - set up compression
excerpt: Compress the dataset so you can store the Bitcoin blockchain more efficiently
products: [cloud]
keywords: [beginner, crypto, blockchain, Bitcoin, finance, analytics]
layout_components: [next_prev_large]
content_group: Query the Bitcoin blockchain
---

# Set up compression and compress the dataset

You have now seen how to create a hypertable for your Bitcoin dataset
and query it for blockchain data. When ingesting a dataset like this
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

In the previous section you learned how to different queries on data
in the `transactions` table, so if you want to compress the data that
table, you follow these step:

1.  Connect to the Timescale database that contains the Bitcoin
    dataset using, for example `psql`.
1.  Enable compression on the table and pick suitable segment-by and
    order-by column using the `ALTER TABLE` command:

    ```sql
    ALTER TABLE transactions 
    SET (
        timescaledb.compress, 
        timescaledb.compress_segmentby='block_id', 
        timescaledb.compress_orderby='time DESC'
    );
    ``` 

    Depending on the choice if segment-by and order-by column you can
    get very different performance and compression ratio. To learn
    more about how to pick the correct columns, see
    [here][segment-by-columns].

1.  You can manually compress all the chunks of the hypertable using
    `compress_chunk` in this manner:

    ```sql
    SELECT compress_chunk(c) from show_chunks('transactions') c;
    ```

    You can also [automate compression][automatic-compression] by
    adding a [compression policy][add_compression_policy] which will
    be covered below.

1.  Now that you have compressed the table you can compare the size of
    the dataset before and after compression:

    ```sql
    SELECT 
        pg_size_pretty(before_compression_total_bytes) as before,
        pg_size_pretty(after_compression_total_bytes) as after
     FROM hypertable_compression_stats('transactions');
    ```

	This shows a significant improvement in data usage:

    ```sql
     before  | after  
    ---------+--------
    1307 MB | 237 MB   
    (1 row)
    ```

</Procedure>

## Add a compression policy

To avoid running the compression step each time you have some data to
compress you can set up a compression policy. The compression policy
allows you to compress data that is older than a particular age, for
example, to compress all chunks that are older than 8 days:

```sql
SELECT add_compression_policy('transactions', INTERVAL '8 days');
```

Compression policies run on a regular schedule, by default once every
day, which means that you might have up to 9 days of uncompressed data
with the setting above.

You can find more information on compression policies in the
[add_compression_policy][add_compression_policy] section.

## Taking advantage of query speedups


Previously, compression was set up to be segmented by `block_id` column value.
This means fetching data by filtering or grouping on that column will be 
more efficient. Ordering is also set to time descending so if you run queries
which try to order data with that ordering, you should see performance benefits. 

For instance, if you run the query example from previous section:
```sql
WITH recent_blocks AS (
 SELECT block_id FROM transactions
 WHERE is_coinbase IS TRUE
 ORDER BY time DESC
 LIMIT 5
)
SELECT
 t.block_id, count(*) AS transaction_count,
 SUM(weight) AS block_weight,
 SUM(output_total_usd) AS block_value_usd
FROM transactions t
INNER JOIN recent_blocks b ON b.block_id = t.block_id
WHERE is_coinbase IS NOT TRUE
GROUP BY t.block_id;
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
    SELECT decompress_chunk(c) from show_chunks('transactions') c;
```

On an example setup, speedup performance observed was two orders of magnitude,
15 ms when compressed vs 1 second when decompressed.

Try it yourself and see what you get!


[segment-by-columns]: /use-timescale/:currentVersion:/compression/about-compression/#segment-by-columns
[automatic-compression]: /tutorials/:currentVersion:/blockchain-query/blockchain-compress/#add-a-compression-policy
[compression-design]: /use-timescale/:currentVersion:/compression/compression-design/
[add_compression_policy]: /api/:currentVersion:/compression/add_compression_policy/
