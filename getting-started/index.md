---
title: Getting started with TimescaleDB
excerpt: Get started with your first TimescaleDB instance
---

# Getting started with TimescaleDB

**Congratulations!** You're here because you have successfully spun
up your first instance of TimescaleDB, can connect to it, and are ready to
explore some of the most popular TimescaleDB features. If you have not yet
created a TimescaleDB instance or learned how to connect to it, make sure to
check out these two sections:

* [Install TimescaleDB][install]
* [Connect to TimescaleDB][connecting]

## What is TimescaleDB?
TimescaleDB is an extension on top of PostgreSQL.
When you use TimescaleDB, you get all the time-series optimizations and special
features that TimescaleDB provides, along with all the features available
in regular PostgreSQL. Developers refer to TimescaleDB as PostgreSQL with
superpowers.

TimescaleDB supports the full SQL language and you can use TimescaleDB with
all the tools and connectors within the PostgreSQL ecosystem. If it works with
PostgreSQL, it works with TimescaleDB.

## About this tutorial
This Getting Started section gives you a hands-on introduction to the
fundamentals of TimescaleDB. You'll learn definitions
of key terms like hypertables and chunks, and use some of TimescaleDB's key
features like continuous aggregation, compression, and data retention.

The data you ingest and use for this tutorial is real-time stock trading data
provided by [Twelve Data][twelve-data]. The dataset consists of two tables,
one with second-by-second stock-trade data for the top 100 most-traded symbols
and the other containing company information which maps to the symbols.

Let's jump right in!

If you have any questions or concerns as you go through the tutorial,
check out the Timescale community [Slack][slack] and [Timescale Forum][forum], where
you can find help from the Timescale community and team.

[connecting]: /timescaledb/:currentVersion:/how-to-guides/connecting/
[forum]: https://www.timescale.com/forum
[install]: /install/:currentVersion:/
[slack]: https://slack.timescale.com/
[twelve-data]: https://twelvedata.com/
