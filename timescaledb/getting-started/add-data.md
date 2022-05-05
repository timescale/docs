# Add time-series data

To explore TimescaleDB's features, you need some sample data. This tutorial
provides real-time stock trade data, also known as `tick data`, from [Twelve
Data][twelve-data].

## About the dataset
The dataset contains second-by-second stock-trade data for the top 100
most-traded symbols, in a hypertable named `stocks_real_time`. It also includes
a separate table of company symbols and company names, in a regular PostgreSQL
table named `company`. 

The dataset is updated on a nightly basis and contains data from the last four 
weeks, typically ~8 million rows of data. Stock trades are recorded in real-time
Monday through Friday, typically during normal trading hours of the New York Stock 
Exchange (9:30AM - 4:00PM EST).

### Table details

`stocks_real_time`: contains stock data. Includes stock price quotes at every second
during trading hours.

| Field | Description |
|-|-|
| time | (timestamptz) timestamp column incrementing second by second | 
| symbol | (text) symbols representing a company, mapped to company names in the `company` table | 
| price | (double precision) stock quote price for a company at the given timestamp |
| day_volume | (int) number of shares traded each day, NULL values indicate the market is closed | 

`company`: contains a mapping for symbols to company names.

| Field | Description |
|-|-|
| symbol | (text) the symbol representing a company name |
| name | (text) corresponding company name |


## Ingest the dataset
To ingest data into the tables that you created, you need to download the
dataset and copy the data to your database. 

<procedure>

### Ingesting the dataset
1.  Download the `real_time_stock_data.zip` file. The file contains two `.csv`
    files: one with company information, and one with real-time stock trades for
    the past one month. 
    
    Download: <tag
    type="download">[real_time_stock_data.zip](https://assets.timescale.com/docs/downloads/get-started/real_time_stock_data.zip)</tag>
1.  In a new terminal window, run this command to unzip the `.csv` files:
    ```bash
    unzip real_time_stock_data.zip
    ```
1.  At the `psql` prompt, use the `COPY` command to transfer data into your
    TimescleDB instance . If the `.csv` files aren't in your current directory, specify
    the file paths in the following commands:
    ```sql
    \COPY stocks_real_time from './tutorial_sample_tick.csv' DELIMITER ',' CSV HEADER;
    ```
    ```sql
    \COPY company from './tutorial_sample_company.csv' DELIMITER ',' CSV HEADER;
    ```

    Because there are millions of rows of data, the `COPY` process may take a few
    minutes dependent on your internet connection and local client resources.

    <highlight type="note">
    If you're using a Docker container, add the data files to your container before 
    copying them into your database.

    To add files to your container:
    ```bash
    docker cp tutorial_sample_tick.csv timescaledb:/tutorial_sample_tick.csv
    docker cp tutorial_sample_company.csv timescaledb:/tutorial_sample_company.csv
    ```
    </highlight>

</procedure>

## Next steps
Now that you have data in your TimescaleDB instance, learn how to [query the
data][query-data].


[twelve-data]: https://twelvedata.com/
[query-data]: /getting-started/query-data/
