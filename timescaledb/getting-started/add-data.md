# Add time-series data

To explore TimescaleDB's features, you need some sample data. This tutorial provides real-time 
stock trade data (also known as "tick data") from [twelvedata][twelve-data].

## About the dataset

The dataset contains second-by second stock-trade data for the top 100 most-traded symbols, in a hypertable named `stocks_real_time`. It also
includes a separate table of company symbols and company names, in a table named `company`. `company` is not a hypertable.

### Table details
`stocks_real_time`: Stock data. Includes stock price quotes at every second during trading hours.

```bash
    * time: timestamp column incrementing second by second
    * symbol: symbols representing a company, mapped to company names in the `company` table
    * price: stock quote price for a company at the given timestamp
    * day_volume: number of shares traded each day, NULL values indicate the market is closed
```

`company`: mapping for symbols to company names

```bash
    * symbol: the symbol representing a company name
    * name: corresponding company name
```

## Access the dataset

<procedure>

### Accessing the dataset

1.  Before ingesting data, create another table named `company`. At the `psql` prompt, run:

    ```sql
    CREATE TABLE IF NOT EXISTS company (
        symbol text NOT NULL,
        name text NOT NULL
    );
    ```

1.  Download the following `.zip` file. The file contains two `.csv` files: one with company information, and one with real-time stock trades for one month.

    Download: <tag type="download">[stock_data_real_time.zip](https://s3.amazonaws.com/assets.timescale.com/docs/downloads/)</tag>

1.  At the command prompt, unzip the `.csv` files:
    ```bash
    unzip stock_data_real_time.zip
    ```

1.  At the `psql` prompt, insert the data into your 
    TimescleDB instance. If the `.csv` files aren't in your current directory, replace the file paths as needed:

    ```sql
    \copy stocks_real_time from './stocks_real_time.csv' DELIMITER ',' CSV;
    \copy company from './company.csv' DELIMITER ',' CSV;
    ```

</procedure>

## Next steps
Now that you have data in your TimescaleDB instance, learn how to [query the data][query-data].


[twelve-data]: https://twelvedata.com/
[script-twelve-data]: /
[query-data]: /getting-started/query-data/