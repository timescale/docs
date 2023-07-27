---
title: Insert and query Bitcoin transactions
excerpt: Ingest and store Bitcoin blockchain data in your database
products: [cloud, mst, self_hosted]
keywords: [crypto, blockchain, Bitcoin, finance, analytics]
layout_components: [next_prev_large]
content_group: Analyze the Bitcoin blockchain
---

# Insert and query Bitcoin transactions

This section of the tutorial provides an example database schema that you can
use to ingest and store Bitcoin blockchain data in TimescaleDB. The schema
consists of only one table called `transactions`.

## Bitcoin transaction data fields

The sample Bitcoin dataset for this tutorial has the following fields:

| Field | Description |
|---|---|
| time | Timestamp of the transaction |
| block_id | Block ID |
| hash | Hash ID of the transaction |
| size | Size of the transaction in KB |
| weight | Size of the transaction in weight units |
| is_coinbase | Whether the transaction is the first transaction in a block, which includes the miner's reward |
| output_total | Value of the transaction in Satoshi (sat) |
| output_total_usd | Value of the transaction in USD |
| fee | Transaction fee in Satoshi (sat) |
| fee_usd | Transaction fee in USD |

## Table definition

Create a table named `transactions` to hold the Bitcoin data.
Run the following query:

```sql
CREATE TABLE transactions (
   time TIMESTAMPTZ,
   block_id INT,
   hash TEXT,
   size INT,
   weight INT,
   is_coinbase BOOLEAN,
   output_total BIGINT,
   output_total_usd DOUBLE PRECISION,
   fee BIGINT,
   fee_usd DOUBLE PRECISION,
   details JSONB
);
```

The table schema includes all the fields described above, plus an additional JSONB
column named `details`. This column stores a JSONB string with extra
information about each transaction. Data from this column isn't used in this
tutorial, but you can explore the data and get inspired to perform your own
analyses.

Turn the table into a hypertable by using the
[`create_hypertable()`][create_hypertable] function.
A hypertable gives you performance improvements by using
TimescaleDB's chunking feature behind the scenes.
This function needs two
parameters: the name of the table and the name of the TIMESTAMP
column. In this case, the names are `transactions` and `time`.

```sql
SELECT create_hypertable('transactions', 'time');
```

Next, create some additional indexes on
the hypertable. This optimizes execution of later SQL queries.

## Create indexes

When you create a hypertable, TimescaleDB automatically adds a B-tree index
on the timestamp column. This improves queries
where you filter by the time column.

To speed up queries where you search for
individual transactions with the `hash` column, add a `HASH INDEX` to
the column:

```sql
CREATE INDEX hash_idx ON public.transactions USING HASH (hash)
```

Next, speed up block-level queries by adding an index on the `block_id` column:

```sql
CREATE INDEX block_idx ON public.transactions (block_id)
```

To ensure that you don't accidentally insert duplicate records,
add a `UNIQUE INDEX` on the `time` and `hash` columns.

```sql
CREATE UNIQUE INDEX time_hash_idx ON public.transactions (time, hash)
```

## Ingest Bitcoin transactions

You created the hypertable and added proper indexes.
Next, ingest some Bitcoin transactions. The sample data file
contains Bitcoin transactions from the past five days. This CSV file is
updated daily so you always download recent Bitcoin transactions.
Insert this dataset into your TimescaleDB instance.

<Procedure>

### Ingesting Bitcoin transactions

1.  Download the sample `.csv` file: <Tag type="download">[tutorial_bitcoin_sample.csv](https://assets.timescale.com/docs/downloads/bitcoin-blockchain/bitcoin_sample.zip)</Tag>

    ```bash
    wget https://assets.timescale.com/docs/downloads/bitcoin-blockchain/bitcoin_sample.zip
    ```

1.  Unzip the file and change the directory if you need to:

    ```bash
    unzip bitcoin_sample.zip
    cd bitcoin_sample
    ```

1.  At the `psql` prompt, insert the content of the `.csv` file into the database.

    ```bash
    psql -x "postgres://tsdbadmin:<YOUR_PASSWORD_HERE>@<YOUR_HOSTNAME_HERE>:<YOUR_PORT_HERE>/tsdb?sslmode=require"

    \COPY transactions FROM 'tutorial_bitcoin_sample.csv' CSV HEADER;
    ```

    The process should complete in 3-5 minutes.

</Procedure>

Once the ingestion finishes, your database contains around 1.5 million Bitcoin
transactions. Now, you can make your first queries.

## Query Bitcoin transactions

Query for the five most recent non-coinbase transactions:

```sql
SELECT time, hash, block_id, weight  FROM transactions
WHERE is_coinbase IS NOT TRUE
ORDER BY time DESC
LIMIT 5
```

The result looks something like this:

<!-- vale Google.Units = NO -->
time               |hash                                                            |block_id|weight|
-------------------|----------------------------------------------------------------|--------|------|
2022-05-30 01:42:17|6543a8e489eade391f099df7066f17783ea2f9d19d644d818ac22bd8fb86005e|  738489|   863|
2022-05-30 01:42:17|a9e2bb3e734e0c0535da4e8ab6e3d0352a44db443d48a861bd5b196575dfd3ff|  738489|   577|
2022-05-30 01:42:17|fd0a9a8c31962107d0a5a0c4ef2a5702e2c9fad6d989e7ac543d87783205a980|  738489|   758|
2022-05-30 01:42:17|e2aedc6026459381485cd57f3e66ea88121e5094c03fa4634193417069058609|  738489|   766|
2022-05-30 01:42:17|429c0d00282645b54bd3c0082800a85d1c952d1764c54dc2a591f97b97c93fbd|  738489|   766|
<!-- vale Google.Units = YES -->

<Highlight type="note">
A coinbase transaction is the first transaction in each block. This transaction contains the miner's reward.
</Highlight>

Here's another example query that returns the five most recent blocks, with
statistics such as block weight, transaction count, and value in USD:

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
GROUP BY t.block_id
```

Result:

block_id|transaction_count|block_weight|block_value_usd   |
--------|-----------------|------------|------------------|
  738489|             2508|     3991873|402592534.37649953|
  738487|             2231|     3991983| 560811110.1410986|
  738488|             3208|     3991994| 422477674.0440979|
  738486|             2154|     3996197| 481098865.6260999|
  738485|             2602|     3991871| 761258578.3764017|

At this point, you have Bitcoin blockchain data in your database and you've made
your first SQL queries. In the next section, dig deeper into the blockchain and use
TimescaleDB hyperfunctions to generate insights!

[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
