---
title: Test drive Timescale features
excerpt: Use real time data to try out timescale features
products: [cloud]
keywords: [hypertables, create]
layout_components: [next_prev_large]
content_group: Getting started
---

# Test drive Timescale features

<HypertableIntro />

<TimeseriesIntro />

To explore Timescale's features, you need some sample data. This guide
uses real-time stock trade data, also known as tick data, from
[twelve-data].

## Prerequisites

To follow this page, you must either:

* Create a Timescale Cloud for AWS service
* Create a Timescale Cloud for GCP and Azure service
* Install TimescaleDB in your developer environment

## Install data, run a couple of queries and aggregates

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
    \\COPY stocks_real_time from './tutorial_sample_tick.csv' DELIMITER ',' CSV HEADER;
    `} />

    <CodeBlock canCopy={true} showLineNumbers={false} children={`
    \\COPY company from './tutorial_sample_company.csv' DELIMITER ',' CSV HEADER;
    `} />

    Because there are millions of rows of data, the `COPY` process may take a few
    minutes depending on your internet connection and local client resources.

</Procedure> 





