---
title: Query the Bitcoin blockchain - set up compression
excerpt: Compress the dataset so you can store the Bitcoin blockchain more efficiently
products: [cloud]
keywords: [beginner, crypto, blockchain, Bitcoin, finance, analytics]
layout_components: [next_prev_large]
content_group: Query the Bitcoin blockchain
---

# Set up compression and compress the dataset

This tutorial uses a dataset that contains Bitcoin blockchain data for
the past five days, in a hypertable named `transactions`.

<Collapsible heading="Setting up compression" defaultExpanded={false}>

Storing a lot of blockchain data can be expensive. Using compression, you can store
the same dataset much more efficiently and potentially query it even faster.

## Compression setup

1.  Connect to the Timescale database that contains the Bitcoin dataset.
1.  At the psql prompt, run the ALTER command to enable compression on the hypertable:

    ```sql
    ALTER TABLE transactions 
    SET (
        timescaledb.compress, 
        timescaledb.compress_segmentby='block_id', 
        timescaledb.compress_orderby='time DESC'
    );
    ``` 
1.  Compress all the chunks of the hypertable:
    ```sql
    SELECT compress_chunk(c) from show_chunks('transactions');
    ```
1.  See the dataset size before and after compression:
    ```sql
    SELECT 
        pg_size_pretty(before_compression_total_bytes) as before,
        pg_size_pretty(after_compression_total_bytes) as after,
     FROM hypertable_compression_stats('transactions');
    ```
1.  The output should show considerable storage savings, something like this:
    ```sql
     before  | after  
    ---------+--------
    1307 MB | 237 MB   
    (1 row)
    ```
</Collapsible>

<Collapsible heading="Automatic compression" defaultExpanded={false}>
## Automating compression

If this was a production usecase, you could automate compression by adding a policy which would compress data after a certain age:

```sql
SELECT add_compression_policy('transactions', INTERVAL '8 days');
```

Previous command would compress the chunks after they reach 8 days of age.
</Collapsible>

<Collapsible heading="Taking advantage of query speedups" defaultExpanded={false}>
## Faster analytical queries

Previously, we have setup compression to be segmented by block_id column value.
This means fetching data by filtering or grouping on that column will be fetched
more efficiently. Ordering is also set to time descending so if we run queries
which try to order data with that ordering, we should see performance benefits. 

For instance, if we run the query example from previous section:
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

We should see a decent performance difference when the dataset is compressed and
when is decompressed. Try it yourself by running the previous query, decompressing
the dataset and running it again while timing the execution time.

You can decompress the whole dataset by running:
```sql
    SELECT decompress_chunk(c) from show_chunks('transactions');
```

On an example machine, we have observed a speedup of around two order of magnitude
(15ms when compressed vs 1 second when decompressed).

Try it yourself and see what you get!
</Collapsible>

[satoshi-def]: https://www.pcmag.com/encyclopedia/term/satoshi
[coinbase-def]: https://www.pcmag.com/encyclopedia/term/coinbase-transaction
