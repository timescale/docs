---
title: Explore stock market data
excerpt: Explore a stock market dataset using TimescaleDB with Plotly, Pandas, and psycopg2
products: [cloud, mst, self_hosted]
keywords: [finance, analytics, psycopg2, pandas, plotly]
tags: [candlestick]
---

# Explore stock market data

When you've successfully collected 1-min intraday stock data, it's time to have some fun and explore the
data.

Because of the high granularity of the dataset, there are numerous ways to explore it. For example, you could analyze stock prices and volumes on a minute-by-minute basis. With TimescaleDB, you could also bucket records into custom intervals (for example, 2 min or 15 min) using TimescaleDB aggregate functions.

Let's see how it's done!

## Install Plotly and Pandas

To get started with data exploration, you need to install a couple of tools first:

*   [Pandas][pandas-docs], to query and structure the data (this is already installed if you have completed the steps in the previous sections)
*   [Plotly][plotly-docs], to create visualizations quickly

**Install both**

```bash
pip install plotly pandas
```

When you have those installed, you need to open a new Python file, or use a Jupyter notebook to
start exploring the dataset.

## Establish database connection

Use the configuration file you created earlier with `psycopg2` to create a database connection object:

```python
import config, psycopg2
conn = psycopg2.connect(database=config.DB_NAME,
                        host=config.DB_HOST,
                        user=config.DB_USER,
                        password=config.DB_PASS,
                        port=config.DB_PORT)
```

In each data exploration script, you need to reference this connection object to be able to
query the database.

## Generate stock market insights

Let's start off analyzing trading volumes, then have a look at weekly price points, and finally, dig deep on
price changes. The results of the queries shown are visualized using Plotly.

<Highlight type="tip">
Let these queries serve as inspiration to you, and feel free to change things up, like the analyzed `bucket`,
the `symbol` or other parts of the query. Have fun!
</Highlight>

1.  Which symbols have the highest transaction volumes?
1.  How did Apple's trading volume change over time?
1.  How did Apple's stock price change over time?
1.  Which symbols had the highest weekly gains?
1.  Weekly FAANG prices over time?
1.  Weekly price changes of Apple, Facebook, Google?
1.  Distribution of daily price changes of Amazon and Zoom
1.  Apple 15-min candlestick chart

### 1. Which symbols have the highest transaction volumes?

Let's generate a bar chart that shows the most traded symbols in the last 14 days:

```python
import plotly.express as px
import pandas as pd
query = """
    SELECT symbol, sum(trading_volume) AS volume
    FROM stocks_intraday
    WHERE time > now() - INTERVAL '{bucket}'
    GROUP BY symbol
    ORDER BY volume DESC
    LIMIT 5
""".format(bucket="14 day")
df = pd.read_sql(query, conn)
fig = px.bar(df, x='symbol', y='volume', title="Most traded symbols in the last 14 days")
fig.show()
```

![most traded symbols](https://assets.timescale.com/docs/images/tutorials/intraday-stock-analysis/most_traded_symbols.png)

### 2. How did Apple's trading volume change over time?

Now let's try a similar query focused on the daily trading volume of one symbol (for example, 'AAPL').

```python
import plotly.express as px
import pandas as pd
query = """
    SELECT time_bucket('{bucket}', time) AS bucket, sum(trading_volume) AS volume
    FROM stocks_intraday
    WHERE symbol = '{symbol}'
    GROUP BY bucket
    ORDER BY bucket
""".format(bucket="1 day", symbol="AAPL")
df = pd.read_sql(query, conn)
fig = px.line(df, x='bucket', y='volume', title="Apple's daily trading volume over time")
fig.show()
```

![apple trading volume over time](https://assets.timescale.com/docs/images/tutorials/intraday-stock-analysis/apple_trading_volume.png)

### 3. How did Apple's stock price change over time?

This query returns the weekly stock price of Apple over time:

```python
import plotly.express as px
import pandas as pd
query = """
    SELECT time_bucket('{bucket}', time) AS bucket,
    last(price_close, time) AS last_closing_price
    FROM stocks_intraday
    WHERE symbol = '{symbol}'
    GROUP BY bucket
    ORDER BY bucket
""".format(bucket="7 days", symbol="AAPL")
df = pd.read_sql(query, conn)
fig = px.line(df, x='bucket', y='last_closing_price')
fig.show()
```

![apple price over time](https://assets.timescale.com/docs/images/tutorials/intraday-stock-analysis/apple_price.png)

### 4. Which symbols had the highest weekly gains?

Now generate a table containing the symbols with the biggest weekly gains:

```python
import plotly.express as px
import pandas as pd
query = """
    SELECT symbol, bucket, max((closing_price-opening_price)/closing_price*100) AS price_change_pct
    FROM ( 
        SELECT 
        symbol, 
        time_bucket('{bucket}', time) AS bucket, 
        first(price_open, time) AS opening_price, 
        last(price_close, time) AS closing_price
        FROM stocks_intraday
        GROUP BY bucket, symbol
    ) s
    GROUP BY symbol, s.bucket
    ORDER BY price_change_pct {orderby}
    LIMIT 5
""".format(bucket="7 days", orderby="DESC")
df = pd.read_sql(query, conn)
print(df)
```

|symbol |bucket     |price_change_pct |
|-------|-----------|-----------------|
|ZM     |2021-06-07 |24.586495        |
|TSLA   |2021-01-04 |18.280314        |
|BA     |2021-03-08 |17.745225        |
|SNAP   |2021-02-01 |16.149649        |
|TSLA   |2021-03-08 |15.842941        |

`price_change_pct` shows the price change that happened between the start and end of the week.

`bucket` shows (the first day of) the week.

<Highlight type="tip">
Change `orderby` to "ASC" to query the biggest losses.
</Highlight>

### 5. Weekly FAANG prices over time?

Let's see a line chart with the FAANG (Facebook, Apple, Amazon, Netflix, Google/Alphabet) weekly stock prices:

```python
import plotly.express as px
import pandas as pd
query = """
    SELECT symbol, time_bucket('{bucket}', time) AS bucket, 
    last(price_close, time) AS last_closing_price
    FROM stocks_intraday
    WHERE symbol in {symbols}
    GROUP BY bucket, symbol
    ORDER BY bucket
""".format(bucket="7 days", symbols="('FB', 'AAPL',  'AMZN', 'NFLX', 'GOOG')")
df = pd.read_sql(query, conn)
fig = px.line(df, x='bucket', y='last_closing_price', color='symbol', title="FAANG prices over time")
fig.show()
```

![faang prices](https://assets.timescale.com/docs/images/tutorials/intraday-stock-analysis/faang_prices.png)

### 6. Weekly price changes of Apple, Facebook, Google?

Analyzing the price points directly can be useful when you are looking at one specific symbol, but if you want to
compare different stocks, it might be better to look at price changes instead. Let's compare the
price changes of Apple, Facebook, and Google:

```python
import plotly.express as px
import pandas as pd
query = """
   SELECT symbol, bucket, max((closing_price-opening_price)/closing_price) AS price_change_pct
    FROM ( 
        SELECT 
        symbol, 
        time_bucket('{bucket}}', time) AS bucket, 
        first(price_open, time) AS opening_price, 
        last(price_close, time) AS closing_price
        FROM stocks_intraday
        WHERE symbol IN {symbols}
        GROUP BY bucket, symbol
    ) s
    GROUP BY symbol, s.bucket
    ORDER BY bucket
""".format(bucket="7 days", symbols="('AAPL', 'FB', 'GOOG')")
df = pd.read_sql(query, conn)
figure = px.line(df, x="bucket", y="price_change_pct", color="symbol", title="Apple, Facebook, Google weekly price changes")
figure = figure.update_layout(yaxis={'tickformat': '.2%'})
figure.show()
```

![weekly price changes](https://assets.timescale.com/docs/images/tutorials/intraday-stock-analysis/weekly_price_changes.png)

### 7. Distribution of daily price changes of Amazon and Zoom

Now let's generate a scatter chart to look at the distribution of daily price changes of Amazon and Zoom. Analyzing
this data enables you to better understand the volatility of individual stocks and how they compare to each other.

```python
import plotly.express as px
import pandas as pd
query = """
   SELECT symbol, bucket, max((closing_price-opening_price)/closing_price) AS price_change_pct
    FROM ( 
        SELECT 
        symbol, 
        time_bucket('{bucket}', time) AS bucket, 
        first(price_open, time) AS opening_price, 
        last(price_close, time) AS closing_price
        FROM stocks_intraday
        WHERE symbol IN {symbols}
        GROUP BY bucket, symbol
    ) s
    GROUP BY symbol, s.bucket
    ORDER BY bucket
""".format(bucket="1 day", symbols="('ZM', 'AMZN')")
df = pd.read_sql(query, conn)
figure = px.scatter(df, x="price_change_pct", color="symbol", title="Distribution of daily price changes (Amazon, Zoom)")
figure = figure.update_layout(xaxis={'tickformat': '.2%'})
figure.show()
```

![distribution of price changes](https://assets.timescale.com/docs/images/tutorials/intraday-stock-analysis/distribution_price_changes.png)

### 8. Apple 15-min candlestick chart

Finally, because this is a tutorial about stocks, let's generate a 15-min candlestick chart for Apple:

For candlestick charts, you need to import Plotly's `graph_object` module.

```python
import pandas as pd
import plotly.graph_objects as go
query = """
    SELECT time_bucket('{bucket}', time) AS bucket, 
    FIRST(price_open, time) AS price_open, 
    LAST(price_close, time) AS price_close,
    MAX(price_high) AS price_high,
    MIN(price_low) AS price_low
    FROM stocks_intraday
    WHERE symbol = '{symbol}' AND date(time) = date('{date}') 
    GROUP BY bucket
""".format(bucket="15 min", symbol="AAPL", date="2021-06-09")
df = pd.read_sql(query, conn)
figure = go.Figure(data=[go.Candlestick(x=df['bucket'],
                   open=df['price_open'],
                   high=df['price_high'],
                   low=df['price_low'],
                   close=df['price_close'],)])
figure.update_layout(title="15-min candlestick chart of Apple, 2021-06-09")
figure.show()
```

<Highlight type="tip">
Change `date` to see the candlesticks for another day.
</Highlight>

![candlestick chart apple](https://assets.timescale.com/docs/images/tutorials/intraday-stock-analysis/candlestick.png)

## Resources

*   [Intraday stocks analysis on Github][github-intraday-stocks]
*   [Alpha Vantage API docs][alpha-vantage-api]
*   [Pandas docs][pandas-docs]
*   [Plotly docs][plotly-docs]
*   [Timescale free trial][timescale-signup]
*   [Analyze cryptocurrency data][analyze-cryptocurrency-data]

[alpha-vantage-api]: https://www.alphavantage.co/documentation/
[analyze-cryptocurrency-data]: /tutorials/:currentVersion:/analyze-cryptocurrency-data/
[github-intraday-stocks]: https://github.com/timescale/examples/tree/master/analyze-intraday-stocks
[pandas-docs]: https://pandas.pydata.org
[plotly-docs]: https://plotly.com/python/
[timescale-signup]: https://www.timescale.com/timescale-signup
