---
title: Verb the widget in the tool
excerpt: Verb your widgets to achieve an outcome using the tool
keywords: [noun, verb, tutorial]
tags: [noun, noun]
---

<!-- markdown-link-check-disable -->

# Verb the widget in the tool

New York City is home to about 9 million people. This tutorial uses historical
data from New York's yellow taxi network, provided by the New York City Taxi and
Limousine Commission [[NYC TLC]](nyc-tlc). The NYC TLC tracks over 200,000
vehicles making about 1 million trips each day. Because nearly all of this data
is time-series data, proper analysis requires a purpose-built time-series
database, like TimescaleDB.

This tutorial uses the NYC taxi data to show you how to construct queries for IoT
devices. The analysis you do in this tutorial is similar to the kind of analysis
data science organizations use to do things like plan upgrades, set budgets, and
allocate resources.

## Prerequisites

Before you begin, make sure you have:

*   A TimescaleDB instance running locally or on the cloud.
    For more information, see [installation options][install-docs].
*   [`psql`][psql], or any other PostgreSQL client.

## Steps in this tutorial

This tutorial has two main components:

1.  [Set up up your dataset][dataset-iot]: Set up and connect to a Timescale
    Cloud service, and load data into your database using psql.
1.  [Query your dataset][query-iot]: Analyze a dataset containing IoT data using
    TimescaleDB and PostgreSQL.
1.  [Monitor your IoT devices][monitor-iot]: Use TimescaleDB to monitor IoT
    devices, and understand some other PostgreSQL extensions, such as PostGIS,
    for querying geospatial data.

## About the widget and the tool

This section collects all the concept information related to the tutorial, and
the tools that are being used throughout. It answers the question "What is it?"
This section should not include any procedures, but it can contain code samples
if they are being used to explain the feature. Break this page up in a way that
is logical, starting from simpler concepts and moving to more complicated ones.
Use diagrams and screenshots sparingly, and ensure they add value. Try to keep
this section succinct, by linking to lengthier material that exists elsewhere.

For example:

```txt
Candlestick charts are used in the financial sector to visualize the price
change of an asset. Each candlestick represents a time frame, such as 1
minute, 1 hour, or similar, and shows how the asset's price changed
during that time.
```

Include reference-style links at the bottom of the page.

[install-docs]: install/:currentVersion:/
[psql]: timescaledb/:currentVersion:/how-to-guides/connecting/
[tutorial-dataset]: timescaledb/tutorials/_template/_dataset-tutorial
[tutorial-query]: timescaledb/tutorials/_template/_query-template
[tutorial-advanced]: timescaledb/tutorials/_template/_advanced-tutorial
