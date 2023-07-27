---
title: Time-series data
excerpt: Add time-series data to your Timescale service
products: [cloud]
keywords: [ingest]
tags: [add, data, time-series]
layout_components: [next_prev_large]
content_group: Getting started
---

import TimeseriesIntro from "versionContent/_partials/_timeseries-intro.mdx";

# Time-series data

<TimeseriesIntro />

To explore Timescale's features, you need some sample data. This guide
uses real-time stock trade data, also known as tick data, from
[Twelve Data][twelve-data].

## About the dataset

The dataset contains second-by-second stock-trade data for the top 100
most-traded symbols, in a hypertable named `stocks_real_time`. It also includes
a separate table of company symbols and company names, in a regular PostgreSQL
table named `company`.

The dataset is updated on a nightly basis and contains data from the last four
weeks, typically ~8 million rows of data. Stock trades are recorded in real-time
Monday through Friday, during normal trading hours of the New York Stock
Exchange (9:30&nbsp;AM - 4:00&nbsp;PM EST).

## Ingest the dataset

To ingest data into the tables that you created, you need to download the
dataset and copy the data to your database.

<Procedure>

### Ingesting the dataset

1.  Download the `real_time_stock_data.zip` file. The file contains two `.csv`
    files; one with company information, and one with real-time stock trades for
    the past month. Download:
    <Tag
    type="download">[real_time_stock_data.zip](https://assets.timescale.com/docs/downloads/get-started/real_time_stock_data.zip)
    </Tag>

1.  In a new terminal window, run this command to unzip the `.csv` files:

    <CodeBlock canCopy={true} showLineNumbers={false} children={`
    unzip real_time_stock_data.zip
    `} />

1.  At the `psql` prompt, use the `COPY` command to transfer data into your
    Timescale instance. If the `.csv` files aren't in your current directory,
    specify the file paths in the following commands:

    <CodeBlock canCopy={true} showLineNumbers={false} children={`
    \/COPY stocks_real_time from './tutorial_sample_tick.csv' DELIMITER ',' CSV HEADER;
    `} />

    <CodeBlock canCopy={true} showLineNumbers={false} children={`
    \/COPY company from './tutorial_sample_company.csv' DELIMITER ',' CSV HEADER;
    `} />

    Because there are millions of rows of data, the `COPY` process may take a few
    minutes depending on your internet connection and local client resources.

</Procedure>

[twelve-data]: https://twelvedata.com/
