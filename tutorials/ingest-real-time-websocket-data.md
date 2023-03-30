---
title: Ingest real-time financial websocket data
excerpt: Set up a data pipeline to get data from different financial APIs
products: [cloud, mst, self_hosted]
keywords: [finance, analytics, websockets, data pipeline]
---

# Ingest real-time financial websocket data

This tutorial shows you how to ingest real-time time-series data into
TimescaleDB using a websocket connection. The tutorial sets up a data pipeline to
ingest real-time data from our data partner, [Twelve Data][twelve-data].
Twelve Data provides a number of different financial APIs, including stock,
crypto, forex, ETFs, and more. It also supports websocket connections in case
you want to update your database frequently. With websockets, you need to
connect to the server, subscribe to symbols, and you can start receiving data
in real-time during market hours.

When you complete this tutorial, you'll have a data pipeline set
up that ingests real-time financial data into your TimescaleDB instance.

This tutorial uses Python and the API
[wrapper library][twelve-wrapper] provided by Twelve Data.

## Prerequisites

Before you begin, make sure you have:

*   A TimescaleDB instance running locally or on the cloud. For more information,
   [see installation options][install-ts]
*   Installed Python 3
*   Signed up for [Twelve Data][twelve-signup]. The free tier is perfect for this tutorial.

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

When you connect to the Twelve Data API through a websocket, you create a
persistent connection between your computer and the websocket server. This
persistent connection can then be used to receive data for as long as the
connection is maintained. You need to pass two arguments to create a
websocket object and establish connection.

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

    This argument needs to be a list of stock ticker symbols (for example, `MSFT`) or
    crypto trading pairs (for example, `BTC/USD`). When using a websocket connection you
    always need to subscribe to the events you want to receive. You can do this
    by using the `symbols` argument or if your connection is already
    created you can also use the `subscribe()` function to get data for additional
    symbols.

<Procedure>

### Connecting to the websocket server

1.  Create a new Python file called `websocket_test.py` and connect to the
    Twelve Data servers using the wrapper library:

    ```python
    # websocket_test.py:
    from twelvedata import TDClient
    
    def on_event(event):
     print(event) # prints out the data record (dictionary)
    
    td = TDClient(apikey="TWELVE_DATA_APIKEY")
    ws = td.websocket(symbols=["BTC/USD", "ETH/USD"], on_event=on_event)
    ws.connect()
    ws.keep_alive()
    ```

    Make sure to pass your API key as an argument for the `TDClient` object.

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

<Highlight type="note">
To keep the websocket connection alive indefinitely, use the `keep_alive()`
function of the wrapper library. It makes sure the connection will
stay active until it gets terminated. If you don't add this line the
connection might break instantly.
</Highlight>

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

## Ingesting websocket data into TimescaleDB

Now that the websocket connection is set up, you can use the `on_event` function
to ingest data into the database.

When you ingest data into a transactional database like TimescaleDB, it is more efficient to
insert data in batches rather than inserting data row-by-row. Using one transaction to
insert multiple rows can significantly increase the overall ingest capacity and speed
of your TimescaleDB instance.

### Batching in memory

A common practice to implement batching is to store new records in memory
first, then after the batch reaches a certain size, insert all the records
from memory into the database in one transaction. The perfect batch size isn't
universal, but you can experiment with different batch sizes
(for example, 100, 1000, 10000, and so on) and see which one fits your use case better.
Using batching is a fairly common pattern when ingesting data into TimescaleDB
from Kafka, Kinesis, or websocket connections.

Now you can see
how to implement a batching solution in Python with Psycopg2.

### Implement batching with Psycopg2

Remember to implement the ingestion logic within the `on_event` function that
you can then pass over to the websocket object.

This function needs to:

1.  Check if the item is a data item, and not some websocket metadata.
1.  Adjust the data so that it fits the database schema, including the data types, and order of columns.
1.  Add it to the in-memory batch, which is a list in Python.
1.  If the batch reaches a certain size, insert the data and reset or empty the list.

Here's the full implementation:

```python
from psycopg2.extras import execute_values
conn = psycopg2.connect(database="tsdb", 
                        host="host", 
                        user="tsdbadmin", 
                        password="passwd",
                        port="66666")
columns = ["time", "symbol", "price", "day_volume"]
current_batch = []
MAX_BATCH_SIZE = 100
def _on_event(self, event):
    if event["event"] == "price":
        # data record
        timestamp = datetime.utcfromtimestamp(event["timestamp"])
        data = (timestamp, event["symbol"], event["price"], event.get("day_volume"))

        # add new data record to batch
        current_batch.append(data)
            
        # ingest data if max batch size is reached then reset the batch
        if len(current_batch) == MAX_BATCH_SIZE:
            cursor = conn.cursor()
            sql = f"""
            INSERT INTO {DB_TABLE} ({','.join(columns)}) 
            VALUES %s;"""
            execute_values(cursor, sql, data)
            conn.commit()
            current_batch = []
```

Make sure you use `execute_values()` or some other Psycopg2 function that
allows inserting multiple records in one transaction.

After you have implemented the `on_event` function, your Python script can connect to
the websocket server and ingest data in real time.

## Full code example

Cleaned-up version of the Python script that prints out the current batch size,
so you can follow when data gets ingested from memory into TimescaleDB:

```python
from twelvedata import TDClient
import psycopg2
from psycopg2.extras import execute_values
from datetime import datetime

class WebsocketPipeline():
    # name of the hypertable
    DB_TABLE = "prices_real_time"

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
        td = TDClient(apikey="TWELVE_DATA_APIKEY")
        ws = td.websocket(on_event=self._on_event)
        ws.subscribe(symbols)
        ws.connect()
        ws.keep_alive()

conn = psycopg2.connect(database="tsdb", 
                        host="host", 
                        user="tsdbadmin", 
                        password="passwd",
                        port="66666")
    
symbols = ["BTC/USD", "ETH/USD", "MSFT", "AAPL"]
websocket = WebsocketPipeline(conn)
websocket.start(symbols=symbols)
```

Run the script:

```python
python websocket_test.py
```

You can even create separate Python scripts to start multiple websocket
connections for different types of symbols (for example, one for stock, and
another one for crypto prices)

If you see an error message similar to this:

```bash
2022-05-13 18:51:41,976 - ws-twelvedata - ERROR - TDWebSocket ERROR: Handshake status 200 OK
```

Then check that you use a proper API key received from Twelve Data.

Continue with one of our other tutorials that show you how to
efficiently store and analyze your data after ingestion:

*   [Store financial tick data in TimescaleDB using the OHLCV (candlestick) format][candlestick-tutorial]
*   [Getting started with TimescaleDB][get-started]

[candlestick-tutorial]: /tutorials/:currentVersion:/financial-tick-data/
[get-started]: /getting-started/:currentVersion:/
[install-ts]: /getting-started/latest/
[psycopg2]: https://www.psycopg.org/docs/
[twelve-data]: https://twelvedata.com
[twelve-signup]: https://twelvedata.com/pricing
[twelve-wrapper]: https://github.com/twelvedata/twelvedata-python
