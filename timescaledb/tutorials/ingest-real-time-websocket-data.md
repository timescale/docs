# Ingest real-time financial websocket data

This tutorial shows you how to ingest real-time time-series data into
TimescaleDB using a websocket connection. The tutorial sets up a data pipeline to
ingest real-time data from our data partner, [Twelve Data][twelve-data].
Twelve Data provides a number of different financial APIs, including stock,
crypto, forex, ETFs, etc... It also supports websocket connections in case
you want to update your database frequently. With websockets, you need to
connect to the server, subscribe to symbols, and you can start receiving data
in real-time during market hours.

Once you complete this tutorial, you'll have a data pipeline set
up that ingests real-time financial data into your TimescaleDB instance.

This tutorial uses Python and the
API [wrapper library][twelve-wrapper] provided
by Twelve Data.

## Prerequisites
- A TimescaleDB instance running locally or on the cloud. For more information,
[see installation options][install-ts]
- Python 3
- Sign up for [Twelve Data][twelve-signup] (there's a free tier!)

## Set up a new Python environment

Create a new Python virtual environment for this project and activate it. All
the packages you need to complete for this tutorial will be installed in this environment.

<procedure>

### Setting up a new Python environment

1. Create and activate a Python virtual environment
    ```bash
    virtualenv env
    source env/bin/activate
    ``` 
1. Install the Twelve Data Python [wrapper library](https://github.com/twelvedata/twelvedata-python) with websocket support:
    ```bash
    pip install twelvedata websocket-client
    ```
    This library makes it easy to make requests to the API and maintain a stable websocket connection.
1. Install [Psycopg2][psycopg2] so that you can connect the
    TimescaleDB from your Python script:

    ```bash
    pip install psycopg2-binary
    ```

</procedure>

## Create the websocket connection
When you connect to the Twelve Data API through a websocket, you create a
persistent connection between your computer and the websocket server. This
persistent connection can then be used to receive data as long as you or the
server doesn't terminate the connection.

<procedure>

### Connecting to the websocket server

1. Create a new Python file called `websocket_test.py` and connect to the
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
    
    As you can see in this code example, you need to pass two arguments to create
    the websocket object:
    
    * **`on_event`**

        This argument needs to be a function that gets invoked whenever there's a
        new data record is received from the websocket.
        ```python
        def on_event(event):
        	print(event) # prints out the data record (dictionary)
        ```
    
        This is where you want to implement the ingestion logic so whenever
        there's new data available you insert it into the database.
    * **`symbol`**

        This argument needs to be a list of stock ticker symbols (eg.: `MSFT`) or
        crypto trading pairs (eg.: `BTC/USD`). When using a websocket connection you
        always need to subscribe to the events you want to receive. You can do this
        by using the `symbols` argument shown above or if your connection is already
        created you can also use the `subscribe()` function to get data for additional
        symbols. Example of adding symbols after the connection is already created:
        ```python
        ws = td.websocket(symbols=["BTC/USD", "ETH/USD"], on_event=on_event)
        ws.connect()
        ws.keep_alive()
        ws.subscribe(["USDT/USD", "USDC/USD"])
        ```
    
    You can also notice there's a line in the code example to keep the connection
    alive *forever:*  `ws.keep_alive()`. It makes sure the connection will stay
    active until it gets terminated. If you don't add this line the connection
    might break instantly.

1. Now run the Python script:
    ```bash
    python websocket_test.py
    ```
1. After running the script, you immediately get a response from the server 
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

</procedure>

Then, if you wait a few seconds you see actual data records printed out:

```bash
{'event': 'price', 'symbol': 'BTC/USD', 'currency_base': 'Bitcoin', 'currency_quote': 'US Dollar', 'exchange': 'Coinbase Pro', 'type': 'Digital Currency', 'timestamp': 1652438893, 'price': 30361.2, 'bid': 30361.2, 'ask': 30361.2, 'day_volume': 49153}
{'event': 'price', 'symbol': 'BTC/USD', 'currency_base': 'Bitcoin', 'currency_quote': 'US Dollar', 'exchange': 'Coinbase Pro', 'type': 'Digital Currency', 'timestamp': 1652438896, 'price': 30380.6, 'bid': 30380.6, 'ask': 30380.6, 'day_volume': 49157}
{'event': 'heartbeat', 'status': 'ok'}
{'event': 'price', 'symbol': 'ETH/USD', 'currency_base': 'Ethereum', 'currency_quote': 'US Dollar', 'exchange': 'Huobi', 'type': 'Digital Currency', 'timestamp': 1652438899, 'price': 2089.07, 'bid': 2089.02, 'ask': 2089.03, 'day_volume': 193818}
{'event': 'price', 'symbol': 'BTC/USD', 'currency_base': 'Bitcoin', 'currency_quote': 'US Dollar', 'exchange': 'Coinbase Pro', 'type': 'Digital Currency', 'timestamp': 1652438900, 'price': 30346.0, 'bid': 30346.0, 'ask': 30346.0, 'day_volume': 49167}
```

Each price event gives you multiple data points about the given trading pair.
For example, the name of the exchange, current price, etc... You will
occasionally see `heartbeat` events in the response - these events signal
the health of the connection over time.

At this point the websocket connection works and data keeps flowing. You need
to implement the `on_event` function so data gets ingested into TimescaleDB.

## Ingesting websocket data into TimescaleDB

Now that the websocket connection is set up, implement the `on_event` function
so data gets inserted into the database. When ingestin data into a
transactional database, generally speaking, ingesting a thousand records in
one transaction will be faster than ingesting them in a thousand transactions.

TimescaleDB, being a transactional database, creates a new transaction
whenever you try to insert a new record. Because of this behavior, it's suggested to
insert data records in a batch - multiple records in one transaction.
Using this approach you can achieve higher ingest rates than if you were to
insert data record-by-record.

When you insert data in batches, as opposed to one record at a time, the
database spends less time managing the connection, transactions, etc... and
ingestion becomes faster overall. 

### Batching in memory

A common practice to implement batching is to store new records in memory
first, then after the batch reaches a certain size, insert all the records
from memory into the database in one transaction. The perfect batch size isn't
universal, but you can experiment with different batch sizes
(eg.: 100, 1000, 10000 etc...) and see which one fits your use case better.
Using batching is a fairly common pattern when ingesting data into TimescaleDB
from Kafka, Kinesis, or websocket connections.

Now that you know you need to queue up your data before ingesting, let's see
how to implement a batching solution in Python with Psycopg2.

### Implement batching with Psycopg2

Remember to implement the ingestion logic within the `on_event` function that
you then pass over to the websocket object.

Let's break down what this function needs to do:

1. Check if the item is a data item (and not some websocket metadata)
2. Adjust the data so it fits the database schema (data types, order of columns)
3. Add it to the in-memory batch (a list in Python)
4. If the batch reaches a certain size, insert the data and reset/empty the list

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

Make sure to use `execute_values()` or some other Psycopg2 function that
allows inserting multiple records in one transaction.

After implementing the on_event function, your Python script can connect to
the websocket server and ingest data real-time.

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
        td = TDClient(apikey="50b7918b9ced4255816cfa42ee8eb40e")
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
connections for different types of symbols (e.g.: one for stock, and
another one for crypto prices)

If you see an error message similar to this:
```bash
2022-05-13 18:51:41,976 - ws-twelvedata - ERROR - TDWebSocket ERROR: Handshake status 200 OK
```
Then check that you use a proper API key received from Twelve Data.

Continue with one of our complementing tutorials that show you how to
efficiently store, and analyze your data after ingestion:

- [Store financial tick data in TimescaleDB using the OHLCV (candlestick) format][candlestick-tutorial]
- [Getting started with TimescaleDB][get-started]

[install-ts]: /install/latest/
[twelve-signup]: https://twelvedata.com/pricing
[twelve-data]: https://twelvedata.com
[twelve-wrapper]: https://github.com/twelvedata/twelvedata-python
[candlestick-tutorial]: /tutorials/financial-candlestick-tick-data/
[get-started]: /getting-started/
[psycopg2]: https://www.psycopg.org/docs/
