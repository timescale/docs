---
title: Analyze data using continuous aggregates and hyperfunctions
excerpt: Learn how to efficiently analyze time-series data with TimescaleDB's features
products: [cloud, mst, self_hosted]
keywords: [continuous aggregates, hyperfunctions, analytics]
---

# Analyze data using TimescaleDB continuous aggregates and hyperfunctions

This tutorial is a step-by-step guide on how to use TimescaleDB for analyzing time-series data. We show you how to utilize TimescaleDB's continuous aggregates and hyperfunctions for faster and more efficient queries.
We also take advantage of a unique capability of TimescaleDB: the ability to
join time-series data with relational data.

The dataset that we're using is provided by the National Football League (NFL)
and contains player and tracking data for all the passing plays of the 2018 NFL
season. We're going to ingest this dataset with Python into TimescaleDB and start
exploring it to uncover insights about players and teams.

If you happen to be a NFL fantasy football player, using
some of this analysis on past data could be helpful in selecting the most effective
players for the upcoming year. And, as the NFL releases new data throughout the
upcoming season, you can ingest that data to help you make better decisions from
week to week.

Even if you aren't an NFL fan, this tutorial provides a great example
of how to ingest time-series data into TimescaleDB (even when it doesn't _seem_ like
time-series data), how you can use plain SQL and TimescaleDB hyperfunctions to do
powerful data analysis, and also visualize the data with Python.

This tutorial has a few sections to help you on your journey:

1.  [Ingest and query data][ingest-query]

    Download the data, create tables in TimescaleDB, and run your first query on NFL tracking data.
2.  [Analyze data using continuous aggregates and hyperfunctions][analyze-data]

    Examine the data at a deeper level with more advanced queries, using features of TimescaleDB to make queries faster and effective. You'll also see examples of some visualizations you can create using the data.
3.  [Join time-series data with relational data][join-data]

    Gain further insight into your time-series data by joining it with relational data.
4.  [Visualize time-series play-by-play data][visualize-plays]

    For a little extra fun, create images that plot the movement of every player on the field for any play using Python and MatPlotlib.

## Prerequisites

*   Python 3
*   TimescaleDB (see [installation options][install-timescale])
*   [Psql][psql-install] or any other PostgreSQL client (for example, DBeaver)
*   The [Timescale toolkit][toolkit]

## Download the dataset

*   [The NFL dataset is available for download on Kaggle.][kaggle-download]
*   [Additional stadium and scores dataset (.zip) (source: wikipedia.com).][extra-download]

## Resources

*   [NFL Big Data Bowl 2021 on Kaggle](https://www.kaggle.com/c/nfl-big-data-bowl-2021)

[analyze-data]: /tutorials/:currentVersion:/nfl-analytics/advanced-analysis/
[extra-download]: https://assets.timescale.com/docs/downloads/nfl_2018.zip
[ingest-query]: /tutorials/:currentVersion:/nfl-analytics/ingest-and-query
[install-timescale]: /getting-started/latest/
[join-data]: /tutorials/:currentVersion:/nfl-analytics/join-with-relational
[kaggle-download]: https://www.kaggle.com/c/nfl-big-data-bowl-2021/data
[psql-install]: /use-timescale/:currentVersion:/connecting/psql
[toolkit]: /self-hosted/:currentVersion:/tooling/install-toolkit/
[visualize-plays]: /tutorials/:currentVersion:/nfl-analytics/play-visualization/
