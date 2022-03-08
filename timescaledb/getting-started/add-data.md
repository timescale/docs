# Add time-series data

To help get you familiar with TimescaleDB's features, you’ll need some
sample data to play around with. For this tutorial, we provide real-time financial 
stock data provided by ['Twelve Data'][twelve-data]. The data set contains time-series 
stock prices from the last three months. 

<highlight type="note">
For information on how to get more from 'Twelve data', check out our [tutorial][script-twelve-data] on how to 
ingest stock data into TimescaleDB.
</highlight>

### About the dataset

The dataset contains tick level (second by second) stock data along with further information on company symbols. 
There are two tables that you will ingest, a hypertable `stocks_real_time` and a regular table `company`. 

Details on the data set are as follows:
`stocks_real_time`: Stock data indicating quotes for stock prices for a given second during trading hours
    * time: timestamp column incrementing at a tick level (second by second)
    * symbol: symbols representing a company, mappings found in the `company` table
    * price: stock quote price for a company at the given timestamp
    * day_volume: how many shares are traded each day, NULL values indicate the market is closed

`company`: mapping for symbols to company names
    * symbol: the symbol representing a company name
    * name: corresponding company name

<procedure>

### Accessing the dataset

1.  Before ingesting the data, you must create another table, `company`. Run the 
    following code to do this. 

    ```sql
    CREATE TABLE IF NOT EXISTS company (
        symbol text NOT NULL,
        name text NOT NULL
    );
    ```

1.  We provide CSV files for accessing the data. Download the CSV files (in ZIP format) 
    below.

    Download CSV: <tag type="download">[stock_data_real_time.zip](https://s3.amazonaws.com/assets.timescale.com/docs/downloads/)</tag>

1.  After unzipping the files, use the following commands to insert the data into your 
    TimescleDB instance. The code assumes your tables are in the current directory:

    ```sql
    -- copy data from stocks_real_time.csv into stocks_real_time table
    \copy stocks_real_time from './stocks_real_time.csv' DELIMITER ',' CSV;
    \copy company from './compsny.csv' DELIMITER ',' CSV;
    ```

</procedure>

Now that you’re up and running with data inside TimescaleDB let’s [start querying the data][query-data].


[twelve-data]: https://twelvedata.com/
[script-twelve-data]: /
[query-data]: /getting-started/query-data/