---
title: Ingest real-time financial websocket data - Set up the dataset
excerpt: Set up a dataset so you can query financial tick data to analyze price changes
products: [cloud]
keywords: [finance, analytics, websockets, data pipeline]
tags: [tutorials, intermediate]
layout_components: [next_prev_large]
content_group: Ingest real-time financial websocket data
---

import CreateAndConnect from "versionContent/_partials/_cloud-create-connect-tutorials.mdx";
import CreateHypertable from "versionContent/_partials/_create-hypertable-twelvedata-stocks.mdx";
import CreateHypertableStocks from "versionContent/_partials/_create-hypertable-twelvedata-stocks.mdx";
import GrafanaConnect from "versionContent/_partials/_grafana-connect.mdx";

# Set up the database

This tutorial uses a dataset that contains second-by-second stock-trade data for
the top 100 most-traded symbols, in a hypertable named `stocks_real_time`. It
also includes a separate table of company symbols and company names, in a
regular PostgreSQL table named `company`.

<Collapsible heading="Create a Timescale service and connect to your service" defaultExpanded={false}>

<CreateAndConnect/>

</Collapsible>

<Collapsible heading="Connect to the websocket server" defaultExpanded={false}>

When you connect to the Twelve Data API through a websocket, you create a
persistent connection between your computer and the websocket server.
You set up a Python environment, and pass two arguments to create a
websocket object and establish the connection.

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
    with websocket support. This library allows you to make requests to the
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

1.  Run the Python script:

    ```bash
    python websocket_test.py
    ```

1.  When you run the script, you receive a response from the server about the
    status of your connection:

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

    When you have established a connection to the websocket server,
    wait a few seconds, and you can see data records, like this:

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
    At this point the websocket connection is working successfully to pass data.

</Procedure>

</Collapsible>

<Collapsible heading="The real-time dataset" headingLevel={2} defaultExpanded={false}>

To ingest the data into your Timescale service, you need to implement the
`on_event` function.

After the websocket connection is set up, you can use the `on_event` function
to ingest data into the database. This is a data pipeline that ingests real-time
financial data into your Timescale service.

Stock trades are ingested in real-time Monday through Friday, typically during
normal trading hours of the New York Stock Exchange (9:30&nbsp;AM to
4:00&nbsp;PM&nbsp;EST).

<CreateHypertableStocks />

When you ingest data into a transactional database like Timescale, it is more
efficient to insert data in batches rather than inserting data row-by-row. Using
one transaction to insert multiple rows can significantly increase the overall
ingest capacity and speed of your Timescale database.

## Batching in memory

A common practice to implement batching is to store new records in memory
first, then after the batch reaches a certain size, insert all the records
from memory into the database in one transaction. The perfect batch size isn't
universal, but you can experiment with different batch sizes
(for example, 100, 1000, 10000, and so on) and see which one fits your use case better.
Using batching is a fairly common pattern when ingesting data into TimescaleDB
from Kafka, Kinesis, or websocket connections.

You can implement a batching solution in Python with Psycopg2.
You can implement the ingestion logic within the `on_event` function that
you can then pass over to the websocket object.

This function needs to:

1.  Check if the item is a data item, and not websocket metadata.
1.  Adjust the data so that it fits the database schema, including the data
    types, and order of columns.
1.  Add it to the in-memory batch, which is a list in Python.
1.  If the batch reaches a certain size, insert the data, and reset or empty the list.

## Ingesting data in real-time

<Procedure>

1.  Update the Python script that prints out the current batch size, so you can
    follow when data gets ingested from memory into your database. Use
    the `<HOST>`, `<PASSWORD>`, and `<PORT>` details for the Timescale service
    where you want to ingest the data and your API key from Twelve Data:

    ```python
    import time
    import psycopg2

    from twelvedata import TDClient
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
        onn = psycopg2.connect(database="tsdb",
                            host="<HOST>",
                            user="tsdbadmin",
                            password="<PASSWORD>",
                            port="<PORT>")

        symbols = ["BTC/USD", "ETH/USD", "MSFT", "AAPL"]
        websocket = WebsocketPipeline(conn)
        websocket.start(symbols=symbols)
        ```

1.  Run the script:

    ```bash
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

<Collapsible heading="Connect to Grafana" defaultExpanded={false}>

The queries in this tutorial are suitable for visualizing in Grafana. If you
want to visualize the results of your queries, connect your Grafana account to
the energy consumption dataset.

<GrafanaConnect />

</Collapsible>

[twelve-wrapper]: https://github.com/twelvedata/twelvedata-python
[psycopg2]: https://www.psycopg.org/docs/
