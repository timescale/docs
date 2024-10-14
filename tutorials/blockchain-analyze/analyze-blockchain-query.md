---
title: Analyze the Bitcoin blockchain - query the data
excerpt: Analyze the Bitcoin blockchain with Timescale hyperfunctions
products: [cloud]
keywords: [intermediate, crypto, blockchain, Bitcoin, finance, analytics]
layout_components: [next_prev_large]
content_group: Analyze the Bitcoin blockchain
---

# Analyze the data

When you have your dataset loaded, you can create some $CAGGs,
and start constructing queries to discover what your data tells you. This
tutorial uses [$COMPANY hyperfunctions][about-hyperfunctions] to construct
queries that are not possible in standard PostgreSQL.

In this section, you learn how to write queries that answer these questions:

*   [Is there any connection between the number of transactions and the transaction fees?](#is-there-any-connection-between-the-number-of-transactions-and-the-transaction-fees)
*   [Does the transaction volume affect the BTC-USD rate?](#does-the-transaction-volume-affect-the-btc-usd-rate)
*   [Do more transactions in a block mean the block is more expensive to mine?](#do-more-transactions-in-a-block-mean-the-block-is-more-expensive-to-mine)
*   [What percentage of the average miner's revenue comes from fees compared to block rewards?](#what-percentage-of-the-average-miners-revenue-comes-from-fees-compared-to-block-rewards)
*   [How does block weight affect miner fees?](#how-does-block-weight-affect-miner-fees)
*   [What's the average miner revenue per block?](#whats-the-average-miner-revenue-per-block)

## Create $CAGGs

You can use [$CAGGs][docs-cagg] to simplify and speed up your
queries. For this tutorial, you need three $CAGGs, focusing on
three aspects of the dataset: Bitcoin transactions, blocks, and coinbase
transactions. In each $CAGG definition, the `time_bucket()`
function controls how large the $TIME_BUCKETs are. The examples all use 1-hour
$TIME_BUCKETs.

<Procedure>

### $CAGG: transactions

1.  Connect to the $COMPANY database that contains the Bitcoin dataset.
1.  At the psql prompt, create a $CAGG called
    `one_hour_transactions`. This view holds aggregated data about each hour of
    transactions:

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

1.  Add a refresh policy to keep the $CAGG up-to-date:

    ```sql
    SELECT add_continuous_aggregate_policy('one_hour_transactions',
       start_offset => INTERVAL '3 hours',
       end_offset => INTERVAL '1 hour',
       schedule_interval => INTERVAL '1 hour');
    ```

1.  Create a $CAGG called `one_hour_blocks`. This view holds
    aggregated data about all the blocks that were mined each hour:

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

1.  Add a refresh policy to keep the $CAGG up-to-date:

    ```sql
    SELECT add_continuous_aggregate_policy('one_hour_blocks',
       start_offset => INTERVAL '3 hours',
       end_offset => INTERVAL '1 hour',
       schedule_interval => INTERVAL '1 hour');
    ```

1.  Create a $CAGG called `one_hour_coinbase`. This view holds
   aggregated data about all the transactions that miners received as rewards
   each hour:

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

1.  Add a refresh policy to keep the continuous aggregate $CAGG:

    ```sql
    SELECT add_continuous_aggregate_policy('one_hour_coinbase',
       start_offset => INTERVAL '3 hours',
       end_offset => INTERVAL '1 hour',
       schedule_interval => INTERVAL '1 hour');
    ```

</Procedure>

## Is there any connection between the number of transactions and the transaction fees?

Transaction fees are a major concern for blockchain users. If a blockchain is
too expensive, you might not want to use it. This query shows you whether
there's any correlation between the number of Bitcoin transactions and the fees.
The time range for this analysis is the last 2 days.

If you choose to visualize the query in Grafana, you can see the average
transaction volume and the average fee per transaction, over time. These trends
might help you decide whether to submit a transaction now or wait a few days for
fees to decrease.

<Procedure>

### Finding a connection between the number of transactions and the transaction fees

1.  Connect to the $COMPANY database that contains the Bitcoin dataset.
1.  At the psql prompt, use this query to average transaction volume and the
    fees from the `one_hour_transactions` $CAGG:

    ```sql
    SELECT
     bucket AS "time",
     tx_count as "tx volume",
     average(stats_fee_sat) as fees
    FROM one_hour_transactions
    WHERE bucket > NOW() - INTERVAL '2 days'
    ORDER BY 1;
    ```

1.  The data you get back looks a bit like this:

    ```sql
              time          | tx volume |        fees
    ------------------------+-----------+--------------------
     2023-06-13 08:00:00+00 |     20063 |  7075.682450281613
     2023-06-13 09:00:00+00 |     16984 |   7302.61716910033
     2023-06-13 10:00:00+00 |     15856 |  9682.086402623612
     2023-06-13 11:00:00+00 |     24967 |  5631.992550166219
     2023-06-13 12:00:00+00 |      8575 |  17594.24256559767
    ...
    ```

1.  [](#)<Optional />To visualize this in Grafana, create a new panel, select the
    Bitcoin dataset as your data source, and type the query from the previous
    step. In the `Format as` section, select `Time series`.

    <img
    class="main-content__illustration"
    src="https://assets.timescale.com/docs/images/grafana-transactions-fees.webp"
    width={1375} height={944}
    alt="Visualizing number of transactions and fees"
    />

</Procedure>

## Does the transaction volume affect the BTC-USD rate?

In cryptocurrency trading, there's a lot of speculation. You can adopt a
data-based trading strategy by looking at correlations between blockchain
metrics, such as transaction volume and the current exchange rate between
Bitcoin and US dollars.

If you choose to visualize the query in Grafana, you can see the average
transaction volume, along with the BTC to US dollar conversion rate.

<Procedure>

### Finding the transaction volume and the BTC-USD rate

1.  Connect to the $COMPANY database that contains the Bitcoin dataset.
1.  At the psql prompt, use this query to return the trading volume and the BTC
    to US dollar exchange rate:

    ```sql
    SELECT
     bucket AS "time",
     tx_count as "tx volume",
     total_fee_usd / (total_fee_sat*0.00000001) AS "btc-usd rate"
    FROM one_hour_transactions
    WHERE bucket > NOW() - INTERVAL '2 days'
    ORDER BY 1;
    ```

1.  The data you get back looks a bit like this:

    ```sql
              time          | tx volume |    btc-usd rate
    ------------------------+-----------+--------------------
     2023-06-13 08:00:00+00 |     20063 | 25975.888587931426
     2023-06-13 09:00:00+00 |     16984 |  25976.00446352126
     2023-06-13 10:00:00+00 |     15856 | 25975.988587014584
     2023-06-13 11:00:00+00 |     24967 |  25975.89166787936
     2023-06-13 12:00:00+00 |      8575 | 25976.004209699528
     ...
    ```

1.  [](#)<Optional />To visualize this in Grafana, create a new panel, select the
    Bitcoin dataset as your data source, and type the query from the previous
    step. In the `Format as` section, select `Time series`.
1.  [](#)<Optional />To make this visualization more useful, add an override to put
    the fees on a different Y-axis. In the options panel, add an override for
    the `btc-usd rate` field for `Axis > Placement` and choose `Right`.

    <img
    class="main-content__illustration"
    src="https://assets.timescale.com/docs/images/grafana-volume-rate.webp"
    width={1375} height={944}
    alt="Visualizing transaction volume and BTC-USD conversion rate"
    />

</Procedure>

## Do more transactions in a block mean the block is more expensive to mine?

The number of transactions in a block can influence the overall block mining
fee. For this analysis, a larger time frame is required, so increase the
analyzed time range to 5 days.

If you choose to visualize the query in Grafana, you can see that the more
transactions in a block, the higher the mining fee becomes.

<Procedure>

## Finding if more transactions in a block mean the block is more expensive to mine

1.  Connect to the $COMPANY database that contains the Bitcoin dataset.
1.  At the psql prompt, use this query to return the number of transactions in a
    block, compared to the mining fee:

    ```sql
    SELECT
     bucket as "time",
     avg(tx_count) AS transactions,
     avg(block_fee_sat)*0.00000001 AS "mining fee"
    FROM one_hour_blocks
    WHERE bucket > now() - INTERVAL '5 day'
    GROUP BY bucket
    ORDER BY 1;
    ```

1.  The data you get back looks a bit like this:

    ```sql
              time          |     transactions      |       mining fee
    ------------------------+-----------------------+------------------------
     2023-06-10 08:00:00+00 | 2322.2500000000000000 | 0.29221418750000000000
     2023-06-10 09:00:00+00 | 3305.0000000000000000 | 0.50512649666666666667
     2023-06-10 10:00:00+00 | 3011.7500000000000000 | 0.44783255750000000000
     2023-06-10 11:00:00+00 | 2874.7500000000000000 | 0.39303009500000000000
     2023-06-10 12:00:00+00 | 2339.5714285714285714 | 0.25590717142857142857
    ...
    ```

1.  [](#)<Optional />To visualize this in Grafana, create a new panel, select the
    Bitcoin dataset as your data source, and type the query from the previous
    step. In the `Format as` section, select `Time series`.
1.  [](#)<Optional />To make this visualization more useful, add an override to put
    the fees on a different Y-axis. In the options panel, add an override for
    the `mining fee` field for `Axis > Placement` and choose `Right`.

    <img
    class="main-content__illustration"
    src="https://assets.timescale.com/docs/images/grafana-transactions-miningfee.webp"
    width={1375} height={944}
    alt="Visualizing transactions in a block and the mining fee"
    />

</Procedure>

You can extend this analysis to find if there is the same correlation between
block weight and mining fee. More transactions should increase the block weight,
and boost the miner fee as well.

If you choose to visualize the query in Grafana, you can see the same kind of
high correlation between block weight and mining fee. The relationship weakens
when the block weight gets close to its maximum value, which is 4 million weight
units, in which case it's impossible for a block to include more transactions.

<Procedure>

### Finding if higher block weight means the block is more expensive to mine

1.  Connect to the $COMPANY database that contains the Bitcoin dataset.
1.  At the psql prompt, use this query to return the block weight, compared to
    the mining fee:

    ```sql
    SELECT
     bucket as "time",
     avg(block_weight) as "block weight",
     avg(block_fee_sat*0.00000001) as "mining fee"
    FROM one_hour_blocks
    WHERE bucket > now() - INTERVAL '5 day'
    group by bucket
    ORDER BY 1;
    ```

1.  The data you get back looks a bit like this:

    ```sql
              time          |     block weight     |       mining fee
    ------------------------+----------------------+------------------------
     2023-06-10 08:00:00+00 | 3992809.250000000000 | 0.29221418750000000000
     2023-06-10 09:00:00+00 | 3991766.333333333333 | 0.50512649666666666667
     2023-06-10 10:00:00+00 | 3992918.250000000000 | 0.44783255750000000000
     2023-06-10 11:00:00+00 | 3991873.000000000000 | 0.39303009500000000000
     2023-06-10 12:00:00+00 | 3992934.000000000000 | 0.25590717142857142857
    ...
    ```

1.  [](#)<Optional />To visualize this in Grafana, create a new panel, select the
    Bitcoin dataset as your data source, and type the query from the previous
    step. In the `Format as` section, select `Time series`.
1.  [](#)<Optional />To make this visualization more useful, add an override to put
    the fees on a different Y-axis. In the options panel, add an override for
    the `mining fee` field for `Axis > Placement` and choose `Right`.

    <img
    class="main-content__illustration"
    src="https://assets.timescale.com/docs/images/grafana-blockweight-miningfee.webp"
    width={1375} height={944}
    alt="Visualizing blockweight and the mining fee"
    />

</Procedure>

## What percentage of the average miner's revenue comes from fees compared to block rewards?

In the previous queries, you saw that mining fees are higher when block weights
and transaction volumes are higher. This query analyzes the data from a
different perspective. Miner revenue is not only made up of miner fees, it also
includes block rewards for mining a new block. This reward is currently 6.25
BTC, and it gets halved every four years. This query looks at how much of a
miner's revenue comes from fees, compares to block rewards.

If you choose to visualize the query in Grafana, you can see that most miner
revenue actually comes from block rewards. Fees never account for more than a
few percentage points of overall revenue.

<Procedure>

### Finding what percentage of the average miner's revenue comes from fees compared to block rewards

1.  Connect to the $COMPANY database that contains the Bitcoin dataset.
1.  At the psql prompt, use this query to return coinbase transactions, along
    with the block fees and rewards:

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

1.  The data you get back looks a bit like this:

    ```sql
              time          |          fees          |   reward
    ------------------------+------------------------+------------
     2023-06-10 08:00:00+00 | 0.28247062857142857143 | 6.25000000
     2023-06-10 09:00:00+00 | 0.50512649666666666667 | 6.25000000
     2023-06-10 10:00:00+00 | 0.44783255750000000000 | 6.25000000
     2023-06-10 11:00:00+00 | 0.39303009500000000000 | 6.25000000
     2023-06-10 12:00:00+00 | 0.25590717142857142857 | 6.25000000
    ...
    ```

1.  [](#)<Optional />To visualize this in Grafana, create a new panel, select the
    Bitcoin dataset as your data source, and type the query from the previous
    step. In the `Format as` section, select `Time series`.
1.  [](#)<Optional />To make this visualization more useful, stack the series to
    100%. In the options panel, in the `Graph styles` section, for
    `Stack series` select `100%`.

    <img
    class="main-content__illustration"
    src="https://assets.timescale.com/docs/images/grafana-coinbase-revenue.webp"
    width={1375} height={944}
    alt="Visualizing coinbase revenue sources"
    />

</Procedure>

## How does block weight affect miner fees?

You've already found that more transactions in a block mean it's more expensive
to mine. In this query, you ask if the same is true for block weights? The more
transactions a block has, the larger its weight, so the block weight and mining
fee should be tightly correlated. This query uses a 12-hour moving average to
calculate the block weight and block mining fee over time.

If you choose to visualize the query in Grafana, you can see that the block
weight and block mining fee are tightly connected. In practice, you can also see
the four million weight units size limit. This means that there's still room to
grow for individual blocks, and they could include even more transactions.

<Procedure>

### Finding how block weight affects miner fees

1.  Connect to the $COMPANY database that contains the Bitcoin dataset.
1.  At the psql prompt, use this query to return block weight, along with the
    block fees and rewards:

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
    ORDER BY 1;
    ```

1.  The data you get back looks a bit like this:

    ```sql
              time          |    block weight    |     mining fee
    ------------------------+--------------------+---------------------
     2023-06-10 09:00:00+00 | 3991766.3333333335 |  0.5051264966666666
     2023-06-10 10:00:00+00 | 3992424.5714285714 | 0.47238710285714286
     2023-06-10 11:00:00+00 |            3992224 | 0.44353000909090906
     2023-06-10 12:00:00+00 |  3992500.111111111 | 0.37056557222222225
     2023-06-10 13:00:00+00 |         3992446.65 | 0.39728022799999996
    ...
    ```

1.  [](#)<Optional />To visualize this in Grafana, create a new panel, select the
    Bitcoin dataset as your data source, and type the query from the previous
    step. In the `Format as` section, select `Time series`.
1.  [](#)<Optional />To make this visualization more useful, add an override to put
    the fees on a different Y-axis. In the options panel, add an override for
    the `mining fee` field for `Axis > Placement` and choose `Right`.

    <img
    class="main-content__illustration"
    src="https://assets.timescale.com/docs/images/grafana-blockweight-rewards.webp"
    width={1375} height={944}
    alt="Visualizing block weight and mining fees"
    />

</Procedure>

## What's the average miner revenue per block?

In this final query, you analyze how much revenue miners actually generate by
mining a new block on the blockchain, including fees and block rewards. To make
the analysis more interesting, add the Bitcoin to US Dollar exchange rate, and
increase the time range.

<Procedure>

### Finding the average miner revenue per block

1.  Connect to the $COMPANY database that contains the Bitcoin dataset.
1.  At the psql prompt, use this query to return the average miner revenue per
    block, with a 12-hour moving average:

    ```sql
    SELECT
       bucket as "time",
       average_y(rolling(stats_miner_revenue) OVER (ORDER BY bucket RANGE '12 hours' PRECEDING))*0.00000001 AS "revenue in BTC",
        average_x(rolling(stats_miner_revenue) OVER (ORDER BY bucket RANGE '12 hours' PRECEDING)) AS "revenue in USD"
    FROM one_hour_coinbase
    WHERE bucket > NOW() - INTERVAL '5 days'
    ORDER BY 1;
    ```

1.  The data you get back looks a bit like this:

    ```sql
              time          |   revenue in BTC   |   revenue in USD
    ------------------------+--------------------+--------------------
     2023-06-09 14:00:00+00 |       6.6732841925 |        176922.1133
     2023-06-09 15:00:00+00 |  6.785046736363636 |  179885.1576818182
     2023-06-09 16:00:00+00 |       6.7252952905 | 178301.02735000002
     2023-06-09 17:00:00+00 |  6.716377454814815 |  178064.5978074074
     2023-06-09 18:00:00+00 |    6.7784206471875 |   179709.487309375
    ...
    ```

1.  [](#)<Optional />To visualize this in Grafana, create a new panel, select the
    Bitcoin dataset as your data source, and type the query from the previous
    step. In the `Format as` section, select `Time series`.
1.  [](#)<Optional />To make this visualization more useful, add an override to put
    the US Dollars on a different Y-axis. In the options panel, add an override
    for the `mining fee` field for `Axis > Placement` and choose `Right`.

    <img
    class="main-content__illustration"
    src="https://assets.timescale.com/docs/images/grafana-blockweight-revenue.webp"
    width={1375} height={944}
    alt="Visualizing block revenue over time"
    />

</Procedure>

[docs-cagg]: /use-timescale/:currentVersion:/continuous-aggregates/
[about-hyperfunctions]: https://docs.timescale.com/use-timescale/latest/hyperfunctions/about-hyperfunctions/
