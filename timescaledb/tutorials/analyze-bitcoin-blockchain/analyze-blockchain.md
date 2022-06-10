# Analyze the blockchain with hyperfunctions
This section of the tutorial shows you different ways to analyze Bitcoin
transactions with SQL. Before analyzing the data, it's recommended to create
continuous aggregates for better query performance and experience.

## Continuous aggregates for blockchain analytics
Continuous aggregates are materialized views for time-series data. They make
queries faster by continuously materializing aggregated data while
also providing a simple gateway
to real-time data from the underlying hypertable. To achieve great time-series
query performance with TimescaleDB, it's recommended to use
continuous aggregates.

Let's set up continuous aggregates that contain 1-hour time buckets. This means
that each row in the continuous aggregate will include Bitcoin transactions
that happened within the given hour. There are more than ten thousand
Bitcoin transactions in an hour so it's essential to aggregate them into
larger time buckets for analysis.

This tutorial creates three continuous aggregates, focusing on three aspects
of the blockchain data:
* transactions
* blocks
* coinbase transactions (miner revenue)

By using continuous aggregate from the beginning, your analytical and
time-series queries are vastly simplified and
sped up going forward.

This tutorial also shows you how to keep these continuous aggregate 
views up-to-date automatically with refresh policies.

## Hyperfunctions for simplified statistical queries
In the following queries you can find custom SQL functions that are not part of
vanilla PostgreSQL. These queries are TimescaleDB hyperfunctions and they are
either part of the TimescaleDB extension or the Toolkit extension. You need to
install and enable the Toolkit extension to successfully run the following
queries.

Enable Toolkit extension:
```sql
CREATE EXTENSION timescaledb_toolkit;
```

### Continuous aggregate: transactions
Create a continuous aggregate called `one_day_transactions`. This view holds
hourly aggregated data about all the transactions that happened in the given
time bucket.

```sql
-- Hourly aggregations of transactions
CREATE MATERIALIZED VIEW one_hour_transactions
WITH (timescaledb.continuous) AS
SELECT time_bucket('1 hour', time) AS bucket,
   count(*) AS tx_count,
   sum(fee) AS total_fee_sat,
   sum(fee_usd) AS total_fee_usd,
   stats_agg(fee) AS stats_fee_sat,
   avg(size) AS avg_tx_size,
   avg(weight) AS avg_tx_weight,
   count(
         CASE
            WHEN (fee > output_total) THEN hash
            ELSE NULL
         END) AS high_fee_count
   FROM transactions
  WHERE (is_coinbase IS NOT TRUE)
GROUP BY bucket;
```

Running this query, you create these aggregate columns within the continuous
aggregate:

* `tx_count`: Total transaction volume
* `total_fee_sat`: Total fees paid in Sat
* `total_fee_usd`: Total fees paid in USD
* `stats_fee_sat`: Fee stats (in Sat)
    This column uses a hyperfunction called `stats_agg`.
* `avg_tx_size`: average transaction size in KB
* `high_fee_count`: Number of transactions where fee is higher than the
    transaction volume
 

Add a refresh policy to keep the continuous aggregate up-to-date:
```sql
SELECT add_continuous_aggregate_policy('one_hour_transactions',
   start_offset => INTERVAL '3 hours',
   end_offset => INTERVAL '1 hour',
   schedule_interval => INTERVAL '1 hour');
```

### Continuous aggregate: blocks
Create a continuous aggregate called `one_hour_blocks`. This view holds hourly
aggregated data about all the blocks that were mined in the given
time bucket.

```sql
-- Hourly aggregations of blocks
CREATE MATERIALIZED VIEW one_hour_blocks
WITH (timescaledb.continuous) AS
SELECT time_bucket('1 hour', time) AS bucket,
   block_id,
   count(*) AS tx_count,
   sum(fee) AS block_fee_sat,
   sum(fee_usd) AS block_fee_usd,
   stats_agg(fee) AS stats_tx_fee_sat,
   avg(size) AS avg_tx_size,
   avg(weight) AS avg_tx_weight,
   sum(size) AS block_size,
   sum(weight) AS block_weight,
   max(size) AS max_tx_size,
   max(weight) AS max_tx_weight,
   min(size) AS min_tx_size,
   min(weight) AS min_tx_weight
FROM transactions
WHERE is_coinbase IS NOT TRUE
GROUP BY bucket, block_id;
```

Running this query, you create these aggregate columns within the continuous
aggregate:

* `tx_count`: Number of transactions per block
* `block_fee_sat`: Transaction fee paid per block (in Sat)
* `block_fee_usd`:  Transaction fee paid per block (in USD)
* `stats_tx_fee_sat`: Stats for transaction fees
* `avg_tx_size`: Average transaction size within the block
* `avg_tx_weight`: Average transaction weight within the block
* `block_size`: Total block size
* `block_weight`: Total block weight
* `max_tx_size`: Maximum transaction size within the block
* `max_tx_weight`: Maximum transaction weight within the block
* `min_tx_size`: Minimum transaction size within the block
* `min_tx_weight`: Minimum transaction weight within the block

Add a refresh policy to keep the continuous aggregate up-to-date:
```sql
SELECT add_continuous_aggregate_policy('one_hour_blocks',
   start_offset => INTERVAL '3 hours',
   end_offset => INTERVAL '1 hour',
   schedule_interval => INTERVAL '1 hour');
```


## Continuous aggregate: coinbase transactions (miner revenue)
Create a continuous aggregate called `one_hour_coinbase`. This view holds
hourly aggregated data about all the transactions that miners received as
rewards in the given time bucket.


```sql
-- Hourly aggregations of coinbase transactions (miner fees & rewards)
CREATE MATERIALIZED VIEW one_hour_coinbase
WITH (timescaledb.continuous) AS
SELECT time_bucket('1 hour', time) AS bucket,
   count(*) AS tx_count,
   stats_agg(output_total, output_total_usd) AS stats_miner_revenue,
   min(output_total) AS min_miner_revenue,
   max(output_total) AS max_miner_revenue
FROM transactions
WHERE is_coinbase IS TRUE
GROUP BY bucket;
```

Running this query, you create these aggregate columns within the continuous
aggregate:
* `tx_count`: Number of coinbase transactions per day
* `stats_miner_revenue`: Stats for miner revenue (both in Sat and USD)
* `min_miner_revenue`: Minimum miner revenue received after mining a block per day
* `max_miner_revenue`: Maximum miner revenue received after mining a block per day


Add a refresh policy to keep the continuous aggregate up-to-date:
```sql
SELECT add_continuous_aggregate_policy('one_hour_coinbase',
   start_offset => INTERVAL '3 hours',
   end_offset => INTERVAL '1 hour',
   schedule_interval => INTERVAL '1 hour');
```

In each continuous aggregate definition the `time_bucket()` function controls
how large the time buckets are. Above are examples that create 1-day time
buckets.

## Generate insights with SQL
In this section, you see a list of questions related to blockchain
transactions, blocks, and miner revenue. Each question is accompanied by a
relevant SQL query and a chart that answers the question with a brief
explanation.

**Questions**
* Is there any connection between the number of transactions and the transaction fees?
* Does the transaction volume affect the BTC-USD rate?
* Do more transactions in a block mean the block is more expensive to mine?
* What percentage of the average miner's revenue comes from fees vs. block rewards?
* How does block weight affect miner fees?
* What’s the average miner revenue per block?


### Is there any connection between the number of transactions and the transaction fees?
When it comes to blockchains, a major concern for users is the transaction
fees. At the end of the day, if a blockchain is too expensive to use, not many
people are willing to use it. Let’s see if there’s any correlation between the
number of Bitcoin transactions and the fees. The time range for this analysis
is the last day.
```sql
SELECT
 bucket AS "time",
 tx_count as "tx volume",
 average(stats_fee_sat) as fees
FROM one_hour_transactions
WHERE bucket > NOW() - INTERVAL '1 day'
ORDER BY 1
```
![transaction volume and fees](https://assets.timescale.com/docs/images/tutorials/bitcoin-blockchain/tx_volume_fees.png)

On this chart, the green line indicates the average transaction volume over
time, and the yellow line indicates the average fee per transaction over
time. This type of insight can help you, for example, decide whether you
should submit a transaction now or wait a couple of days for fees to
decrease. Now let’s look at an analysis that traders might find insightful.

### Does the transaction volume affect the BTC-USD rate?
In cryptocurrency trading, there’s a lot of speculation. Finding correlations
between fundamental blockchain metrics, like transaction volume or fees and the
BTC-USD rate can help traders shape their strategy and make decisions based
on data.

```sql
SELECT
 bucket AS "time",
 tx_count as "tx volume",
 total_fee_usd / (total_fee_sat*0.00000001) AS "btc-usd rate"
FROM one_hour_transactions
WHERE bucket > NOW() - INTERVAL '1 day'
ORDER BY 1
```
![volume and BTC-USD](https://assets.timescale.com/docs/images/tutorials/bitcoin-blockchain/volume_btc_usd.png)

Again, the green line shows the average transaction volume over time and the
yellow line shows the BTC-USD conversion rate at any given time.

Next, let's segue into block-level insights by analyzing the connection
between transactions and blocks.

### Do more transactions in a block mean the block is more expensive to mine?
For someone who is not an expert on how the Bitcoin blockchain works, it might be a
difficult question to answer. So let’s ask the data and see if it’s true.
For this kind of analysis you might want to look at a larger time frame,
so let’s change the analyzed time range to the last five days.

```sql
SELECT
 bucket as "time",
 avg(tx_count) AS transactions,
 avg(block_fee_sat)*0.00000001 AS "mining fee"
FROM one_hour_blocks
WHERE bucket > now() - INTERVAL '5 day'
GROUP BY bucket
ORDER BY 1
```
![transactions in block and mining fee](https://assets.timescale.com/docs/images/tutorials/bitcoin-blockchain/tx_in_block_expensive.png)

Unsurprisingly, there’s a high correlation between the number of transactions
in a block and the mining fee. The more transactions a block has, the higher
the block mining fee.

Let’s dive deeper and see if there is the same correlation between block
weight and mining fee. (Block weight is the size measure of a block). More
transactions should increase the block weight, boosting the miner fee as well.
This query looks very similar to the previous one:
```sql
SELECT
 bucket as "time",
 avg(block_weight) as "block weight",
 avg(block_fee_sat*0.00000001) as "mining fee"
FROM one_hour_blocks
WHERE bucket > now() - INTERVAL '5 day'
group by bucket
ORDER BY 1
```
![block weight and mining fee](https://assets.timescale.com/docs/images/tutorials/bitcoin-blockchain/weight_fee.png)

And yes—you can see the same kind of high correlation between block weight
(defined in weight units) and mining fee. Except when the block weight gets
close to its maximum value (4M weight units) in which case it's impossible for a
block to include more transactions.

In the previous charts, you saw how mining fees are correlated to block
weights, transaction volumes, etc. But now, let’s analyze the data from a
different perspective. Miner revenue is not only made up of miner fees, it
also includes block rewards after mining a new block. This reward is currently
6.25 BTC and it gets halved every four years. Let’s analyze miner revenue!

### What percentage of the average miner's revenue comes from fees vs. block rewards?
Miners are incentivized to keep the network up and running because they earn
fees and rewards after mining each block. But let’s look at how much of their
revenue comes from these two sources.

```sql
WITH coinbase AS (
   SELECT block_id, output_total AS coinbase_tx FROM transactions
   WHERE is_coinbase IS TRUE and time > NOW() - INTERVAL '5 days'
)
SELECT
   bucket as "time",
   avg(block_fee_sat)*0.00000001 AS "fees",
   FIRST((c.coinbase_tx - block_fee_sat), bucket)*0.00000001 AS "reward"
FROM one_hour_blocks b
INNER JOIN coinbase c ON c.block_id = b.block_id
GROUP BY bucket
ORDER BY 1;
```
![fees and block reward](https://assets.timescale.com/docs/images/tutorials/bitcoin-blockchain/revenue_ratio.png)
(THIS CHART NEEDS AN UPDATE)

This chart analyzes the last 5 days of average miner revenue. The left
axis is a percentage value that indicates the portion of total revenue that
comes from transaction fees (green) and block rewards (yellow). It might be
surprising for some, but most miner revenue comes from block rewards
(6.25BTC at the moment). The fees portion never went above 3 % in the
last 5 days. 

This kind of analysis can start discussions around the long-term fading of
block rewards and how on-chain fees will need to go up in the future to
incentivize the miners and sustain the network. (Note that the left axis is
logarithmic-scale, so it’s easier to see the green "fees" portion.)

USING HYPERFUNCTION

### How does block weight affect miner fees?
You’ve already seen that more transactions in a block mean it’s more expensive
to mine. Is it the same with block weights? The more transactions a block has,
the larger its size (or weight), so the block weight and mining fee should
be tightly correlated. 

This query uses a 12-hour moving average to calculate the block weight and
block mining fee over time.

```sql
WITH stats AS (
   SELECT
       bucket,
       stats_agg(block_weight, block_fee_sat) AS block_stats
   FROM one_hour_blocks
   WHERE bucket > NOW() - INTERVAL '5 days'
   GROUP BY bucket
)
SELECT
   bucket as "time",
   average_y(rolling(block_stats) OVER (ORDER BY bucket RANGE '12 hours' PRECEDING)) AS "block weight",
   average_x(rolling(block_stats) OVER (ORDER BY bucket RANGE '12 hours' PRECEDING))*0.00000001 AS "mining fee"
FROM stats
ORDER BY 1
```

![block weight and fees](https://assets.timescale.com/docs/images/tutorials/bitcoin-blockchain/weight_fees.png)

You can see that the block weight and block mining fee are indeed tightly
connected to each other. In practice, you can also see that four million
weight units are the size limit introduced in the 2017’s SegWit update.
This means that, looking at this graph, there’s still room to grow for
individual blocks, and they could include even more transactions.

### What’s the average miner revenue per block?
Now let’s analyze how much revenue miners actually generate by mining a
new block on the blockchain, including fees and block rewards. This query
analyzes the last day with 12-hour moving averages.

```sql
SELECT
   bucket as "time",
   average_y(rolling(stats_miner_revenue) OVER (ORDER BY bucket RANGE '12 hours' PRECEDING))*0.00000001 AS "revenue in BTC"
FROM one_hour_coinbase
WHERE bucket > NOW() - INTERVAL '1 day'
ORDER BY 1
```
![miner revenue per block](https://assets.timescale.com/docs/images/tutorials/bitcoin-blockchain/miner_revenue_per_block.png)
(THIS CHART NEEDS AN UPDATE - larger time frame?)

To add some spice to the chart, let’s add the BTC-USD rate to the analysis
and increase the time range:

```sql
SELECT
   bucket as "time",
   average_y(rolling(stats_miner_revenue) OVER (ORDER BY bucket RANGE '7 days' PRECEDING))*0.00000001 AS "revenue in BTC",
   average_x(rolling(stats_miner_revenue) OVER (ORDER BY bucket RANGE '7 days' PRECEDING)) AS "revenue in USD"
FROM coinbase_one_day
WHERE
 bucket > NOW() - INTERVAL '5 day'
ORDER BY 1
```
![miner revenue per block](https://assets.timescale.com/docs/images/tutorials/bitcoin-blockchain/miner_revenue_per_block_with_btcusd.png)

