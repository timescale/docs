# Fetch and ingest intraday stock data

In this step:

* create a configuration file (optional)
* fetch stock data
* ingest the data into TimescaleDB

## Create a configuration file

This is an optional step, but it is highly recommended that you do not store your password or other sensitive information
directly in your code. Instead, create a configuration file, for example `config.py`, and include your
database connection details and Alpha Vantage API key in there:

```python
# example content of config.py:
DB_USER = 'tsdb'
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

* Scrape it from a public website ([example code here][scraping-example])
* Use an API that has this functionality
* Download it from an open repository

To make things easier, download this CSV file to get started:

* [Download top 100 US ticker symbols (based on market capitalization)][symbols-csv]

## Read symbols from CSV file

After downloading the CSV file into the project folder, read the symbols into a list:

```python
import csv
with open('symbols.csv') as f:
    reader = csv.reader(f)
    symbols = [row[0] for row in reader]
    print(symbols)

['MMM', 'AOS', 'ABT', 'ABBV', 'ABMD']
```

Now you have a list of ticker symbols that you can use later to make requests to the Alpha Vantage API.

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

Let's start by creating a function that fetches data for one symbol and one month. The function takes these two values as parameters:

* `symbol`: the ticker symbol you want to fetch data for (for example, "AMZN" for Amazon).
* `month`: an integer value between 1-24 indicating which month you want to fetch data from.

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

    # rename columns to match database schema
    df = df.rename(columns={'time': 'time',
                            'open': 'price_open',
                            'close': 'price_close',
                            'high': 'price_high',
                            'low': 'price_low',
                            'volume': 'trading_volume'})

    # convert the dataframe into a list of tuples ready to be ingested
    return [row for row in df.itertuples(index=False, name=None)]
```

## Ingest data into TimescaleDB

When you have the `fetch_stock_data` function working, and you can fetch the candlestick from the API, you can insert it into the database.

To make the ingestion faster, use [pgcopy][pgcopy-docs] instead of ingesting
data row by row. TimescaleDB is packaged as an extension to PostgreSQL, meaning all the PostgreSQL tools you know and
love already work with TimescaleDB.

### Ingest data fast with pgcopy

To use pgcopy, you need to install `psycopg2` as well so you can connect to the database.

**Install psycopg2**
```bash
pip install psycopg2
```

**Install pgcopy**
```bash
pip install pgcopy
```

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
COLUMNS = ('time', 'symbol', 'price_open', 'price_close',
           'price_low', 'price_high', 'trading_volume')

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
This starts ingesting data for each symbol, one month at a time.

```
time               |symbol|price_open|price_close|price_low|price_high|trading_volume|
-------------------+------+----------+-----------+---------+----------+--------------+
2021-06-16 20:00:00|AAPL  |    129.21|     129.21|    129.1|    129.21|         10194|
2021-06-16 19:59:00|AAPL  |    129.22|     129.25|   129.15|    129.15|          3844|
2021-06-16 19:58:00|AAPL  |    129.33|     129.33|    129.2|     129.2|          5240|
2021-06-16 19:57:00|AAPL  |    129.32|     129.32|   129.32|    129.32|          1568|
2021-06-16 19:56:00|AAPL  |    129.35|     129.36|   129.35|    129.35|          2417|
2021-06-16 19:55:00|AAPL  |   129.385|    129.385|   129.35|    129.35|           434|
2021-06-16 19:54:00|AAPL  |     129.4|     129.41|    129.4|     129.4|          5634|
2021-06-16 19:53:00|AAPL  |    129.41|     129.43|    129.4|     129.4|          3265|
2021-06-16 19:52:00|AAPL  |    129.42|     129.42|   129.41|    129.42|          1681|
2021-06-16 19:51:00|AAPL  |    129.41|     129.42|   129.41|    129.42|          1530|
2021-06-16 19:50:00|AAPL  |    129.41|     129.41|   129.41|    129.41|           680|
2021-06-16 19:49:00|AAPL  |    129.42|     129.42|   129.41|    129.41|           651|
2021-06-16 19:48:00|AAPL  |    129.38|     129.42|   129.38|    129.42|           520|
2021-06-16 19:47:00|AAPL  |    129.39|     129.39|   129.39|    129.39|          2207|
2021-06-16 19:46:00|AAPL  |    129.38|      129.4|   129.38|     129.4|          5871|
2021-06-16 19:45:00|AAPL  |    129.39|     129.39|   129.39|    129.39|           845|
```

<highlight type="tip">
Fetching and ingesting intraday data can take a while, so if you want to see results quickly,
reduce the number of months, or limit the number of symbols.
</highlight>



[explore]: /tutorials/analyze-intraday-stocks/explore-stocks-data
[scraping-example]: https://github.com/timescale/examples/blob/master/analyze-intraday-stocks/scrape_symbols.py
[symbols-csv]: https://assets.timescale.com/docs/downloads/symbols.csv
[pgcopy-docs]: https://pgcopy.readthedocs.io/en/latest/
