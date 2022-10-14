---
title: Verb the widget in the tool
excerpt: Verb your widgets to achieve an outcome using the tool
keywords: [noun, verb, tutorial]
tags: [noun, noun]
---

# Analyze IoT data with NYC tax cabs

New York City is home to about 9 million people. This tutorial uses historical
data from New York's yellow taxi network, provided by the New York City Taxi and
Limousine Commission [[NYC TLC]](nyc-tlc). The NYC TLC tracks over 200,000
vehicles making about 1 million trips each day. Because nearly all of this data
is time-series data, proper analysis requires a purpose-built time-series
database, like TimescaleDB.

## Prerequisites

Before you begin, make sure you have:

*   A TimescaleDB instance running locally or on the cloud.
    For more information, see [installation options][install-docs].
*   [`psql`][psql], or any other PostgreSQL client.

## Steps in this tutorial

This tutorial covers:

1.  [Setting up up your dataset][dataset-iot]: Set up and connect to a Timescale
    Cloud service, and load data into your database using psql.
1.  [Querying your dataset][query-iot]: Analyze a dataset containing IoT data using
    TimescaleDB and PostgreSQL.
1.  [Monitoring your IoT devices][monitor-iot]: Use TimescaleDB to monitor IoT
    devices, and understand some other PostgreSQL extensions, such as PostGIS,
    for querying geospatial data.

## About querying IoT data with TimescaleDB

This tutorial uses the NYC taxi data to show you how to construct queries for IoT
devices. The analysis you do in this tutorial is similar to the kind of analysis
data science organizations use to do things like plan upgrades, set budgets, and
allocate resources.

It starts by teaching you how to set up and connect to a Timescale database,
create tables, and load data into the tables using `psql`.

You then learn how to conduct analysis and monitoring on your dataset. It walks
you through using PostgreSQL queries to obtain information, including how to use
JOINs to combine your time-series data with relational or business data.

Finally, it covers some special TimescaleDB SQL functions that can help you
analyze your time-series data, and how to use other extensions, like PostGIS,
for faster queries.

[install-docs]: /install/:currentVersion:/
[psql]: /timescaledb/:currentVersion:/how-to-guides/connecting/
[dataset-iot]: /timescaledb/tutorials/nyc-taxi-cab/dataset-iot/
[query-iot]: /timescaledb/tutorials/nyc-taxi-cab/query-iot/
[monitor-iot]: /timescaledb/tutorials/nyc-taxi-cab/monitor-iot/
