# Add time-series data

To explore TimescaleDB's features, you need some sample data. This tutorial provides real-time 
stock trade data (also known as "tick data") from [Twelve Data][twelve-data]. 

## About the dataset

The dataset contains second-by-second stock-trade data for the top 100 most-traded symbols, in a 
hypertable named `stocks_real_time`. It also includes a separate table of company symbols and company 
names, in an ordinary PostgreSQL table named `company`. 

The dataset will contain data from the last four weeks. The download file is updated daily, so 
you should see data from within the last day. 

### Table details

* `stocks_real_time`: Stock data. Includes stock price quotes at every second during trading hours.
* `company`: mapping for symbols to company names

`stocks_real_time`:

| Field | Description |
|-|-|
| time | (timestamptz) timestamp column incrementing second by second | 
| symbol | (text) symbols representing a company, mapped to company names in the `company` table | 
| price | (double precision) stock quote price for a company at the given timestamp |
| day_volume | (int) number of shares traded each day, NULL values indicate the market is closed | 

`company`:

| Field | Description |
|-|-|
| symbol | (text) the symbol representing a company name |
| name | (text) corresponding company name |


## Access the dataset
For all the following steps, you may need to specify file path. 

<procedure>

### Accessing the dataset

1.  Download this `.zip` file. The file contains two `.csv` files: one with company 
    information, and one with real-time stock trades for one month.

    Download: <tag type="download">[real_time_stock_data.zip](https://s3.amazonaws.com/assets.timescale.com/docs/downloads/)</tag>

1.  In a new terminal window, run this command to unzip the `.csv` files:
    ```bash
    unzip real_time_stock_data.zip
    ```

1.  If you're using a Docker container, add the data files to your container before 
    copying them into your database:
    ```bash
    docker cp stocks_real_time.csv timescaledb:/tutorial_sample_tick.csv

    docker cp company.csv timescaledb:/tutorial_sample_company.csv
    ```


1.  At the `psql` prompt, insert the data into your TimescleDB instance using the `COPY` command 
    for efficient data transfer. If the `.csv` files aren't in your current directory, replace 
    the file paths as needed:

    ```sql
    \COPY stocks_real_time from './ tutorial_sample_tick.csv' DELIMITER ',' CSV HEADER;
    \COPY company from './tutorial_sample_company.csv' DELIMITER ',' CSV HEADER;
    ```

</procedure>

## Next steps
Now that you have data in your TimescaleDB instance, learn how to [query the data][query-data].


[twelve-data]: https://twelvedata.com/
[query-data]: /getting-started/query-data/
