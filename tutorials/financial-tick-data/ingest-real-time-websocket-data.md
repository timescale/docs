---
title: Ingest real-time financial websocket data
excerpt: Set up a data pipeline to get data from different financial APIs
products: [cloud, mst, self_hosted]
keywords: [finance, analytics, websockets, data pipeline]
---

import CreateHypertableStocks from "versionContent/_partials/_create-hypertable-twelvedata-stocks.mdx";
import GraphOhlcv from "versionContent/_partials/_graphing-ohlcv-data.mdx";

# Ingest real-time financial websocket data

This tutorial shows you how to ingest real-time time-series data into
TimescaleDB using a websocket connection. The tutorial sets up a data pipeline to
ingest real-time data from our data partner, [Twelve Data][twelve-data].
Twelve Data provides a number of different financial APIs, including stock,
cryptocurrencies, foreign exchanges, and ETFs. It also supports websocket connections in case
you want to update your database frequently. With websockets, you need to
connect to the server, subscribe to symbols, and you can start receiving data
in real-time during market hours.

When you complete this tutorial, you'll have a data pipeline set
up that ingests real-time financial data into your Timescale.

This tutorial uses Python and the API
[wrapper library][twelve-wrapper] provided by Twelve Data.

## Prerequisites

Before you begin, make sure you have:

*   A Timescale [service and connect to the service][financial-tick-dataset].
*   Download the `.sql` file that contains the credentials such as `<HOST>`,
    `<PORT>`, `<PASSWORD>`, and other details to connect to your Timescale
    service. You can also find these details in the `Connection Info` section of
    your Timescale service in the Timescale portal.
*   Installed Python 3
*   Signed up for [Twelve Data][twelve-signup]. The free tier is perfect for
    this tutorial.
*   Made a note of your Twelve Data [API key](https://twelvedata.com/account/api-keys).

<Collapsible heading="Connect to the websocket server">

When you connect to the Twelve Data API through a websocket, you create a
persistent connection between your computer and the websocket server. You need
to first set up a Python environment and then pass two arguments to create a
websocket object and establish connection.

## Set up a new Python environment

Create a new Python virtual environment for this project and activate it. All
the packages you need to complete for this tutorial are installed in this environment.

<Procedure>

### Setting up a new Python environment

1.  Create and activate a Python virtual environment:

    ```bash
    virtualenv env
    source env/bin/activate
    ```

1.  Install the Twelve Data Python
    [wrapper library][twelve-wrapper]
    with websocket support. This library makes it easy to make requests to the
    API and maintain a stable websocket connection.

    ```bash
    pip install twelvedata websocket-client
    ```

1.  Install [Psycopg2][psycopg2] so that you can connect the
    TimescaleDB from your Python script:

    ```bash
    pip install psycopg2-binary
    ```

</Procedure>

## Create the websocket connection

A persistent connection between your computer and the websocket server is used
to receive data for as long as the connection is maintained. You need to pass
two arguments to create a websocket object and establish connection.

### Websocket arguments

*   `on_event`

    This argument needs to be a function that is invoked whenever there's a
    new data record is received from the websocket:

    ```python
    def on_event(event):
        print(event) # prints out the data record (dictionary)
    ```

    This is where you want to implement the ingestion logic so whenever
    there's new data available you insert it into the database.

*   `symbols`

    This argument needs to be a list of stock ticker symbols (for example,
    `MSFT`) or crypto trading pairs (for example, `BTC/USD`). When using a
    websocket connection you always need to subscribe to the events you want to
    receive. You can do this by using the `symbols` argument or if your
    connection is already created you can also use the `subscribe()` function to
    get data for additional symbols.

<Procedure>

### Connecting to the websocket server

1.  Create a new Python file called `websocket_test.py` and connect to the
    Twelve Data servers using the `<YOUR_API_KEY>`:

    ```python
       import time
       from twelvedata import TDClient

        messages_history = []

        def on_event(event):
         print(event) # prints out the data record (dictionary)
         messages_history.append(event)

       td = TDClient(apikey="<YOUR_API_KEY>")
       ws = td.websocket(symbols=["BTC/USD", "ETH/USD"], on_event=on_event)
       ws.subscribe(['ETH/BTC', 'AAPL'])
       ws.connect()
       while True:
       print('messages received: ', len(messages_history))
       ws.heartbeat()
       time.sleep(10)
    ```

1.  Now run the Python script:

    ```bash
    python websocket_test.py
    ```

1.  After running the script, you immediately get a response from the server
    about the status of your connection:

    ```bash
    {'event': 'subscribe-status',
     'status': 'ok',
     'success': [
            {'symbol': 'BTC/USD', 'exchange': 'Coinbase Pro', 'mic_code': 'Coinbase Pro', 'country': '', 'type': 'Digital Currency'},
            {'symbol': 'ETH/USD', 'exchange': 'Huobi', 'mic_code': 'Huobi', 'country': '', 'type': 'Digital Currency'}
        ],
     'fails': None
    }
    ```

</Procedure>

When you have established a connection to the websocket server,
wait a few seconds, and you can see actual data records, like this:

```bash
{'event': 'price', 'symbol': 'BTC/USD', 'currency_base': 'Bitcoin', 'currency_quote': 'US Dollar', 'exchange': 'Coinbase Pro', 'type': 'Digital Currency', 'timestamp': 1652438893, 'price': 30361.2, 'bid': 30361.2, 'ask': 30361.2, 'day_volume': 49153}
{'event': 'price', 'symbol': 'BTC/USD', 'currency_base': 'Bitcoin', 'currency_quote': 'US Dollar', 'exchange': 'Coinbase Pro', 'type': 'Digital Currency', 'timestamp': 1652438896, 'price': 30380.6, 'bid': 30380.6, 'ask': 30380.6, 'day_volume': 49157}
{'event': 'heartbeat', 'status': 'ok'}
{'event': 'price', 'symbol': 'ETH/USD', 'currency_base': 'Ethereum', 'currency_quote': 'US Dollar', 'exchange': 'Huobi', 'type': 'Digital Currency', 'timestamp': 1652438899, 'price': 2089.07, 'bid': 2089.02, 'ask': 2089.03, 'day_volume': 193818}
{'event': 'price', 'symbol': 'BTC/USD', 'currency_base': 'Bitcoin', 'currency_quote': 'US Dollar', 'exchange': 'Coinbase Pro', 'type': 'Digital Currency', 'timestamp': 1652438900, 'price': 30346.0, 'bid': 30346.0, 'ask': 30346.0, 'day_volume': 49167}
```

Each price event gives you multiple data points about the given trading pair
such as the name of the exchange, and the current price. You can also
occasionally see `heartbeat` events in the response; these events signal
the health of the connection over time.

At this point the websocket connection works and data keeps flowing. You need
to implement the `on_event` function so data gets ingested into TimescaleDB.

</Collapsible>

<Collapsible heading="The real-time dataset">

After the websocket connection is set up, you can use the `on_event` function
to ingest data into the database.

A data pipeline setup that ingests real-time financial data into your Timescale.
Stock trades are ingested in real-time Monday through Friday, typically during
normal trading hours of the New York Stock Exchange (9:30&nbsp;AM - 4:00&nbsp;PM
EST).

<CreateHypertableStocks />

When you ingest data into a transactional database like TimescaleDB, it is more
efficient to insert data in batches rather than inserting data row-by-row. Using
one transaction to insert multiple rows can significantly increase the overall
ingest capacity and speed of your TimescaleDB database.

## Batching in memory

A common practice to implement batching is to store new records in memory
first, then after the batch reaches a certain size, insert all the records
from memory into the database in one transaction. The perfect batch size isn't
universal, but you can experiment with different batch sizes
(for example, 100, 1000, 10000, and so on) and see which one fits your use case better.
Using batching is a fairly common pattern when ingesting data into TimescaleDB
from Kafka, Kinesis, or websocket connections.

Now you can implement a batching solution in Python with Psycopg2.
Remember to implement the ingestion logic within the `on_event` function that
you can then pass over to the websocket object.

This function needs to:

1.  Check if the item is a data item, and not some websocket metadata.
1.  Adjust the data so that it fits the database schema, including the data
    types, and order of columns.
1.  Add it to the in-memory batch, which is a list in Python.
1.  If the batch reaches a certain size, insert the data and reset or empty the list.

## Ingesting data in real-time

<Procedure>

1.  Update the Python script that prints out the current batch size, so you can
    follow when data gets ingested from memory into your database. Use
    the `<HOST>`, `<PASSWORD>`, and `<PORT>` details for the Timescale service
    where you want to ingest the data and your API key from Twelve Data:

```python
import time
from twelvedata import TDClient
import psycopg2
from psycopg2.extras import execute_values
from datetime import datetime

class WebsocketPipeline():
    # name of the hypertable
    DB_TABLE = "stocks_real_time"

    # columns in the hypertable in the correct order
    DB_COLUMNS=["time", "symbol", "price", "day_volume"]

    # batch size used to insert data in batches
    MAX_BATCH_SIZE=100
    
    def __init__(self, conn):
        """Connect to the Twelve Data web socket server and stream
        data into the database.
        
        Args:
            conn: psycopg2 connection object
        """
        self.conn = conn
        self.current_batch = []
        self.insert_counter = 0
         
    def _insert_values(self, data):
        if self.conn is not None:
            cursor = self.conn.cursor()
            sql = f"""
            INSERT INTO {self.DB_TABLE} ({','.join(self.DB_COLUMNS)}) 
            VALUES %s;"""
            execute_values(cursor, sql, data)
            self.conn.commit()
        
    def _on_event(self, event):
        """This function gets called whenever there's a new data record coming
        back from the server.

        Args:
            event (dict): data record
        """
        if event["event"] == "price":
            # data record
            timestamp = datetime.utcfromtimestamp(event["timestamp"])
            data = (timestamp, event["symbol"], event["price"], event.get("day_volume"))

            # add new data record to batch
            self.current_batch.append(data)
            print(f"Current batch size: {len(self.current_batch)}")
            
            # ingest data if max batch size is reached then reset the batch
            if len(self.current_batch) == self.MAX_BATCH_SIZE:
                self._insert_values(self.current_batch)
                self.insert_counter += 1
                print(f"Batch insert #{self.insert_counter}")
                self.current_batch = []
    

    def start(self, symbols):
        """Connect to the web socket server and start streaming real-time data 
        into the database.

        Args:
            symbols (list of symbols): List of stock/crypto symbols
        """
        td = TDClient(apikey="<YOUR_API_KEY")
        ws = td.websocket(on_event=self._on_event)
        ws.subscribe(symbols)
        ws.connect()
        while True:
           ws.heartbeat()
           time.sleep(10)

conn = psycopg2.connect(database="tsdb", 
                        host="<HOST>", 
                        user="tsdbadmin", 
                        password="<PASSWORD>",
                        port="<PORT>")
    
symbols = ["BTC/USD", "ETH/USD", "MSFT", "AAPL"]
websocket = WebsocketPipeline(conn)
websocket.start(symbols=symbols)
```

1.  Run the script:

```python
python websocket_test.py
```

</Procedure>

You can even create separate Python scripts to start multiple websocket
connections for different types of symbols, for example, one for stock, and
another one for cryptocurrency prices.

### Troubleshooting

If you see an error message similar to this:

```bash
2022-05-13 18:51:41,976 - ws-twelvedata - ERROR - TDWebSocket ERROR: Handshake status 200 OK
```

Then check that you use a proper API key received from Twelve Data.

</Collapsible>

<Collapsible heading="Query the data">

To look at OHLCV values, the most effective way is to create a continuous
aggregate. You can create a continuous aggregate to aggregate data
for each hour, then set the aggregate to refresh every hour, and aggregate
the last two hours' worth of data.

<Procedure>

### Creating a continuous aggregate

1.  Connect to the Timescale database `tsdb` that contains the Twelve Data
    stocks dataset.

1.  At the psql prompt, create the continuous aggregate to aggregate data every
    minute:

    ```sql
    CREATE MATERIALIZED VIEW one_hour_candle
    WITH (timescaledb.continuous) AS
        SELECT
            time_bucket('1 hour', time) AS bucket,
            symbol,
            FIRST(price, time) AS "open",
            MAX(price) AS high,
            MIN(price) AS low,
            LAST(price, time) AS "close",
            LAST(day_volume, time) AS day_volume
        FROM stocks_real_time
        GROUP BY bucket, symbol;
    ```

    When you create the continuous aggregate, it refreshes by default.

1.  Set a refresh policy to update the continuous aggregate every hour,
    if there is new data available in the hypertable for the last two hours:

    ```sql
    SELECT add_continuous_aggregate_policy('one_hour_candle',
        start_offset => INTERVAL '3 hours',
        end_offset => INTERVAL '1 hour',
        schedule_interval => INTERVAL '1 hour');
    ```

</Procedure>

## Query the continuous aggregate

When you have your continuous aggregate set up, you can query it to get the
OHLCV values.

<Procedure>

### Querying the continuous aggregate

1.  Connect to the Timescale database that contains the Twelve Data
    stocks dataset.

1.  At the psql prompt, use this query to select all `AAPL` OHLCV data for the
    past 5 hours, by time bucket:

    ```sql
    SELECT * FROM one_hour_candle
    WHERE symbol = 'AAPL' AND bucket >= NOW() - INTERVAL '5 hours'
    ORDER BY bucket;
    ```

    The result of the query looks like this:

    ```sql
             bucket         | symbol  |  open   |  high   |   low   |  close  | day_volume
    ------------------------+---------+---------+---------+---------+---------+------------
     2023-05-30 08:00:00+00 | AAPL   | 176.31 | 176.31 |    176 | 176.01 |           
     2023-05-30 08:01:00+00 | AAPL   | 176.27 | 176.27 | 176.02 |  176.2 |           
     2023-05-30 08:06:00+00 | AAPL   | 176.03 | 176.04 | 175.95 |    176 |           
     2023-05-30 08:07:00+00 | AAPL   | 175.95 |    176 | 175.82 | 175.91 |           
     2023-05-30 08:08:00+00 | AAPL   | 175.92 | 176.02 |  175.8 | 176.02 |           
     2023-05-30 08:09:00+00 | AAPL   | 176.02 | 176.02 |  175.9 | 175.98 |           
     2023-05-30 08:10:00+00 | AAPL   | 175.98 | 175.98 | 175.94 | 175.94 |           
     2023-05-30 08:11:00+00 | AAPL   | 175.94 | 175.94 | 175.91 | 175.91 |           
     2023-05-30 08:12:00+00 | AAPL   |  175.9 | 175.94 |  175.9 | 175.94 |
    ```

</Procedure>

</Collapsible>

<GraphOhlcv />

[candlestick-tutorial]: /tutorials/:currentVersion:/financial-tick-data/
[get-started]: /getting-started/:currentVersion:/
[install-ts]: /getting-started/latest/
[psycopg2]: https://www.psycopg.org/docs/
[twelve-data]: https://twelvedata.com
[twelve-signup]: https://twelvedata.com/pricing
[twelve-wrapper]: https://github.com/twelvedata/twelvedata-python
[financial-tick-dataset]: /tutorials/:currentVersion:/financial-tick-data/financial-tick-dataset/
