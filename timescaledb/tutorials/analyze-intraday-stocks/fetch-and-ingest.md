# Fetch and insert intraday stock data

In this step, you will

* create a configuration file (optional)
* fetch stock data
* insert the data into TimescaleDB

## Create a configuration file

This is an optional step, but it is highly recommended not to store your password or other sensitive information
directly in your code. Instead, create a configuration file, for example `config.py`, and include your 
database connection details and Alpha Vantage API key in there:

```python
# example content of config.py:
DB_USER = 'user'
DB_PASS = 'passwd'
DB_HOST = 'host'
DB_PORT = '000'
DB_NAME = 'db'
APIKEY = 'alpha_vantage_apikey'
```

Later, whenever you need to reference any of the information from this config file, you just need to import it:
```python
import config
apikey = config.APIKEY
...
```

## Collect ticker symbols

In order to fetch intraday stock data, you will need to know which ticker symbols you want to analyze.

First, let's collect a list of symbols so later we can fetch their data!

In general, you have a few options to gather a list of ticker symbols dynamically:

* Scrape it from a public website (example code here).
* Use an API that has this functionality.
* Download it from an open repository

To keep things simple, just download this CSV file to get started:

* [Download top 100 US ticker symbols (based on market capitalization)]()

## Read symbols from CSV file

After downloading the CSV file into the project folder, read the symbols into a list:

```python
import csv
with open('ticker_symbols.csv') as f:
    reader = csv.reader(f)
    symbols = [row[0] for row in reader]
    print(symbols)

['MMM', 'AOS', 'ABT', 'ABBV', 'ABMD']
```

Now you have a list of ticker symbols that you can use later to make requests to the Alpha Vantage API.

## Fetching intraday stock data

*It's not necessary to know how Alpha Vantage API works to complete this tutorial, so feel free to skip this section below, if you want.*

### About the API

Alpha Vantage API provides 2-year historical intraday stock data in 1-min, 5-min, 15-min, or 30-min 
intervals.

Because the API outputs a lot of data in a CSV file (~2200 rows/symbol/day in case of 1-min interval), it
slices up the dataset into one-month buckets. This means, for one request the most amount of data you can get for one symbol is one month.

To fetch the maximum amount of historical intraday data (last 24 months), you need to slice up your requests by month (year1month1, year1month2, etc...).

Also, keep in mind that one request can only fetch data for one symbol.

Here's an example API endpoint:

```
https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY_EXTENDED&symbol=IBM&interval=1min&slice=year1month1&apikey=your_apikey
```

Check out the [Alpha Vantage API](https://www.alphavantage.co/documentation/) docs for more information.

### Create the function

Let's create first a function that fetches data for one symbol and one month. The function will take these two values as parameters:

* symbol: the ticker symbol you want to fetch data for (e.g. "AMZN" for Amazon).
* month: an integer value between 1-24 indicating which month you want to fetch data from

```python
import config
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

    # convert the dataframe into a list of tuples ready to be inserted into the database
    return [row for row in df.itertuples(index=False, name=None)] 
```

## Insert data into TimescaleDB

Now that the `fetch_stock_data` function is done and we can fetch the candlestick from the API, let's see how you can insert it into the database.

To make the ingestion faster, use [pgcopy](https://pgcopy.readthedocs.io/en/latest/) instead of inserting
data row by row.

### Insert data fast with pgcopy

**Install psycopg2**
```bash
pip install psycopg2
```

Psycopg2 is needed so you can connect to the database.

**Install pgcopy**
```bash
pip install pgcopy
```

**Insert with pgcopy**
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

    # specify a time frame (max 24 months)
    time_frame = range(1, 2) # (last 1 months)

    # iterate over the specified time frame
    for month in time_frame:

        # fetch stock data for the given symbol and month
        # using the function you created before
        stock_data = fetch_stock_data(symbol, month)

        # create a copy manager instance
        mgr = CopyManager(conn, 'stocks_intraday', COLUMNS)

        # insert data and commit transaction
        mgr.copy(stock_data)
        conn.commit()
```
This will start inserting data for each symbol, one month at a time.

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
Fetching and inserting intraday data can take a while, so if you want to see results quickly, limit the number of months to one and/or limit the number of symbols.
</highlight>



[explore]: /tutorials/analyze-intraday-stocks/explore-stocks-data