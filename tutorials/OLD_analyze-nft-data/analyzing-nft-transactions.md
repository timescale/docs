---
title: Analyzing NFT transactions
excerpt: Analyze NFT transactions from the OpenSea marketplace
products: [cloud, mst, self_hosted]
keywords: [crypto, blockchain, finance, analytics]
tags: [nft]
layout_components: [next_prev_large]
content_group: Analyze NFT data
---

# Analyzing NFT transactions

When you have successfully collected and ingested the data, it's time to analyze
it. For this analysis, we use data collected with our ingestion script that
contains only successful sale transactions that happened between
January 1, 2021 to October 12, 2021 on the OpenSea marketplace, as reported by the
OpenSea API.

For simplicity, this tutorial analyzes only those transactions that used `ETH`
as their payment symbol, but you can modify the script to include more
payment symbols in your analysis if you want to.

All the queries in this section, plus some additional ones, are in our
[NFT Starter Kit on GitHub][nft-starter-kit]
in the [`queries.sql` file][queries].

We divide our analysis into two parts: simple queries and complex queries. But
first we create something to speed up our queries: TimescaleDB continuous
aggregates.

<Highlight type="note">
All queries in this section only include data that's accessible from the
OpenSea API.
</Highlight>

## Speeding up queries with continuous aggregates

TimescaleDB continuous aggregates speed up workloads that need to process large
amounts of data. They look like PostgreSQL materialized views, but have a
built-in refresh policy that makes sure that the data is up to date as new
data comes in. Additionally, the refresh procedure is careful to only refresh
data in the materialized view that actually needs to be changed, thereby
avoiding recomputation of data that did not change. This smart refresh procedure
massively improves the refresh performance of the materialized view and the
refresh policy ensures that the data is always up to date.

[Continuous aggregates][cont-agg] are often used to speed up dashboards and
visualizations, summarizing data sampled at high frequency, and querying
downsampled data over long time periods.

This tutorial creates two continuous aggregates to speed up queries on assets
and on collections.

### Assets continuous aggregates

Create a new continuous aggregate called `assets_daily` that computes and stores
the following information about all assets for each day: `asset_id`, the collection
it belongs to, `daily average price`, `median price`, `sale volume`, `ETH volume`,
`open`, `high`, `low` and `close` prices:

```sql
/* Asset continuous aggregates */
CREATE MATERIALIZED VIEW assets_daily
WITH (timescaledb.continuous) AS
SELECT time_bucket('1 day', time) AS bucket,
asset_id,
collection_id,
mean(percentile_agg(total_price)) AS mean_price,
approx_percentile(0.5, percentile_agg(total_price)) AS median_price,
COUNT(*) AS volume,
SUM(total_price) AS volume_eth,
FIRST(total_price, time) AS open_price,
MAX(total_price) AS high_price,
MIN(total_price) AS low_price,
LAST(total_price, time) AS close_price
FROM nft_sales
WHERE payment_symbol = 'ETH'
GROUP BY bucket, asset_id, collection_id
```

Add a refresh policy to update the continuous aggregate daily with the latest data,
so that you can save
computation at query time:

```sql
SELECT add_continuous_aggregate_policy('assets_daily',
    start_offset => INTERVAL '3 days',
    end_offset => INTERVAL '1 day',
    schedule_interval => INTERVAL '1 day');
```

### Collections continuous aggregates

Create another continuous aggregate called `collections_daily` that computes and
stores the following information about all collections for each day,
including `daily average price`, `median price`, `sale volume`,  `ETH volume`,
`the most expensive nft`, and `the highest price`:

```sql
/* Collection continuous aggregates */
CREATE MATERIALIZED VIEW collections_daily
WITH (timescaledb.continuous) AS
SELECT
collection_id,
time_bucket('1 day', time) AS bucket,
mean(percentile_agg(total_price)) AS mean_price,
approx_percentile(0.5, percentile_agg(total_price)) AS median_price,
COUNT(*) AS volume,
SUM(total_price) AS volume_eth,
LAST(asset_id, total_price) AS most_expensive_nft_id,
MAX(total_price) AS max_price
FROM nft_sales
GROUP BY bucket, collection_id;

/* Refresh policy */
SELECT add_continuous_aggregate_policy('collections_daily',
    start_offset => INTERVAL '3 days',
    end_offset => INTERVAL '1 day',
    schedule_interval => INTERVAL '1 day');
```

When you are asking questions where daily aggregations can help with the answer,
you can query the continuous aggregate, rather than the raw data in the `nft_sales`
hypertable. This helps speed up the result.

## Simple queries

You can start your analysis by asking simple questions about NFT sales that
happened in 2021 and answering them using SQL queries. Use these queries
as a starting point for your own further analysis. You can modify each query
to analyze the time-period, asset, collection, or account that you are curious about!

Where possible, we include dashboard examples from Superset to serve as
inspiration for creating your own dashboard which monitors and analyzes NFT
sales using free, open-source tools. You can find the code used to create each
graph in the [NFT Starter Kit Github repo][nft-starter-kit].

### Collections with the highest sales volume

Which collections have the highest volume of sales? Answering this is a great
starting point for finding collections with assets that are frequently traded,
which is important for buyers thinking about the resale value of their NFTs. If
you buy an NFT in one of the collections below, there is a good chance you'll
be able to find a buyer. In this query, you order the collections by total volume
of sales, but you could also order them by ETH volume instead:

```sql
/* Collections with the highest volume? */
SELECT
slug,
SUM(volume) total_volume,
SUM(volume_eth) total_volume_eth
FROM collections_daily cagg
INNER JOIN collections c ON cagg.collection_id = c.id
GROUP BY cagg.collection_id, slug
ORDER BY total_volume DESC;
```

| slug               | total_volume | total_volume_eth   |
|--------------------|--------------|--------------------|
| sorare             | 339776       | 35113.062124036835 |
| rarible            | 87594        | 41663.18012651946  |
| art-blocks-factory | 45861        | 43607.73207320631  |
| axie               | 43074        | 6692.242340266918  |
| cryptokitties      | 41300        | 5560.907800845506  |
| parallelalpha      | 36892        | 31212.686399159273 |
| art-blocks         | 35976        | 199016.27793424827 |
| ape-gang           | 25782        | 4663.009300672081  |
| 24px               | 24872        | 3203.9084810874024 |
| pudgypenguins      | 24165        | 35949.81731415086  |

For this query, you take advantage of the pre-calculated data about collections
stored in the `collections_daily` continuous aggregate. You also perform an
`INNER JOIN` on the collections relational table to find the
collection name in human readable form, represented by the `slug`.

Querying from continuous aggregates is faster and allows you to write shorter,
more readable queries. It is a pattern that you'll use again in this tutorial,
so look out for it!

### Daily sales of a collection

How many sales took place each day for a certain collection? This query looks
at the daily volume of sales for NFTs in the `cryptokitties` collection. This
can help you find which days the NFT traders have been more active, and help you
spot patterns about which days of the week or month have higher or lower volume and why.

You can modify this query to look at your favorite NFT collection, such as
`cryptopunks`, `lazy-lions`, or `afrodroids-by-owo`:

```sql
SELECT bucket, slug, volume
FROM collections_daily cagg
INNER JOIN collections c ON cagg.collection_id = c.id
WHERE slug = 'cryptokitties'
ORDER BY bucket DESC;
```

bucket             |slug         |volume|
-------------------|-------------|------|
2021-10-12 02:00:00|cryptokitties|    48|
2021-10-11 02:00:00|cryptokitties|    61|
2021-10-10 02:00:00|cryptokitties|    84|
2021-10-09 02:00:00|cryptokitties|    73|
2021-10-08 02:00:00|cryptokitties|    56|
...

Here's what this query would look like as a time-series chart in Apache Superset:

![daily number of nft transactions](https://assets.timescale.com/docs/images/tutorials/nft-tutorial/daily-number-of-nft-transactions.jpg)

As a reminder, charts like this are pre-built and ready for you to use and
modify as part of the pre-built dashboards
in our [NFT Starter Kit][nft-starter-kit].

### Comparison of daily NFT sales for different collections

How do the daily sales of NFTs in one collection compare to that of another
collection? This query compares the daily sales of two popular NFT collections:
CryptoKitties and Ape Gang, in the past three months:

```sql
/* Daily number of NFT transactions, "CryptoKitties" vs Ape Gang from past 3 months? */
SELECT bucket, slug, volume
FROM collections_daily cagg
INNER JOIN collections c ON cagg.collection_id = c.id
WHERE slug IN ('cryptokitties', 'ape-gang') AND bucket > NOW() - INTERVAL '3 month'
ORDER BY bucket DESC, slug;
```

bucket             |slug         |volume|
-------------------|-------------|------|
2021-10-12 02:00:00|ape-gang     |    58|
2021-10-12 02:00:00|cryptokitties|    48|
2021-10-11 02:00:00|ape-gang     |   208|
2021-10-11 02:00:00|cryptokitties|    61|
2021-10-10 02:00:00|ape-gang     |   248|
2021-10-10 02:00:00|cryptokitties|    84|
...

![comparison of different collections](https://assets.timescale.com/docs/images/tutorials/nft-tutorial/comparison-of-different-collections.jpg)

This sort of query is useful to track sales activity in collections you're
interested in or own assets in, so you can see the activity of other NFT holders.
Also, you can modify the time-period under consideration to look at larger
(such as 9 months), or smaller (such as 14 days) periods of time.

### Snoop Dogg's NFT activity (or individual account activity)

How many NFTs did a particular person buy in a certain period of time? This
sort of query is useful to monitor the activity of popular NFT collectors,
like American rapper Snoop Dogg (or [Cozomo_de_Medici][snoop-dogg-opensea]) or
African NFT evangelist [Daliso Ngoma][daliso-opensea] or even compare trading
patterns of multiple collectors. Since NFT transactions are public on the Ethereum
blockchain and our database contains seller (`seller_account`) and
buyer (`winner_account`) columns as well, you can analyze the purchase
activity of a specific account.

This query uses Snoop Dogg's address to analyze his trades, but you can edit the
query to add any address in the `WHERE` clause to see the specified account's
transactions:

```sql
/* Snoop Dogg's transactions in the past 3 months aggregated */
WITH snoop_dogg AS (
    SELECT id FROM accounts
    WHERE address = '0xce90a7949bb78892f159f428d0dc23a8e3584d75'
)
SELECT
COUNT(*) AS trade_count,
COUNT(DISTINCT asset_id) AS nft_count,
COUNT(DISTINCT collection_id) AS collection_count,
COUNT(*) FILTER (WHERE seller_account = (SELECT id FROM snoop_dogg)) AS sale_count,
COUNT(*) FILTER (WHERE winner_account = (SELECT id FROM snoop_dogg)) AS buy_count,
SUM(total_price) AS total_volume_eth,
AVG(total_price) AS avg_price,
MIN(total_price) AS min_price,
MAX(total_price) AS max_price
FROM nft_sales
WHERE payment_symbol = 'ETH' AND ( seller_account = (SELECT id FROM snoop_dogg) OR winner_account = (SELECT id FROM snoop_dogg) )
AND time > NOW()-INTERVAL '3 months'
```

trade_count|nft_count|collection_count|sale_count|buy_count|total_volume_eth  |avg_price         |min_price|max_price|
-----------|---------|----------------|----------|---------|------------------|------------------|---------|---------|
        59|       57|              20|         1|       58|1835.5040000000006|31.110237288135604|      0.0|   1300.0|

From the result of the query, we can see that Snoop Dogg made 59 trades overall in the past 3 months (bought 58 times,
and sold only once). His trades included 57 individual NFTs and 23 collections, totaling 1835.504 ETH spent, with
minimum paid price of 0 and max of 1300 ETH.

### Most expensive asset in a collection

Whats the most expensive NFT in a certain collection? This query looks at a
specific collection (CryptoKitties) and finds the most expensive NFT sold from it.
This can help you find the rarest items in a collection and look at the properties
that make it rare in order to help you buy items with similar properties from that collection:

```sql
/* Top 5 most expensive NFTs in the CryptoKitties collection */
SELECT a.name AS nft, total_price, time, a.url  FROM nft_sales s
INNER JOIN collections c ON c.id = s.collection_id
INNER JOIN assets a ON a.id = s.asset_id
WHERE slug = 'cryptokitties' AND payment_symbol = 'ETH'
ORDER BY total_price DESC
LIMIT 5
```

<!-- markdown-link-check-disable -->
<!-- vale Google.Units = NO -->

nft            |total_price|time               |url                                                                    |
---------------|-----------|-------------------|-----------------------------------------------------------------------|
Founder Cat #40|      225.0|2021-09-03 14:59:16|<https://opensea.io/assets/0x06012c8cf97bead5deae237070f9587f8e7a266d/40>|
Founder Cat #17|      177.0|2021-09-03 01:58:13|<https://opensea.io/assets/0x06012c8cf97bead5deae237070f9587f8e7a266d/17>|
润龙🐱‍👓创世猫王44# |      150.0|2021-09-03 02:01:11|<https://opensea.io/assets/0x06012c8cf97bead5deae237070f9587f8e7a266d/44>|
grey           |      149.0|2021-09-03 02:32:26|<https://opensea.io/assets/0x06012c8cf97bead5deae237070f9587f8e7a266d/16>|
Founder Cat #38|      148.0|2021-09-03 01:58:13|<https://opensea.io/assets/0x06012c8cf97bead5deae237070f9587f8e7a266d/38>|

<!-- vale Google.Units = YES -->
<!-- markdown-link-check-enable -->

### Daily ETH volume of assets in a collection

What is the daily volume of Ether (ETH) for a specific collection? Using the
example of CryptoKitties, this query calculates the daily total ETH spent in
sales of NFTs in a certain collection:

```sql
/* Daily ETH volume of CryptoKitties NFT transactions? */
SELECT bucket, slug, volume_eth
FROM collections_daily cagg
INNER JOIN collections c ON cagg.collection_id = c.id
WHERE slug = 'cryptokitties'
ORDER BY bucket DESC;
```

bucket             |slug         |volume_eth         |
-------------------|-------------|-------------------|
2021-10-12 02:00:00|cryptokitties| 1.6212453906698892|
2021-10-11 02:00:00|cryptokitties| 1.8087566697786246|
2021-10-10 02:00:00|cryptokitties|  2.839395250444516|
2021-10-09 02:00:00|cryptokitties|  4.585460691370447|
2021-10-08 02:00:00|cryptokitties|   5.36784615406771|
2021-10-07 02:00:00|cryptokitties| 16.591879406085422|
2021-10-06 02:00:00|cryptokitties| 11.390538587035808|
...

![daily eth volume of assets](https://assets.timescale.com/docs/images/tutorials/nft-tutorial/daily-eth-volume-of-assets.jpg)

<Highlight type="note">
This graph uses a logarithmic scale, which you can configure in the graph's settings in Superset.
</Highlight>

### Comparison of daily ETH volume of multiple collections

How does the daily volume of ETH spent on assets in one collection compare to
others? This query uses CryptoKitties and Ape Gang as examples, to find the daily
ETH spent on buying assets in those collections in the past three months. You
can extend this query to monitor and compare the daily volume spent on your
favorite NFT collections and find patterns in sales:

```sql
/* Daily ETH volume of NFT transactions: CryptoKitties vs Ape Gang? */
SELECT bucket, slug, volume_eth
FROM collections_daily cagg
INNER JOIN collections c ON cagg.collection_id = c.id
WHERE slug IN ('cryptokitties', 'ape-gang') AND bucket > NOW() - INTERVAL '3 month'
ORDER BY bucket, slug DESC;
```

bucket             |slug         |volume_eth        |
-------------------|-------------|------------------|
2021-10-12 02:00:00|ape-gang     | 54.31030000000001|
2021-10-12 02:00:00|cryptokitties|1.6212453906698896|
2021-10-11 02:00:00|ape-gang     |205.19786218340954|
2021-10-11 02:00:00|cryptokitties|1.8087566697786257|
2021-10-10 02:00:00|ape-gang     | 240.0944201232798|
2021-10-10 02:00:00|cryptokitties| 2.839395250444517|
...

![comparison-daily-eth-volume-collections](https://assets.timescale.com/docs/images/tutorials/nft-tutorial/comparison-daily-eth-volume-collections.jpg)

<Highlight type="note">
The graph above uses a logarithmic scale, which we configured in the graph's
settings in Superset.
</Highlight>

### Daily mean and median sale price of assets in a collection

When you are analyzing the daily price of assets in a specific collection, two
useful statistics to use are the mean price and the median price. This query
finds the daily mean and median sale prices of assets in the CryptoKitties collection:

```sql
/* Mean vs median sale price of CryptoKitties? */
SELECT bucket, slug, mean_price, median_price
FROM collections_daily cagg
INNER JOIN collections c ON cagg.collection_id = c.id
WHERE slug = 'cryptokitties'
ORDER BY bucket DESC;
```

bucket             |slug         |mean_price          |median_price         |
-------------------|-------------|--------------------|---------------------|
2021-10-12 02:00:00|cryptokitties| 0.03377594563895602|  0.00600596459124994|
2021-10-11 02:00:00|cryptokitties|0.029651748684895486| 0.008995758681494385|
2021-10-10 02:00:00|cryptokitties| 0.03380232441005376|  0.00600596459124994|
2021-10-09 02:00:00|cryptokitties| 0.06281453001877325| 0.010001681651251936|
2021-10-08 02:00:00|cryptokitties| 0.09585439560835196| 0.010001681651251936|
...

![daily mean median](https://assets.timescale.com/docs/images/tutorials/nft-tutorial/daily-mean-median.jpg)

Since calculating the mean and median are computationally expensive for large
datasets, we use the [`percentile_agg` hyperfunction][percentile-agg], a SQL
function that is part of the Timescale Toolkit extension. It accurately
approximates both statistics, as shown in the definition of `mean_price` and
`median_price` in the continuous aggregate we created earlier in the tutorial:

```sql
CREATE MATERIALIZED VIEW collections_daily
WITH (timescaledb.continuous) AS
SELECT
collection_id,
time_bucket('1 day', time) AS bucket,
mean(percentile_agg(total_price)) AS mean_price,
approx_percentile(0.5, percentile_agg(total_price)) AS median_price,
COUNT(*) AS volume,
SUM(total_price) AS volume_eth,
LAST(asset_id, total_price) AS most_expensive_nft,
MAX(total_price) AS max_price
FROM nft_sales s
GROUP BY bucket, collection_id;
```

### Daily total volume of  top buyers

What days do the most prolific accounts buy on? To answer that question, you
can analyze the top five NFT buyer accounts based on the number of NFT purchases,
and their total daily volume of NFT bought over time. This is a good starting
point to dig deeper into the analysis, as it can help you find days when something
happened that made these users buy a lot of NFTs. For example a dip in ETH prices,
leading to lower gas fees, or drops of high anticipated collections:

```sql
/* Daily total volume of the 5 top buyers */
WITH top_five_buyers AS (
   SELECT winner_account FROM nft_sales
   GROUP BY winner_account
   ORDER BY count(*) DESC
   LIMIT 5
)
SELECT time_bucket('1 day', time) AS bucket, count(*) AS total_volume FROM nft_sales
WHERE winner_account IN (SELECT winner_account FROM top_five_buyers)
GROUP BY bucket
ORDER BY bucket DESC
```

![volume top buyers](https://assets.timescale.com/docs/images/tutorials/nft-tutorial/volume-top-buyers.jpg)

## Complex queries

Let's take a look at some more complex questions you can ask about the NFT
dataset, as well as more complex queries to
retrieve interesting things.

### Calculating 30-min mean and median sale prices of highest trade count NFT from yesterday

What are the mean and median sales prices of the highest traded NFT from the
past day, in 30-minute intervals?

```sql
/* Calculating 15-min mean and median sale prices of highest trade count NFT on 2021-10-17 */
WITH one_day AS (
   SELECT time, asset_id, total_price FROM nft_sales
   WHERE time >= '2021-10-17' AND time < '2021-10-18' AND payment_symbol = 'ETH'
)
SELECT time_bucket('30 min', time) AS bucket,
assets.name AS nft,
mean(percentile_agg(total_price)) AS mean_price,
approx_percentile(0.5, percentile_agg(total_price)) AS median_price
FROM one_day
INNER JOIN assets ON assets.id = one_day.asset_id
WHERE asset_id = (SELECT asset_id FROM one_day GROUP BY asset_id ORDER BY count(*) DESC LIMIT 1)
GROUP BY bucket, nft
ORDER BY bucket DESC;
```

bucket             |nft           |mean_price         |median_price        |
-------------------|--------------|-------------------|--------------------|
2021-10-17 23:30:00|Zero [Genesis]|               0.06| 0.06002456177152414|
2021-10-17 23:00:00|Zero [Genesis]|              0.118|  0.1180081944620535|
2021-10-17 22:30:00|Zero [Genesis]|       0.0785333333| 0.06002456177152414|
2021-10-17 22:00:00|Zero [Genesis]|             0.0775| 0.09995839119153871|
2021-10-17 21:30:00|Zero [Genesis]|             0.0555| 0.05801803032917102|

This is a more complex query which uses PostgreSQL Common Table Expressions (CTE)
to first create a sub-table of the data from the past day, called `one_day`.
Then you use the hyperfunction time_bucket to create 30-minute buckets of our data
and use the [percentile_agg hyperfunction][percentile-agg] to find the mean and
median prices for each interval period. Finally, you JOIN on the `assets` table
to get the name of the specific NFT in order to return it along with the mean and
median price for each time interval.

### Daily OHLCV data per asset

Open-high-low-close-volume (OHLCV) charts are most often used to illustrate the
price of a financial instrument, most commonly stocks, over time. You can create
OHLCV charts for a single NFT, or get the OHLCV values for a set of NFTs.

This query finds the OHLCV for NFTs with more than 100 sales in a day, as well
as the day on which the trades occurred:

```sql
/* Daily OHLCV per asset */
SELECT time_bucket('1 day', time) AS bucket, asset_id,
FIRST(total_price, time) AS open_price, LAST(total_price, time) AS close_price,
MIN(total_price) AS low_price, MAX(total_price) AS high_price,
count(*) AS volume
FROM nft_sales
WHERE payment_symbol = 'ETH'
GROUP BY bucket, asset_id
HAVING count(*) > 100
ORDER BY bucket
LIMIT 5;
```

bucket             |asset_id|open_price|close_price|low_price  |high_price|volume|
-------------------|--------|----------|-----------|-----------|----------|------|
2021-02-03 01:00:00|17790698|      0.56|       1.25|       0.07|       7.0|   148|
2021-02-05 01:00:00|17822636|       7.0|        0.7|        0.7|       8.4|   132|
2021-02-11 01:00:00|17927258|       0.8|        0.2|        0.1|       2.0|   103|
2021-02-26 01:00:00|18198072|       0.1|        0.1|        0.1|       0.1|   154|
2021-02-26 01:00:00|18198081|      0.25|       0.25|       0.25|      0.25|   155|

In this query, you used the TimescaleDB hyperfunctions [`first()`][first-docs] and
[`last()`][last-docs] to find the open and close prices respectively. These
hyperfunctions allow you to find the value of one column as ordered by another,
by performing a sequential scan through their groups. In this case, you get the
first and last values of the `total_price` column, as ordered by
the `time` column. [See the docs for more information.][first-docs]

If you want to run this query regularly, you can create a continuous aggregate
for it, which greatly improves the query performance. Moreover, you can remove
the `LIMIT 5` and replace it with an additional WHERE clause filtering for a
specific time-period to make the query more useful.

### Assets with the biggest intraday price change

Which assets had the biggest intraday sale price change? You can identify
interesting behaviour such as an asset being bought and then sold again for a
much higher (or lower) amount within the same day. This can help you
identify good flips of NFTs, or perhaps owners whose brand elevated the
NFT price thanks to it being part of their collection.

This query finds the assets with the biggest intraday sale price change in the
last six months:

```sql
/* Daily assets sorted by biggest intraday price change in the last 6 month*/
WITH top_assets AS (
 SELECT time_bucket('1 day', time) AS bucket, asset_id,
 FIRST(total_price, time) AS open_price, LAST(total_price, time) AS close_price,
 MAX(total_price)-MIN(total_price) AS intraday_max_change
 FROM nft_sales s
 WHERE payment_symbol = 'ETH' AND time > NOW() - INTERVAL '6 month'
 GROUP BY bucket, asset_id
 ORDER BY intraday_max_change DESC
 LIMIT 5
)
SELECT bucket, nft, url,
        open_price, close_price,
 intraday_max_change
FROM top_assets ta
INNER JOIN LATERAL (
 SELECT name AS nft, url FROM assets a
 WHERE a.id = ta.asset_id
) assets ON TRUE;```
```

<!-- markdown-link-check-disable -->
<!-- vale Google.Units = NO -->

bucket             |nft           |url                                                                           |open_price|close_price|intraday_max_change|
-------------------|--------------|------------------------------------------------------------------------------|----------|-----------|-------------------|
2021-09-22 02:00:00|Page          |<https://opensea.io/assets/0xa7206d878c5c3871826dfdb42191c49b1d11f466/1>        |      0.72|     0.9999|           239.2889|
2021-09-23 02:00:00|Page          |<https://opensea.io/assets/0xa7206d878c5c3871826dfdb42191c49b1d11f466/1>        |    0.9999|       1.14|              100.0|
2021-09-27 02:00:00|Skulptuur #647|<https://opensea.io/assets/0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270/173000647>|      25.0|       90.0|               65.0|
2021-09-25 02:00:00|Page          |<https://opensea.io/assets/0xa7206d878c5c3871826dfdb42191c49b1d11f466/1>        |      1.41|      1.475|               61.3|
2021-09-26 02:00:00|Page          |<https://opensea.io/assets/0xa7206d878c5c3871826dfdb42191c49b1d11f466/1>        |      1.48|      4.341|              43.05|

<!-- vale Google.Units = YES -->
<!-- markdown-link-check-enable -->

## Resources and next steps

This section contains information about what to do when you've completed the
tutorial, and some links to more resources.

### Claim your limited edition Time Travel Tigers NFT

The first 20 people to complete this tutorial can earn a limited edition NFT
from the
[Time Travel Tigers collection][eon-collection], for free!

Now that you've completed the tutorial, all you need to do is answer the questions
in [this form][nft-form] (including the challenge question), and we'll send one
of the limited-edition Eon NFTs to your ETH address (at no cost to you!).

You can see all NFTs in the Time Travel Tigers collection live on [OpenSea][eon-collection].

### Build on the NFT Starter Kit

Congratulations! You're now up and running with NFT data and TimescaleDB. Check out
our [NFT Starter Kit][nft-starter-kit] to use as your starting point to
build your own, more complex NFT analysis projects.

The Starter Kit contains:

*   A data ingestion script, which collects real-time data from OpenSea and ingests it into TimescaleDB
*   A sample dataset, to get started quickly, if you don't want to ingest real-time data
*   A schema for storing NFT sales, assets, collections, and owners
*   A local TimescaleDB database, pre-loaded with sample NFT data
*   Pre-built dashboards and charts in [Apache Superset][superset] and [Grafana][grafana]
for visualizing your data analysis
*   Queries to use as a starting point for your own analysis

### Learn more about how to use TimescaleDB to store and analyze crypto data

Check out these resources for more about using TimescaleDB with crypto data:

*   [Analyze cryptocurrency market data][analyze-cryptocurrency]
*   [Analyzing Analyzing Bitcoin, Ethereum, and 4100+ other cryptocurrencies using PostgreSQL and TimescaleDB][analyze-bitcoin]
*   [Learn how TimescaleDB user Messari uses data to open the crypto economy to everyone][messari]
*   [How one TimescaleDB user built a successful crypto trading bot][trading-bot]

[analyze-bitcoin]: https://blog.timescale.com/blog/analyzing-bitcoin-ethereum-and-4100-other-cryptocurrencies-using-postgresql-and-timescaledb/
[analyze-cryptocurrency]: /tutorials/:currentVersion:/blockchain-analyze/
[cont-agg]: /use-timescale/:currentVersion:/continuous-aggregates
[daliso-opensea]: https://opensea.io/daliso
[eon-collection]: https://opensea.io/collection/time-travel-tigers-by-timescale
[first-docs]: /api/:currentVersion:/hyperfunctions/first/
[grafana]: https://grafana.com
[last-docs]: /api/:currentVersion:/hyperfunctions/last
[messari]: https://blog.timescale.com/blog/how-messari-uses-data-to-open-the-cryptoeconomy-to-everyone/
[nft-form]: https://docs.google.com/forms/d/e/1FAIpQLSdZMzES-vK8K_pJl1n7HWWe5-v6D9A03QV6rys18woGTZr0Yw/viewform?usp=sf_link
[nft-starter-kit]: https://github.com/timescale/nft-starter-kit
[percentile-agg]: /api/:currentVersion:/hyperfunctions/percentile-approximation/uddsketch/#percentile_agg
[queries]: https://github.com/timescale/nft-starter-kit/blob/master/queries.sql
[snoop-dogg-opensea]: https://opensea.io/Cozomo_de_Medici
[superset]: https://superset.apache.org
[trading-bot]: https://blog.timescale.com/blog/how-i-power-a-successful-crypto-trading-bot-with-timescaledb/
