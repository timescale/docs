# Analyze the blockchain with hyperfunctions
In this section, analyze Bitcoin transactions with SQL in different ways.
See how hyperfunctions and continuous aggregates can make it easier to query
and analyze blockchain data.

## Hyperfunctions for simplified statistical queries
In some of the following queries you can find custom SQL functions that are
not part of vanilla PostgreSQL. These queries are TimescaleDB
[hyperfunctions][docs-hyperfunctions] and they are
either part of the TimescaleDB extension or the Toolkit extension.
Hyperfunctions is a series of SQL functions that make it easier to manipulate
and analyze time-series data in PostgreSQL. You need to
[install and enable the Toolkit extension][install-toolkit] to be able to use
the whole set of hyperfunctions and successfully run the following queries.

After installing the extension, enable it:
```sql
CREATE EXTENSION timescaledb_toolkit;
```

Now set up a few continuous aggregates for faster and simplifed analysis.

## Continuous aggregates for blockchain analytics
[Continuous aggregates][docs-cagg] are materialized views for time-series data.
They make
queries faster by continuously materializing aggregated data. At the same
time, they provide real-time results. That means they include the latest data
from the underlying hypertable.

By using continuous aggregates, you simplify and speed up your queries.

In this tutorial, you create three continuous aggregates, focusing
on three aspects of the dataset:
* Bitcoin transactions
* Bitcoin blocks
* Coinbase transactions (miner revenue)

Pre-aggregating your data is important because the dataset contains a lot
of transactions: over 10,000 per hour.

In this section, you also learn how to keep your continuous
aggregate views up-to-date with automatic refresh policies.

### Continuous aggregate: transactions
Create a continuous aggregate called `one_hour_transactions`. This view holds
aggregated data about each hour of transactions.

```sql
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

In this query, you create these aggregate columns within the continuous
aggregate:

* `tx_count`: Total transaction volume
* `total_fee_sat`: Total fees paid in Sat
* `total_fee_usd`: Total fees paid in USD
* `stats_fee_sat`: Fee stats (in Sat)
    This column uses a hyperfunction called [`stats_agg`][stats_agg].
    The raw `stats_agg` value isn't easily interpretable.
    Later, you can use `stats_agg` to calculate other statistics, such as the average.
* `avg_tx_size`: Average transaction size in KB
* `high_fee_count`: Number of transactions where the fee is higher than the
    transaction volume
 

Add a refresh policy to keep the continuous aggregate up-to-date:
```sql
SELECT add_continuous_aggregate_policy('one_hour_transactions',
   start_offset => INTERVAL '3 hours',
   end_offset => INTERVAL '1 hour',
   schedule_interval => INTERVAL '1 hour');
```

### Continuous aggregate: blocks
Create a continuous aggregate called `one_hour_blocks`. This view holds
aggregated data about all the blocks that were mined each hour.

```sql
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
aggregated data about all the transactions that miners received as
rewards each hour.


```sql
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

In each continuous aggregate definition, the `time_bucket()` function controls
how large the time buckets are. The examples all use 1-hour time
buckets.

## Generate insights with SQL
Here are some questions you might ask about blockchain
transactions, blocks, and miner revenue. For each question,
you get a relevant SQL query and a chart that answers the question.

**Questions**
* [Is there any connection between the number of transactions and the transaction fees?](#is-there-any-connection-between-the-number-of-transactions-and-the-transaction-fees)
* [Does the transaction volume affect the BTC-USD rate?](#does-the-transaction-volume-affect-the-btc-usd-rate)
* [Do more transactions in a block mean the block is more expensive to mine?](#do-more-transactions-in-a-block-mean-the-block-is-more-expensive-to-mine)
* [What percentage of the average miner's revenue comes from fees vs. block rewards?](#what-percentage-of-the-average-miners-revenue-comes-from-fees-compared-to-block-rewards)
* [How does block weight affect miner fees?](#how-does-block-weight-affect-miner-fees)
* [What’s the average miner revenue per block?](#whats-the-average-miner-revenue-per-block)


### Is there any connection between the number of transactions and the transaction fees?
Transaction fees are a major concern for blockchain users. 
If a blockchain is too expensive, you might not want to use it. This query
shows you whether there’s any correlation between the
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
![Hourly transaction volume and fees, plotted over the last day](https://assets.timescale.com/docs/images/tutorials/bitcoin-blockchain/tx_volume_fees.png)

On this chart, the green line indicates the average transaction volume over
time. The yellow line indicates the average fee per transaction over
time. These trends might help you decide whether to
submit a transaction now or wait a few days for fees to
decrease.

### Does the transaction volume affect the BTC-USD rate?
In cryptocurrency trading, there’s a lot of speculation. You can adopt
a data-based trading strategy by looking at correlations between blockchain
metrics, such as transaction volume and fees.

```sql
SELECT
 bucket AS "time",
 tx_count as "tx volume",
 total_fee_usd / (total_fee_sat*0.00000001) AS "btc-usd rate"
FROM one_hour_transactions
WHERE bucket > NOW() - INTERVAL '1 day'
ORDER BY 1
```
![Hourly transaction volume and BTC-USD conversion rate, plotted over the last day](https://assets.timescale.com/docs/images/tutorials/bitcoin-blockchain/volume_btc_usd.png)

Again, the green line shows the average transaction volume over time. The
yellow line shows the BTC-USD conversion rate.

Next, get block-level insights by analyzing the connection
between transactions and blocks.

### Do more transactions in a block mean the block is more expensive to mine?
See how the number of transactions in a block influences the overall block
mining fee. For this analysis, you might want to look at a larger time frame.
Change the analyzed time range to the last five days.

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
![Line graph with two lines showing the average number of transactions in a block and the block mining fee, over the last five days](https://assets.timescale.com/docs/images/tutorials/bitcoin-blockchain/tx_in_block_expensive.png)

Unsurprisingly, there’s a high correlation between the number of transactions
in a block and the mining fee. The more transactions a block has, the higher
the block mining fee.

In the next query, see if there is the same correlation between block
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
![Line graph with two lines showing the block weight and the block mining fee, over the last five days](https://assets.timescale.com/docs/images/tutorials/bitcoin-blockchain/weight_fee.png)

You can see the same kind of high correlation between block weight
(defined in weight units) and mining fee. The relationship weakens when the block weight gets
close to its maximum value (4 million weight units), in which case it's impossible for a
block to include more transactions.

In the previous charts, you saw how mining fees are correlated to block
weights and transaction volumes. In the next query, analyze the data from a
different perspective. Miner revenue is not only made up of miner fees. It
also includes block rewards after mining a new block. This reward is currently
6.25 BTC, and it gets halved every four years. What are some trends in miner revenue?

### What percentage of the average miner's revenue comes from fees compared to block rewards?
Miners are incentivized to keep the network up and running because they earn
fees and rewards after mining each block. How much of their
revenue comes from each source?

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
![Line graph with two lines showing the average fee and block reward, over the last five days](https://assets.timescale.com/docs/images/tutorials/bitcoin-blockchain/revenue_ratio.png)

This chart analyzes the last five days of average miner revenue. The left
axis shows the percentage of total revenue that
comes from transaction fees (green) and block rewards (yellow). Most miner
revenue actually comes from block rewards
(6.25&nbsp;BTC at the moment). Fees never accounted for more than 3% in the
last five days. 

This kind of analysis can start discussions around the long-term fading of
block rewards and how on-chain fees need to rise to
incentivize miners and sustain the network. (Note that the left axis is
logarithmic-scale, so it’s easier to see the green "fees" portion.)

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
Now, analyze how much revenue miners actually generate by mining a
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
![Average miner revenue per block, plotted over the last day](https://assets.timescale.com/docs/images/tutorials/bitcoin-blockchain/miner_revenue_per_block.png)
(THIS CHART NEEDS AN UPDATE - larger time frame?)

To make the chart more interesting, add the BTC-USD rate to the analysis
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
![Average miner revenue per block, plotted in BTC and USD, over the last five days](https://assets.timescale.com/docs/images/tutorials/bitcoin-blockchain/miner_revenue_per_block_with_btcusd.png)

[stats_agg]: /api/:currentVersion:/hyperfunctions/stats_aggs/stats_agg/
[install-toolkit]: /how-to-guides/hyperfunctions/install-toolkit/
[docs-hyperfunctions]: /how-to-guides/hyperfunctions/
[docs-cagg]: /how-to-guides/continuous-aggregates/