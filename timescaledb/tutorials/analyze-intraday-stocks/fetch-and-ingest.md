---
title: Fetch and ingest intraday stock data
excerpt: Ingest intraday stock data into a TimescaleDB database
products: [cloud, mst, self_hosted]
keywords: [finance, analytics, psycopg2, pandas, plotly]
tags: [candlestick]
---

# Fetch and ingest intraday stock data

In this step:

*   create a configuration file (optional)
*   fetch stock data
*   ingest the data into TimescaleDB

## Create a configuration file

This is an optional step, but it is highly recommended that you do not store
your password or other sensitive information
directly in your code. Instead, create a configuration file, for example
`config.py`, and include your
database connection details and Alpha Vantage API key in it:

```python
# example content of config.py:
DB_USER = 'tsdbadmin'
DB_PASS = 'passwd'
DB_HOST = 'xxxxxxx.xxxxxxx.tsdb.cloud.timescale.com'
DB_PORT = '66666'
DB_NAME = 'tsdb'
APIKEY = 'alpha_vantage_apikey'
```

Later, whenever you need to reference any of the information from this configuration file, you need to import it:

```python
import config
apikey = config.APIKEY
...
```

## Collect ticker symbols

In order to fetch intraday stock data, you need to know which ticker symbols you want to analyze.
First, let's collect a list of symbols so that we can fetch their data later.
In general, you have a few options to gather a list of ticker symbols dynamically:

*   Scrape it from a public website ([example code here][scraping-example])
*   Use an API that has this functionality
*   Download it from an open repository

To make things easier, download this CSV file to get started:

*   [Download top 100 US ticker symbols (based on market capitalization)][symbols-csv]

## Read symbols from CSV file

After downloading the CSV file into the project folder, create a new
Python file called `ingest_stock_data.py`. Make sure to add this file in the
same folder as the `symbols.csv` file. Add the following code in this file
that reads the `symbols.csv` file into a list:

```python
# ingest_stock_data.py:
import csv
with open('symbols.csv') as f:
    reader = csv.reader(f)
    symbols = [row[0] for row in reader]
    print(symbols)
```

Run this code:

```bash
python ingest_stock_data.py
```

You should see a list of symbols printed out:

```bash
['AAPL', 'MSFT', 'AMZN', 'GOOG', 'FB']
```

Now you have a list of ticker symbols that you can use later to make requests
to the Alpha Vantage API.

## Fetching intraday stock data

### About the API

Alpha Vantage API provides 2 year historical intraday stock data in 1, 5, 15, or 30 minute
intervals. The API outputs a lot of data in a CSV file (around 2200 rows per symbol per
day, for a 1 minute interval), so it slices the dataset into one month buckets. This means
that for one request for a single symbol, the most amount of data you can get is one month.
 The maximum amount of historical intraday data is 24 months. To fetch the maximum
 amount, you need to slice up your requests by month. For example, `year1month1`,
 `year1month2`, and so on. Keep in mind that each request can only fetch data for one
 symbol at a time.

Here's an example API endpoint:

```
https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY_EXTENDED&symbol=IBM&interval=1min&slice=year1month1&apikey=your_apikey
```

Check out the [Alpha Vantage API](https://www.alphavantage.co/documentation/) docs for more information.

### Create the function

Let's start by creating a function in the Python script called
`ingest_stock_data.py` that you created in an earlier step.
This function fetches data for one symbol and one month. The function takes
these two values as parameters:

*   `symbol`: the ticker symbol you want to fetch data for (for example, "AMZN" for Amazon).
*   `month`: an integer value between 1-24 indicating which month you want to fetch data from.

Add the following piece of code to the `ingest_stock_data.py` file:

```python
import config
import pandas as pd

def fetch_stock_data(symbol, month):
    """Fetches historical intraday data for one ticker symbol (1-min interval)

    Args:
        symbol (string): ticker symbol

    Returns:
        candlestick data (list of tuples)
    """
    interval = '1min'

    # the API requires you to slice up your requests (per month)
    # like "year1month1", "year1month2", ..., "year2month1" etc...
    slice = "year1month" + str(month) if month <= 12 else "year2month1" + str(month)

    apikey = config.APIKEY

    # formulate the correct API endpoint with symbol, slice, interval and apikey
    CSV_URL = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY_EXTENDED&' \
              'symbol={symbol}&interval={interval}&slice={slice}&apikey={apikey}' \
              .format(symbol=symbol, slice=slice, interval=interval,apikey=apikey)

    # read CSV file directly into a pandas dataframe
    df = pd.read_csv(CSV_URL)

    # add a new symbol column to the dataframe
    # this is needed as the API doesn't return the symbol value
    df['symbol'] = symbol

    # convert the time column to datetime object
    # this is needed so we can seamlessly insert the data into the database later
    df['time'] = pd.to_datetime(df['time'], format='%Y-%m-%d %H:%M:%S')

    # rename and reorder columns to match database schema
    df = df.rename(columns={'time': 'time',
                            'open': 'price_open',
                            'high': 'price_high',
                            'low': 'price_low'
                            'close': 'price_close',
                            'volume': 'trading_volume'})
    df = df[['time', 'symbol', 'price_open', 'price_close', 'price_low', 'price_high', 'trading_volume']]

    # convert the dataframe into a list of tuples ready to be ingested
    return [row for row in df.itertuples(index=False, name=None)]
```

Run this script:

```bash
python ingest_stock_data.py
```

This function downloads data from the Alpha Vantage API and prepares it for
database ingestion. Add this piece of code after the function definition to
test if it works:

```python
def test_stock_download():
    test_stock_data = fetch_stock_data("MSFT", 1)
    print(test_stock_data)
test_stock_download()
```

Run the script:

```bash
python ingest_stock_data.py
```

You should see a huge list of tuples printed out, each containing the
timestamp value and the price data (candlestick):

```text
[
(Timestamp('2022-05-23 04:04:00'), 255.8, 255.95, 255.8, 255.8, 771, 'MSFT'),
(Timestamp('2022-05-23 04:01:00'), 255.01, 256.5, 255.01, 256.5, 1235, 'MSFT')
...
]
```

Remove the `test_stock_download()` so it doesn't get invoked unnecessarily
when you run the script in the future.

## Ingest data into TimescaleDB

When you have the `fetch_stock_data` function working, and you can fetch the candlestick from the API, you can insert it into the database.

To make the ingestion faster, use [pgcopy][pgcopy-docs] instead of ingesting
data row by row. TimescaleDB is packaged as an extension to PostgreSQL, meaning all the PostgreSQL tools you know and
love already work with TimescaleDB.

### Ingest data fast with pgcopy

Install psycopg2 and pgcopy so you can connect to the database and ingest data.

**Install psycopg2**

```bash
pip install psycopg2-binary
```

**Install pgcopy**

```bash
pip install pgcopy
```

Add the following code at the bottom of the `ingest_stock_data.py` script:

**Ingest with pgcopy**

```python
from pgcopy import CopyManager
import config, psycopg2

# establish database connection
conn = psycopg2.connect(database=config.DB_NAME,
                        host=config.DB_HOST,
                        user=config.DB_USER,
                        password=config.DB_PASS,
                        port=config.DB_PORT)

# column names in the database (pgcopy needs it as a parameter)
COLUMNS = ('time', 'symbol', 'price_open', 'price_close', 'price_low', 'price_high', 'trading_volume')

# iterate over the symbols list
for symbol in symbols:

    # specify a time range (max 24 months)
    time_range = range(1, 2) # (last 1 months)

    # iterate over the specified time range
    for month in time_range:

        # fetch stock data for the given symbol and month
        # using the function you created before
        stock_data = fetch_stock_data(symbol, month)

        # create a copy manager instance
        mgr = CopyManager(conn, 'stocks_intraday', COLUMNS)

        # insert data and commit transaction
        mgr.copy(stock_data)
        conn.commit()
```

This starts ingesting data for each symbol, one month at a time. You can
modify the `time_range` if you want to download more data.

```
time               |symbol|price_open|price_close|price_low|price_high|trading_volume|
-------------------+------+----------+-----------+---------+----------+--------------+
2022-06-21 22:00:00|AAPL  |    135.66|      135.6|   135.55|    135.69|         14871|
2022-06-21 21:59:00|AAPL  |    135.64|     135.64|   135.64|    135.64|           567|
2022-06-21 21:58:00|AAPL  |    135.67|     135.67|   135.67|    135.67|          1611|
2022-06-21 21:57:00|AAPL  |    135.66|      135.7|   135.66|     135.7|           972|
2022-06-21 21:56:00|AAPL  |  135.6401|   135.6401| 135.6401|  135.6401|           441|
2022-06-21 21:54:00|AAPL  |    135.66|     135.66|   135.66|    135.66|           550|
2022-06-21 21:53:00|AAPL  |    135.66|     135.66|   135.66|    135.66|           269|
2022-06-21 21:52:00|AAPL  |    135.67|     135.67|   135.67|    135.67|          2298|
2022-06-21 21:50:00|AAPL  |    135.67|     135.63|   135.63|    135.67|          1086|
2022-06-21 21:49:00|AAPL  |    135.65|     135.65|   135.65|    135.65|           458|
2022-06-21 21:48:00|AAPL  |    135.64|     135.64|   135.64|    135.64|          1006|
2022-06-21 21:47:00|AAPL  |    135.63|     135.63|   135.63|    135.63|           512|
2022-06-21 21:45:00|AAPL  |    135.61|     135.61|   135.61|    135.61|           441|
2022-06-21 21:44:00|AAPL  |    135.62|     135.62|   135.62|    135.62|           526|
```

<Highlight type="tip">
Fetching and ingesting intraday data can take a while, so if you want to see results quickly,
reduce the number of months, or limit the number of symbols.
</Highlight>

This is what the final version of `ingest_stock_data.py` looks like:

```python
# ingest_stock_data.py:
import csv
import config
import pandas as pd
from pgcopy import CopyManager
import psycopg2

with open('symbols.csv') as f:
    reader = csv.reader(f)
    symbols = [row[0] for row in reader]
    print(symbols)
    
def fetch_stock_data(symbol, month):
    """Fetches historical intraday data for one ticker symbol (1-min interval)

    Args:
        symbol (string): ticker symbol

    Returns:
        candlestick data (list of tuples)
    """
    interval = '1min'

    # the API requires you to slice up your requests (per month)
    # like "year1month1", "year1month2", ..., "year2month1" etc...
    slice = "year1month" + str(month) if month <= 12 else "year2month1" + str(month)

    apikey = config.APIKEY

    # formulate the correct API endpoint with symbol, slice, interval and apikey
    CSV_URL = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY_EXTENDED&' \
              'symbol={symbol}&interval={interval}&slice={slice}&apikey={apikey}' \
              .format(symbol=symbol, slice=slice, interval=interval,apikey=apikey)

    # read CSV file directly into a pandas dataframe
    df = pd.read_csv(CSV_URL)

    # add a new symbol column to the dataframe
    # this is needed as the API doesn't return the symbol value
    df['symbol'] = symbol

    # convert the time column to datetime object
    # this is needed so we can seamlessly insert the data into the database later
    df['time'] = pd.to_datetime(df['time'], format='%Y-%m-%d %H:%M:%S')

    # rename and reorder columns to match database schema    
    df = df.rename(columns={'open': 'price_open',
                            'high': 'price_high',
                            'low': 'price_low',
                            'close': 'price_close',
                            'volume': 'trading_volume'}
                   )
    df = df[['time', 'symbol', 'price_open', 'price_close', 'price_low', 'price_high', 'trading_volume']]
    
    # convert the dataframe into a list of tuples ready to be ingested
    return [row for row in df.itertuples(index=False, name=None)]

# establish database connection
conn = psycopg2.connect(database=config.DB_NAME,
                        host=config.DB_HOST,
                        user=config.DB_USER,
                        password=config.DB_PASS,
                        port=config.DB_PORT)

# column names in the database (pgcopy needs it as a parameter)
COLUMNS = ('time', 'symbol', 'price_open', 'price_close', 'price_low', 'price_high', 'trading_volume')

# iterate over the symbols list
for symbol in symbols:

    # specify a time range (max 24 months)
    time_range = range(1, 2) # (last 1 months)

    # iterate over the specified time range
    for month in time_range:

        # fetch stock data for the given symbol and month
        # using the function you created before
        stock_data = fetch_stock_data(symbol, month)
        print(stock_data)

        # create a copy manager instance
        mgr = CopyManager(conn, 'stocks_intraday', COLUMNS)

        # insert data and commit transaction
        mgr.copy(stock_data)
        conn.commit()

```

[pgcopy-docs]: https://pgcopy.readthedocs.io/en/latest/
[scraping-example]: https://github.com/timescale/examples/blob/master/analyze-intraday-stocks/scrape_symbols.py
[symbols-csv]: https://assets.timescale.com/docs/downloads/symbols.csv
