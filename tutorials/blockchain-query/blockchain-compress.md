---
title: Compress your data using hypercore
excerpt: Compress a sample dataset with Timescale Cloud so you can store the Bitcoin blockchain more efficiently
products: [cloud]
keywords: [beginner, crypto, blockchain, Bitcoin, finance, analytics]
layout_components: [next_prev_large]
content_group: Query the Bitcoin blockchain
---

# Compress your data using $HYPERCORE 

With a dataset like the `bitcoin_sample`, over time you end up with a lot of data. Since this data 
is mostly immutable you can compress it to save space and avoid incurring additional cost.

$TIMESCALE_DB is built for handling event-oriented data such as time-series, it comes with support 
to compress the data in $HYPERTABLEs using [$HYPERCORE][hypercore].

[$HYPERCORE_CAP][hypercore] enables you to store the data in a vastly more efficient format allowing 
up to 20x compression ratio compared to a normal $PG table. However, this is highly dependent 
on the data and configuration.

[$HYPERCORE_CAP][hypercore] is implemented natively in $PG and does not require special storage 
formats. When you convert your data from the $ROWSTORE to the $COLUMNSTORE. $TIMESCALE_DB uses 
$PG features to transform the data into columnar format. The use of a columnar format allows a better 
compression ratio since similar data is stored adjacently. For more details on how
the compression format looks, see [$HYPERCORE][hypercore].

A beneficial side-effect of compressing data is that certain queries are significantly faster, since 
less data has to be read into memory.

## Optimize your data in the $COLUMNSTORE

To compress the data in the `transactions` table, do the following:

<Procedure>

1. Connect to your $SERVICE_LONG

   In [$CONSOLE][services-portal] open an [SQL editor][in-console-editors]. The in-Console editors display the query speed.
   You can also connect to your service using [psql][connect-using-psql].

1.  Enable the $COLUMNSTORE on the table and pick suitable segment-by and
    order-by column using the `ALTER TABLE` command:

    ```sql
    ALTER TABLE transactions 
    SET (
        timescaledb.enable_columnstore , 
        timescaledb.segmentby='block_id', 
        timescaledb.orderby='time DESC'
    );
    ``` 

    Depending on the choice of `segmentby` and `orderby` column, you can
    get very different performance and compression ratio. To learn
    more about how to pick the correct columns, see
    [here][segment-by-columns].

1. Convert data to the $COLUMNSTORE:

   You can do this either automatically or manually:   
   - [Automatically convert chunks][add_columnstore_policy] in the $HYPERTABLE to the $COLUMNSTORE at a specific time interval:

       ```sql 
      CALL add_columnstore_policy('transactions', after => INTERVAL '1d');
       ```

   - [Manually convert all chunks][convert_to_columnstore] in the $HYPERTABLE to the $COLUMNSTORE:

       ```sql
       CALL convert_to_columnstore(c) from show_chunks('transactions') c;
       ```
       To manually move the data back to the $ROWSTORE:
       ```sql
       CALL convert_to_rowstore(c) from show_chunks('transactions') c;
       ```

1.  Now that you have converted the chunks in your $HYPERTABLE to the $COLUMNSTORE, compare the 
    size of the dataset before and after compression:

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


## Take advantage of query speedups

Previously, data in the $COLUMNSTORE was `segmentby` by the `block_id` column value.
This means fetching data by filtering or grouping on that column is 
more efficient. Ordering is set to time descending. This means that when you run queries
which try to order data in the same way, you see performance benefits. 

<Procedure>

1. Connect to your $SERVICE_LONG

   In [$CONSOLE][services-portal] open an [SQL editor][in-console-editors]. The in-Console editors display the query speed.

1. Run the following query: 

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

   Performance speedup is of two orders of magnitude, around 15 ms when compressed in the $COLUMNSTORE and
   1 second when decompressed in the $ROWSTORE.  

</Procedure>


[segment-by-columns]: /use-timescale/:currentVersion:/compression/about-compression/#segment-by-columns
[automatic-compression]: /tutorials/:currentVersion:/blockchain-query/blockchain-compress/#add-a-compression-policy
[compression-design]: /use-timescale/:currentVersion:/compression/compression-design/
[add_compression_policy]: /api/:currentVersion:/compression/add_compression_policy/
[hypercore]: /use-timescale/:currentVersion:/hypercore/
[in-console-editors]: /getting-started/:currentVersion:/run-queries-from-console/
[services-portal]: https://console.cloud.timescale.com/dashboard/services
[connect-using-psql]: /integrations/:currentVersion:/psql#connect-to-your-service
[add_columnstore_policy]: /api/:currentVersion:/hypercore/add_columnstore_policy/
[convert_to_columnstore]: /api/:currentVersion:/hypercore/convert_to_columnstore/
