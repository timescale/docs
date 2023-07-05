---
title: Plot geospatial time-series data tutorial
excerpt: Learn how to plot geospatial time-series data
products: [cloud]
keywords: [tutorials, GIS, geospatial, learn]
tags: [tutorials, intermediate]
layout_components: [next_prev_large]
content_group: Plot geospatial NYC taxi cab data
---

# Plot geospatial NYC taxi cab data

New York City is home to about 9 million people. This tutorial uses historical
data from New York's yellow taxi network, provided by the New York City Taxi and
Limousine Commission [NYC TLC][nyc-tlc]. The NYC TLC tracks over 200,000
vehicles making about 1 million trips each day. Because nearly all of this data
is time-series data, proper analysis requires a purpose-built time-series
database, like Timescale.

In the [beginner NYC taxis tutorial][beginner-fleet], you looked at
constructing queries that looked at how many rides were taken, and when. The NYC
taxi cab dataset also contains information about where each ride was picked up.
This is geospatial data, and you can use a PostgreSQL extension called PostGIS
to examine where rides are originating from. Additionally, you can visualize
the data in Grafana, by overlaying it on a map.

## Prerequisites

Before you begin, make sure you have:

*   Signed up for a [free Timescale account][cloud-install].
*   <Optional /> If you want to graph your queries, signed up for a
    [Grafana account][grafana-setup].

## Steps in this tutorial

This tutorial covers:

1.  [Setting up your dataset][dataset-nyc]: Set up and connect to a Timescale
    service, and load data into your database using `psql`.
1.  [Querying your dataset][query-nyc]: Analyze a dataset containing NYC taxi
    trip data using Timescale and PostgreSQL, and plot the results in Grafana.

## About querying data with Timescale

This tutorial uses the [NYC taxi data][nyc-tlc] to show you how to construct
queries for geospatial time-series data. The analysis you do in this tutorial is
similar to the kind of analysis civic organizations do to plan
new roads and public services.

It starts by teaching you how to set up and connect to a Timescale database,
create tables, and load data into the tables using `psql`. If you have already
completed the [beginner NYC taxis tutorial][beginner-fleet], then you already
have the dataset loaded, and you can skip [straight to the queries][plot-nyc].

You then learn how to conduct analysis and monitoring on your dataset. It walks
you through using PostgreSQL queries with the PostGIS extension to obtain
information, and plotting the results in Grafana.

[dataset-nyc]: /tutorials/:currentVersion:/nyc-taxi-geospatial/dataset-nyc/
[query-nyc]: /tutorials/:currentVersion:/nyc-taxi-geospatial/plot-nyc/
[nyc-tlc]: https://www1.nyc.gov/site/tlc/about/tlc-trip-record-data.page
[cloud-install]: /getting-started/latest/
[beginner-fleet]: /tutorials/:currentVersion:/nyc-taxi-cab/
[plot-nyc]: /tutorials/:currentVersion:/nyc-taxi-geospatial/plot-nyc/
[grafana-setup]: /use-timescale/:currentVersion:/integrations/observability-alerting/grafana/installation/
