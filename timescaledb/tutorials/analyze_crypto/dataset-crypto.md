---
title: Analyze cryptocurrency data - set up dataset
excerpt: Set up a dataset so you can analyze cryptocurrency data
keywords: [tutorials, crypto, financial, dataset]
tags: [tutorials, intermediate]
---

import CreateHypertable from "versionContent/_partials/_create-hypertable-cryptocompare.mdx";
import AddData from "versionContent/_partials/_add-data-cryptocompare.mdx";

# Create the dataset

This tutorial uses a dataset that contains information about bitcoin and other
cryptocurrencies, provided by [CryptoCompare][cryptocompare]. The dataset
contains a number of time-series hypertables for different currencies, and a
separate table of currency information in regular PostgreSQL table. To get
started, you need to create a service and set up the database schema in
Timescale Cloud. Then, you can connect to the CryptoCompare API, extract the
data, and use a simple Python script to convert the raw data in .csv files. You
can then import the data into your Timescale Cloud service.

## Prerequisites

Before you begin, make sure you have:

*   A TimescaleDB instance running locally or on the cloud. For more
    information, see [installation options][install-docs].
*   [`psql`][psql], or any other PostgreSQL client.

<Install />

# The dataset

This tutorial uses historical data from New York's yellow taxi network, provided
by the New York City Taxi and Limousine Commission [NYC TLC][nyc-tlc].

<CreateHypertable />

<AddData />

[install-docs]: install/:currentVersion:/
[psql]: timescaledb/:currentVersion:/how-to-guides/connecting/
[cryptocompare]: https://www.cryptocompare.com
