## Load financial data

This tutorial uses real-time stock trade data, also known as tick data, from
[Twelve Data][twelve-data].

## Ingest the dataset

To ingest data into the tables that you created, you need to download the
dataset and copy the data to your database.

<Procedure>

#### Ingesting the dataset

1.  Download the `real_time_stock_data.zip` file. The file contains two `.csv`
    files; one with company information, and one with real-time stock trades for
    the past month. Download:

    <Tag type="download">
      [real_time_stock_data.zip](https://assets.timescale.com/docs/downloads/get-started/real_time_stock_data.zip)
    </Tag>

1.  In a new terminal window, run this command to unzip the `.csv` files:

    ```bash
    unzip real_time_stock_data.zip
    ```

1.  At the `psql` prompt, use the `COPY` command to transfer data into your
    TimescaleDB instance. If the `.csv` files aren't in your current directory,
    specify the file paths in these commands:

    ```sql
    \COPY stocks_real_time from './tutorial_sample_tick.csv' DELIMITER ',' CSV HEADER;
    ```

    ```sql
    \COPY company from './tutorial_sample_company.csv' DELIMITER ',' CSV HEADER;
    ```

    Because there are millions of rows of data, the `COPY` process could take a
    few minutes depending on your internet connection and local client
    resources.

</Procedure>

[twelve-data]: https://twelvedata.com/
