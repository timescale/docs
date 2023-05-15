---
title: Add time-series data
excerpt: Add time-series data to your Timescale instance
products: [cloud, mst, self_hosted]
keywords: [ingest]
tags: [add, data, time-series]
---

import HypershiftAlt from "versionContent/_partials/_hypershift-alternatively.mdx";

# Add time-series data

To explore Timescale's features, you need some sample data. This tutorial
provides real-time stock trade data, also known as tick data, from
[Twelve Data][twelve-data].

<HypershiftAlt />

## About the dataset

The dataset contains second-by-second stock-trade data for the top 100
most-traded symbols, in a hypertable named `stocks_real_time`. It also includes
a separate table of company symbols and company names, in a regular PostgreSQL
table named `company`.

The dataset is updated on a nightly basis and contains data from the last four
weeks, typically ~8 million rows of data. Stock trades are recorded in real-time
Monday through Friday, typically during normal trading hours of the New York Stock
Exchange (9:30&nbsp;AM - 4:00&nbsp;PM EST).

<Highlight type="note">
In case you want to ingest real-time data, instead of sample data,
read the tutorial
[Ingest real-time financial websocket data](https://docs.timescale.com/tutorials/latest/ingest-real-time-websocket-data)
and ingest data directly from the Twelve Data financial API.
</Highlight>

### Table details

`stocks_real_time`: contains stock data. Includes stock price quotes at every
second during trading hours.

|Field|Type|Description|
|-|-|-|
|time|timestamptz|Timestamp column incrementing second by second|
|symbol|text|Symbols representing a company, mapped to company names in the `company` table|
|price|double precision|Stock quote price for a company at the given timestamp|
|day_volume|int|Number of shares traded each day, NULL values indicate the market is closed|

`company`: contains a mapping for symbols to company names.

|Field|Type|Description|
|-|-|-|
|symbol|text|the symbol representing a company name|
|name|text|Corresponding company name|

## Ingest the dataset

To ingest data into the tables that you created, you need to download the
dataset and copy the data to your database.

<HypershiftAlt />

<Procedure>

### Ingesting the dataset

1.  Download the `real_time_stock_data.zip` file. The file contains two `.csv`
    files; one with company information, and one with real-time stock trades for
    the past month. Download:
    <Tag
    type="download">[real_time_stock_data.zip](https://assets.timescale.com/docs/downloads/get-started/real_time_stock_data.zip)
    </Tag>

1.  In a new terminal window, run this command to unzip the `.csv` files:

    ```bash
    unzip real_time_stock_data.zip
    ```

1.  At the `psql` prompt, use the `COPY` command to transfer data into your
    Timescale instance. If the `.csv` files aren't in your current directory,
    specify the file paths in the following commands:

    ```sql
    \COPY stocks_real_time from './tutorial_sample_tick.csv' DELIMITER ',' CSV HEADER;
    ```

    ```sql
    \COPY company from './tutorial_sample_company.csv' DELIMITER ',' CSV HEADER;
    ```

    Because there are millions of rows of data, the `COPY` process may take a few
    minutes depending on your internet connection and local client resources.

<Highlight type="note">
If you're using a Docker container, add the data files to your container before
copying them into your database.

To add files to your container:

```bash
docker cp tutorial_sample_tick.csv timescaledb:/tutorial_sample_tick.csv
docker cp tutorial_sample_company.csv timescaledb:/tutorial_sample_company.csv
```

</Highlight>

</Procedure>

<Video url="https://www.youtube.com/embed/YwidcyBFgAU"></Video>

## Next steps

Now that you have data in your Timescale instance, learn how to
[query the data][query-data].

[twelve-data]: https://twelvedata.com/
[query-data]: /getting-started/:currentVersion:/query-data/
