---
title: Query the Bitcoin blockchain - query data
excerpt: Query the Bitcoin blockchain dataset
products: [cloud]
keywords: [beginner, crypto, blockchain, Bitcoin, finance, analytics]
layout_components: [next_prev_large]
content_group: Query the Bitcoin blockchain
---

# Query the data

When you have your dataset loaded, you can start constructing some queries to
discover what your data tells you. In this section, you learn how to write
queries that answer these questions:

*   [What are the five most recent transactions?](#what-are-the-five-most-recent-transactions)
*   [What are the five most recent coinbase transactions?](#what-are-the-five-most-recent-coinbase-transactions)
*   [What are the five most recent blocks?](#what-are-the-five-most-recent-blocks?)

## What are the five most recent transactions?

This dataset contains Bitcoin transactions for the last five days. To find out
the most recent transactions in the dataset, you can use a `SELECT` statement.
In this case, you want to find transactions that are not coinbase transaction,
order them by time in descending order, and take the top five results. You also
want to see the block ID, and the value of the transaction in US Dollars.

<Procedure>

### Finding the five most recent transactions

1.  Connect to the Timescale database that contains the Bitcoin dataset.
1.  At the psql prompt, use this query to select the five most recent
    non-coinbase transactions:

    ```sql
    SELECT time, hash, block_id, fee_usd  FROM transactions
    WHERE is_coinbase IS NOT TRUE
    ORDER BY time DESC
    LIMIT 5;
    ```

1.  The data you get back looks a bit like this:

    ```sql
                  time          |                               hash                               | block_id | fee_usd
    ------------------------+------------------------------------------------------------------+----------+---------
     2023-06-12 23:54:18+00 | 6f709d52e9aa7b2569a7f8c40e7686026ede6190d0532220a73fdac09deff973 |   794111 |   7.614
     2023-06-12 23:54:18+00 | ece5429f4a76b1603aecbee31bf3d05f74142a260e4023316250849fe49115ae |   794111 |   9.306
     2023-06-12 23:54:18+00 | 54a196398880a7e2e38312d4285fa66b9c7129f7d14dc68c715d783322544942 |   794111 | 13.1928
     2023-06-12 23:54:18+00 | 3e83e68735af556d9385427183e8160516fafe2f30f30405711c4d64bf0778a6 |   794111 |  3.5416
     2023-06-12 23:54:18+00 | ca20d073b1082d7700b3706fe2c20bc488d2fc4a9bb006eb4449efe3c3fc6b2b |   794111 |  8.6842
    (5 rows)
    ```

</Procedure>

## What are the five most recent coinbase transactions?

In the last procedure, you excluded coinbase transactions from the results.
Coinbase transactions are the first transaction in a block, and they include the
reward a coin miner receives for mining the coin. To find out the most recent
coinbase transactions, you can use a similar `SELECT` statement, but search for
transactions that are coinbase instead. If you include the transaction value in
US Dollars again, you'll notice that the value is $0 for each. This is because
the coin has not transferred ownership in coinbase transactions.

<Procedure>

### Finding the five most recent coinbase transactions

1.  Connect to the Timescale database that contains the Bitcoin dataset.
1.  At the psql prompt, use this query to select the five most recent
    coinbase transactions:

    ```sql
    SELECT time, hash, block_id, fee_usd  FROM transactions
    WHERE is_coinbase IS TRUE
    ORDER BY time DESC
    LIMIT 5;
    ```

1.  The data you get back looks a bit like this:

    ```sql
                 time          |                               hash                               | block_id | fee_usd
    ------------------------+------------------------------------------------------------------+----------+---------
     2023-06-12 23:54:18+00 | 22e4610bc12d482bc49b7a1c5b27ad18df1a6f34256c16ee7e499b511e02d71e |   794111 |       0
     2023-06-12 23:53:08+00 | dde958bb96a302fd956ced32d7b98dd9860ff82d569163968ecfe29de457fedb |   794110 |       0
     2023-06-12 23:44:50+00 | 75ac1fa7febe1233ee57ca11180124c5ceb61b230cdbcbcba99aecc6a3e2a868 |   794109 |       0
     2023-06-12 23:44:14+00 | 1e941d66b92bf0384514ecb83231854246a94c86ff26270fbdd9bc396dbcdb7b |   794108 |       0
     2023-06-12 23:41:08+00 | 60ae50447254d5f4561e1c297ee8171bb999b6310d519a0d228786b36c9ffacf |   794107 |       0
    (5 rows)
    ```

</Procedure>

## What are the five most recent blocks?

In this procedure, you use a more complicated query to return the five most
recent blocks, and show some additional information about each, including the
block weight, number of transactions in each block, and the total block value in
US Dollars.

<Procedure>

### Finding the five most recent blocks

1.  Connect to the Timescale database that contains the Bitcoin dataset.
1.  At the psql prompt, use this query to select the five most recent
    coinbase transactions:

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

1.  The data you get back looks a bit like this:

    ```sql
     block_id | transaction_count | block_weight |  block_value_usd
    ----------+-------------------+--------------+--------------------
       794108 |              5625 |      3991408 |  65222453.36381342
       794111 |              5039 |      3991748 |  5966031.481099684
       794109 |              6325 |      3991923 |  5406755.801599815
       794110 |              2525 |      3995553 |  177249139.6457974
       794107 |              4464 |      3991838 | 107348519.36559173
    (5 rows)
    ```

</Procedure>

[coinbase-def]: https://www.pcmag.com/encyclopedia/term/coinbase-transaction
