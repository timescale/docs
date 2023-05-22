---
title: Analyze cryptocurrency market data
excerpt: Analyze a time-series cryptocurrency dataset with TimescaleDB
products: [cloud, mst, self_hosted]
keywords: [crypto, finance, analytics]
---

# Analyze cryptocurrency market data

This tutorial is a step-by-step guide on how to analyze a time-series
cryptocurrency dataset using TimescaleDB. The instructions in this tutorial
were used to create [this analysis of 4100+ cryptocurrencies][crypto-blog].

The tutorial covers these steps:

1.  Design our database schema
1.  Create a dataset using publicly available cryptocurrency pricing data
1.  Load the dataset into TimescaleDB
1.  Query the data in TimescaleDB

You can
[skip ahead to the TimescaleDB portion](#load-the-dataset-into-timescaledb)
if you would prefer not to run through the scripts to create your database
schema or your dataset.

You can also download the resources for this tutorial:

*   Schema creation script: <Tag type="download" >[schema.sql](https://github.com/timescale/examples/blob/master/crypto_tutorial/schema.sql)</Tag>
*   Dataset creation script: <Tag type="download" >[crypto_data_extraction.py](https://github.com/timescale/examples/blob/master/crypto_tutorial/crypto_data_extraction.py)</Tag>
<!-- vale Google.Units = NO -->
*   Dataset: <Tag type="download" >[Crypto Currency Dataset September 2019](https://github.com/timescale/examples/tree/master/crypto_tutorial/Cryptocurrency%20dataset%20Sept%2016%202019)</Tag> (Note that this data is from
    September 2019. Follow the steps in Section 2 of this tutorial if you require fresh data)
<!-- vale Google.Units = YES -->

## Prerequisites

To complete this tutorial, you need a cursory knowledge of the Structured Query
Language (SQL). The tutorial walks you through each SQL command, but it is
helpful if you've seen SQL before.

To start, [install TimescaleDB][install-timescale]. When your installation is
complete, you can start ingesting or creating sample data.

This tutorial leads directly into a second tutorial that covers
[how Timescale can be used with Tableau][tableau-tutorial] to visualize
time-series data.

## Design the database schema

When you have a new database up and running, you need some data to insert into
it. Before you get data for analysis, you need to define what kind of data you
want to perform queries on.

In this analysis, we have two main goals:

*   Explore the price of Bitcoin and Ethereum, expressed in different fiat
    currencies, over time.
*   Explore the price of different cryptocurrencies, expressed in Bitcoin, over
    time.

Some questions you might want to ask:

*   How has Bitcoin's price in USD varied over time?
*   How has Ethereum's price in ZAR varied over time?
*   How has Bitcoin's trading volume in KRW increased or decreased over time?
*   Which crypto-currency has the greatest trading volume in the last two weeks?
*   Which day was Bitcoin most profitable?
*   Which are the most profitable new coins from the past three months?

Understanding the questions you want to ask of the data helps to inform your
schema definition.

These requirements lead us to four tables. We need three TimescaleDB
hypertables, called `btc_prices`, `crypto_prices`, and `eth_prices`, and one
relational table, called `currency_info`.

The `btc_prices` and `eth_prices` hypertables contain data about Bitcoin prices
in 17 different fiat currencies since 2010. This is the Bitcoin table, but the
Ethereum table is very similar:

|Field|Description|
|-|-|
|`time`|The day-specific timestamp of the price records, with time given as the default 00:00:00+00|
|`opening_price`|The first price at which the coin was exchanged that day|
|`highest_price`|The highest price at which the coin was exchanged that day|
|`lowest_price`|The lowest price at which the coin was exchanged that day|
|`closing_price`|The last price at which the coin was exchanged that day|
|`volume_btc`|The volume exchanged in the cryptocurrency value that day, in BTC|
|`volume_currency`|The volume exchanged in its converted value for that day, quoted in the corresponding fiat currency|
|`currency_code`|Corresponds to the fiat currency used for non-BTC prices/volumes|

Finally, the `currency_info` table maps the currency's code to its
English-language name:

|Field|Description|
|-|-|
|`currency_code`|2-7 character abbreviation for currency. Used in other hypertables|
|`currency`|English name of currency|

When you have established the schema for the tables in the database, you can
formulate `create_table` SQL statements to actually create the tables you need:

```sql
--Schema for cryptocurrency analysis
DROP TABLE IF EXISTS "currency_info";
CREATE TABLE "currency_info"(
   currency_code   VARCHAR (10),
   currency        TEXT
);

--Schema for btc_prices table
DROP TABLE IF EXISTS "btc_prices";
CREATE TABLE "btc_prices"(
   time            TIMESTAMP WITH TIME ZONE NOT NULL,
   opening_price   DOUBLE PRECISION,
   highest_price   DOUBLE PRECISION,
   lowest_price    DOUBLE PRECISION,
   closing_price   DOUBLE PRECISION,
   volume_btc      DOUBLE PRECISION,
   volume_currency DOUBLE PRECISION,
   currency_code   VARCHAR (10)
);

--Schema for crypto_prices table
DROP TABLE IF EXISTS "crypto_prices";
CREATE TABLE "crypto_prices"(
   time            TIMESTAMP WITH TIME ZONE NOT NULL,
   opening_price   DOUBLE PRECISION,
   highest_price   DOUBLE PRECISION,
   lowest_price    DOUBLE PRECISION,
   closing_price   DOUBLE PRECISION,
   volume_crypto   DOUBLE PRECISION,
   volume_btc      DOUBLE PRECISION,
   currency_code   VARCHAR (10)
);

--Schema for eth_prices table
DROP TABLE IF EXISTS "eth_prices";
CREATE TABLE "eth_prices"(
   time            TIMESTAMP WITH TIME ZONE NOT NULL,
   opening_price   DOUBLE PRECISION,
   highest_price   DOUBLE PRECISION,
   lowest_price    DOUBLE PRECISION,
   closing_price   DOUBLE PRECISION,
   volume_eth      DOUBLE PRECISION,
   volume_currency DOUBLE PRECISION,
   currency_code   VARCHAR (10)
);

--Timescale specific statements to create hypertables for better performance
SELECT create_hypertable('btc_prices', 'time');
SELECT create_hypertable('eth_prices', 'time');
SELECT create_hypertable('crypto_prices', 'time');
```

Note that there are three `create_hypertable` statements which are
TimescaleDB-specific statements. A hypertable is an abstraction of a single
continuous table across time intervals, so that you can query it using standard
SQL. For more on hypertables, see the [Timescale docs][hypertable-docs] and this
[blog post][hypertable-blog].

## Create a dataset to analyze

Now that you've defined the data you want, you can construct a dataset
containing that data. You can write a small Python script for extracting data
from [CryptoCompare][cryptocompare] into four CSV files, called `coin_names.csv`,
`crypto_prices.csv`, `btc_prices.csv`, and `eth_prices.csv`.

To get data from CryptoCompare, you'll need to
[obtain an API key][cryptocompare-apikey]. For this analysis, the free key is
sufficient.

The script consists of five parts:

*   Import the necessary Python libraries in order to complete the data
    extraction
*   Populate the `currency_info` table with a list of coin names
*   Get the historical Bitcoin (BTC) prices in 4198 other cryptocurrencies and
    populate the `crypto_prices` table
*   Get historical Bitcoin prices in different fiat currencies to populate
    `btc_prices`
*   Get historical Ethereum prices in different fiat currencies to populate
    `eth_prices`

Here's the full Python script, which you can also
<Tag type="download" >[download](https://github.com/timescale/examples/blob/master/crypto_tutorial/crypto_data_extraction.py)</Tag>

```python
#####################################################################
#1. Import library and setup API key
#####################################################################
import requests
import json
import csv
from datetime import datetime

apikey = 'YOUR_CRYPTO_COMPARE_API_KEY'
#attach to end of URLstring
url_api_part = '&api_key=' + apikey

#####################################################################
#2. Populate list of all coin names
#####################################################################
#URL to get a list of coins from cryptocompare API
URLcoinslist = 'https://min-api.cryptocompare.com/data/all/coinlist'

#Get list of cryptos with their symbols
res1 = requests.get(URLcoinslist)
res1_json = res1.json()
data1 = res1_json['Data']
symbol_array = []
cryptoDict = dict(data1)

#write to CSV
with open('coin_names.csv', mode = 'w') as test_file:
   test_file_writer = csv.writer(test_file,
                                 delimiter = ',',
                                 quotechar = '"',
                                 quoting=csv.QUOTE_MINIMAL)
   for coin in cryptoDict.values():
     if day.get('time') == None:
       continue # skip this item
       name = coin['Name']
       symbol = coin['Symbol']
       symbol_array.append(symbol)
       coin_name = coin['CoinName']
       full_name = coin['FullName']
       entry = [symbol, coin_name]
       test_file_writer.writerow(entry)
print('Done getting crypto names and symbols. See coin_names.csv for result')

#####################################################################
#3. Populate historical price for each crypto in BTC
#####################################################################
#Note: this part might take a while to run since we're populating data for 4k+ coins
#counter variable for progress made
progress = 0
num_cryptos = str(len(symbol_array))
for symbol in symbol_array:
   # get data for that currency
   URL = 'https://min-api.cryptocompare.com/data/histoday?fsym=' +
         symbol +
         '&tsym=BTC&allData=true' +
         url_api_part
   res = requests.get(URL)
   res_json = res.json()
   data = res_json['Data']
   # write required fields into csv
   with open('crypto_prices.csv', mode = 'a') as test_file:
       test_file_writer = csv.writer(test_file,
                                     delimiter = ',',
                                     quotechar = '"',
                                     quoting=csv.QUOTE_MINIMAL)
       for day in data:
           rawts = day['time']
           ts = datetime.utcfromtimestamp(rawts).strftime('%Y-%m-%d %H:%M:%S')
           o = day['open']
           h = day['high']
           l = day['low']
           c = day['close']
           vfrom = day['volumefrom']
           vto = day['volumeto']
           entry = [ts, o, h, l, c, vfrom, vto, symbol]
           test_file_writer.writerow(entry)
   progress = progress + 1
   print('Processed ' + str(symbol))
   print(str(progress) + ' currencies out of ' +  num_cryptos + ' written to csv')
print('Done getting price data for all coins. See crypto_prices.csv for result')

#####################################################################
#4. Populate BTC prices in different fiat currencies
#####################################################################
# List of fiat currencies we want to query
# You can expand this list, but CryptoCompare does not have
# a comprehensive fiat list on their site
fiatList = ['AUD', 'CAD', 'CNY', 'EUR', 'GBP', 'GOLD', 'HKD',
'ILS', 'INR', 'JPY', 'KRW', 'PLN', 'RUB', 'SGD', 'UAH', 'USD', 'ZAR']

#counter variable for progress made
progress2 = 0
for fiat in fiatList:
   # get data for bitcoin price in that fiat
   URL = 'https://min-api.cryptocompare.com/data/histoday?fsym=BTC&tsym=' +
         fiat +
         '&allData=true' +
         url_api_part
   res = requests.get(URL)
   res_json = res.json()
   data = res_json['Data']
   # write required fields into csv
   with open('btc_prices.csv', mode = 'a') as test_file:
       test_file_writer = csv.writer(test_file,
                                     delimiter = ',',
                                     quotechar = '"',
                                     quoting=csv.QUOTE_MINIMAL)
       for day in data:
           rawts = day['time']
           ts = datetime.utcfromtimestamp(rawts).strftime('%Y-%m-%d %H:%M:%S')
           o = day['open']
           h = day['high']
           l = day['low']
           c = day['close']
           vfrom = day['volumefrom']
           vto = day['volumeto']
           entry = [ts, o, h, l, c, vfrom, vto, fiat]
           test_file_writer.writerow(entry)
   progress2 = progress2 + 1
   print('processed ' + str(fiat))
   print(str(progress2) + ' currencies out of  17 written')
print('Done getting price data for btc. See btc_prices.csv for result')

#####################################################################
#5. Populate ETH prices in different fiat currencies
#####################################################################
#counter variable for progress made
progress3 = 0
for fiat in fiatList:
   # get data for bitcoin price in that fiat
   URL = 'https://min-api.cryptocompare.com/data/histoday?fsym=ETH&tsym=' +
         fiat +
         '&allData=true' +
         url_api_part
   res = requests.get(URL)
   res_json = res.json()
   data = res_json['Data']
   # write required fields into csv
   with open('eth_prices.csv', mode = 'a') as test_file:
       test_file_writer = csv.writer(test_file,
                                     delimiter = ',',
                                     quotechar = '"',
                                     quoting=csv.QUOTE_MINIMAL)
       for day in data:
           rawts = day['time']
           ts = datetime.utcfromtimestamp(rawts).strftime('%Y-%m-%d %H:%M:%S')
           o = day['open']
           h = day['high']
           l = day['low']
           c = day['close']
           vfrom = day['volumefrom']
           vto = day['volumeto']
           entry = [ts, o, h, l, c, vfrom, vto, fiat]
           test_file_writer.writerow(entry)
   progress3 = progress3 + 1
   print('processed ' + str(fiat))
   print(str(progress3) + ' currencies out of  17 written')
print('Done getting price data for eth. See eth_prices.csv for result')
```

After running the script, you should have four .csv files:

```bash
python crypto_data_extraction.py
```

## Load the dataset into TimescaleDB

Before you start, you need a
[working installation of TimescaleDB][install-timescale].

### Set up the schema

Now all your hard work at the beginning comes in handy, and you can use the SQL
script you created to set up the TimescaleDB unstance. If you don't want to
enter the SQL script by yourself, you can download
<Tag type="download">[schema.sql](https://github.com/timescale/examples/blob/master/crypto_tutorial/schema.sql)</Tag> instead.

Log in to the TimescaleDB instance. Locate your `host`, `port`, and `password`
and then connect to the database:

```bash
psql -x "postgres://tsdbadmin:{YOUR_PASSWORD_HERE}@{YOUR_HOSTNAME_HERE}:{YOUR_PORT_HERE}/defaultdb?sslmode=require"
```

From the `psql` command line, create a database. Let's call it `crypto_data`:

```sql
CREATE DATABASE crypto_data;
\c crypto_data
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;
```

From the command prompt, you can apply the schema creation script to the
database like this:

```bash
psql -x "postgres://tsdbadmin:{YOUR_PASSWORD_HERE}@{|YOUR_HOSTNAME_HERE}:{YOUR_PORT_HERE}/crypto_data?sslmode=require" < schema.sql
```

The output should look something like this:

```sql
NOTICE:  00000: table "currency_info" does not exist, skipping
LOCATION:  DropErrorMsgNonExistent, tablecmds.c:1057
DROP TABLE
Time: 78.384 ms
CREATE TABLE
Time: 87.011 ms
NOTICE:  00000: table "btc_prices" does not exist, skipping
LOCATION:  DropErrorMsgNonExistent, tablecmds.c:1057
DROP TABLE
Time: 77.094 ms
CREATE TABLE
Time: 79.815 ms
NOTICE:  00000: table "crypto_prices" does not exist, skipping
LOCATION:  DropErrorMsgNonExistent, tablecmds.c:1057
DROP TABLE
Time: 78.430 ms
CREATE TABLE
Time: 78.430 ms
NOTICE:  00000: table "eth_prices" does not exist, skipping
LOCATION:  DropErrorMsgNonExistent, tablecmds.c:1057
DROP TABLE
Time: 77.410 ms
CREATE TABLE
Time: 80.883 ms
    create_hypertable
-------------------------
 (1,public,btc_prices,t)
(1 row)

Time: 83.154 ms
    create_hypertable
-------------------------
 (2,public,eth_prices,t)
(1 row)

Time: 84.650 ms
     create_hypertable
----------------------------
 (3,public,crypto_prices,t)
(1 row)

Time: 81.864 ms
```

Now when you log back in to the TimescaleDB instance using `psql`, you can run
the `\dt` command and see that the tables have been created properly:

```sql
             List of relations
 Schema |     Name      | Type  |   Owner
--------+---------------+-------+-----------
 public | btc_prices    | table | tsdbadmin
 public | crypto_prices | table | tsdbadmin
 public | currency_info | table | tsdbadmin
 public | eth_prices    | table | tsdbadmin
(4 rows)
```

### Ingest data

Now that you've created the tables with the desired schema, all that's left is
to insert the data from the .csv files you created into the tables.

Make sure you are logged into TimescaleDB using `psql` so that you can run each
of these commands in turn:

```sql
\COPY btc_prices FROM btc_prices.csv CSV;
\COPY eth_prices FROM eth_prices.csv CSV;
\COPY crypto_prices FROM crypto_prices.csv CSV;
\COPY currency_info FROM coin_names.csv CSV;
```

<Highlight type="important">
Data ingestion could take a while, depending on the speed of your Internet
connection.
</Highlight>

You can verify that the ingestion worked by running a simple SQL command, such
as:

```sql
SELECT * FROM btc_prices LIMIT 5;
```

You should get something like this output:

```sql
-[ RECORD 1 ]---+-----------------------
time            | 2013-03-11 00:00:00+00
opening_price   | 60.56
highest_price   | 60.56
lowest_price    | 60.56
closing_price   | 60.56
volume_btc      | 0.1981
volume_currency | 12
currency_code   | AUD
-[ RECORD 2 ]---+-----------------------
time            | 2013-03-12 00:00:00+00
opening_price   | 60.56
highest_price   | 60.56
lowest_price    | 41.38
closing_price   | 47.78
volume_btc      | 47.11
volume_currency | 2297.5
currency_code   | AUD
-[ RECORD 3 ]---+-----------------------
time            | 2013-03-07 00:00:00+00
opening_price   | 181.15
highest_price   | 273.5
lowest_price    | 237.4
closing_price   | 262.87
volume_btc      | 33.04
volume_currency | 8974.45
currency_code   | CNY
-[ RECORD 4 ]---+-----------------------
time            | 2013-03-07 00:00:00+00
opening_price   | 32.31
highest_price   | 35.03
lowest_price    | 26
closing_price   | 31.57
volume_btc      | 13321.61
volume_currency | 425824.38
currency_code   | EUR
-[ RECORD 5 ]---+-----------------------
time            | 2013-03-11 00:00:00+00
opening_price   | 35.7
highest_price   | 37.35
lowest_price    | 35.4
closing_price   | 37.15
volume_btc      | 3316.09
volume_currency | 121750.98
currency_code   | EUR

Time: 224.741 ms
```

## Query and analyze the data

At the beginning of the tutorial, we defined some questions to answer.
Naturally, each of those questions has an answer in the form of a SQL query. Now that you database
is set up properly, and the data is captured and ingested, you can find some answers:

For example, **How did Bitcoin price in USD vary over time?**

```sql
SELECT time_bucket('7 days', time) AS period,
      last(closing_price, time) AS last_closing_price
FROM btc_prices
WHERE currency_code = 'USD'
GROUP BY period
ORDER BY period
```

**How did BTC daily returns vary over time? Which days had the worst and best returns?**

```sql
SELECT time,
      closing_price / lead(closing_price) over prices AS daily_factor
FROM (
  SELECT time,
         closing_price
  FROM btc_prices
  WHERE currency_code = 'USD'
  GROUP BY 1,2
) sub window prices AS (ORDER BY time DESC)
```

**How did the trading volume of Bitcoin vary over time in different fiat currencies?**

```sql
SELECT time_bucket('7 days', time) AS period,
      currency_code,
      sum(volume_btc)
FROM btc_prices
GROUP BY currency_code, period
ORDER BY period
```

**How did Ethereum (ETH) price in BTC vary over time?**

```sql
SELECT
   time_bucket('7 days', time) AS time_period,
   last(closing_price, time) AS closing_price_btc
FROM crypto_prices
WHERE currency_code='ETH'
GROUP BY time_period
ORDER BY time_period
```

**How did ETH prices, in different fiat currencies, vary over time?**

```sql
SELECT time_bucket('7 days', c.time) AS time_period,
      last(c.closing_price, c.time) AS last_closing_price_in_btc,
      last(c.closing_price, c.time) * last(b.closing_price, c.time) FILTER (WHERE b.currency_code = 'USD') AS last_closing_price_in_usd,
      last(c.closing_price, c.time) * last(b.closing_price, c.time) FILTER (WHERE b.currency_code = 'EUR') AS last_closing_price_in_eur,
      last(c.closing_price, c.time) * last(b.closing_price, c.time) FILTER (WHERE b.currency_code = 'CNY') AS last_closing_price_in_cny,
      last(c.closing_price, c.time) * last(b.closing_price, c.time) FILTER (WHERE b.currency_code = 'JPY') AS last_closing_price_in_jpy,
      last(c.closing_price, c.time) * last(b.closing_price, c.time) FILTER (WHERE b.currency_code = 'KRW') AS last_closing_price_in_krw
FROM crypto_prices c
JOIN btc_prices b
   ON time_bucket('1 day', c.time) = time_bucket('1 day', b.time)
WHERE c.currency_code = 'ETH'
GROUP BY time_period
ORDER BY time_period
```

**Which cryptocurrencies had the most transaction volume in the past 14 days?**

```sql
SELECT 'BTC' AS currency_code,
       sum(b.volume_currency) AS total_volume_in_usd
FROM btc_prices b
WHERE b.currency_code = 'USD'
AND now() - date(b.time) < INTERVAL '14 day'
GROUP BY b.currency_code
UNION
SELECT c.currency_code AS currency_code,
       sum(c.volume_btc) * avg(b.closing_price) AS total_volume_in_usd
FROM crypto_prices c JOIN btc_prices b ON date(c.time) = date(b.time)
WHERE c.volume_btc > 0
AND b.currency_code = 'USD'
AND now() - date(b.time) < INTERVAL '14 day'
AND now() - date(c.time) < INTERVAL '14 day'
GROUP BY c.currency_code
ORDER BY total_volume_in_usd DESC
```

**Which cryptocurrencies had the top daily return?**

```sql
WITH
   prev_day_closing AS (
SELECT
   currency_code,
   time,
   closing_price,
   LEAD(closing_price) OVER (PARTITION BY currency_code ORDER BY TIME DESC) AS prev_day_closing_price
FROM
    crypto_prices
)
,    daily_factor AS (
SELECT
   currency_code,
   time,
   CASE WHEN prev_day_closing_price = 0 THEN 0 ELSE closing_price/prev_day_closing_price END AS daily_factor
FROM
   prev_day_closing
)
SELECT
   time,
   LAST(currency_code, daily_factor) AS currency_code,
   MAX(daily_factor) AS max_daily_factor
FROM
   daily_factor
GROUP BY
   time
```

[crypto-blog]: https://blog.timescale.com/blog/analyzing-bitcoin-ethereum-and-4100-other-cryptocurrencies-using-postgresql-and-timescaledb/
[cryptocompare-apikey]: https://min-api.cryptocompare.com
[cryptocompare]: https://www.cryptocompare.com
[hypertable-blog]: https://blog.timescale.com/blog/when-boring-is-awesome-building-a-scalable-time-series-database-on-postgresql-2900ea453ee2/
[hypertable-docs]: /use-timescale/:currentVersion:/hypertables
[install-timescale]: /getting-started/latest/
[tableau-tutorial]: /tutorials/:currentVersion:/visualize-with-tableau/
