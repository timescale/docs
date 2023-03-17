---
title: Getting started with TimescaleDB
excerpt: Get started with your first TimescaleDB instance
products: [cloud]
---

import Install from "versionContent/_partials/_cloud-installation.mdx";
import CreateService from "versionContent/_partials/_cloud-create-service.mdx";
import Connect from "versionContent/_partials/_cloud-connect.mdx";

# Getting started with TimescaleDB

Get started with TimescaleDB to experience the power of its core features, such
as hypertables, continuous aggregates, and compression.

<!-- vale Google.We = NO -->
The easiest way to explore the features of TimescaleDB isto use [Timescale Cloud][sign-up],
our hosted, cloud-native database service.
<!-- vale Google.We = YES -->

## What is TimescaleDB?

TimescaleDB is an extension on top of PostgreSQL. It gives you all the power of
PostgreSQL, plus new superpowers that help you work with time-series data and
complex SQL queries.

## About this guide

This guide helps you set up a TimescaleDB database, so you can work with some
real-time stock trading data, provided by [Twelve Data][twelve-data].

If you have any questions or concerns as you go through the tutorial, check out
the Timescale community [Slack][slack] and [Timescale Forum][forum], where you
can find help from the Timescale community and team.

### Install Timescale Cloud

Install Timescale Cloud by signing up for an account. It's free for thirty days.
It's a cloud service, so you don't need to download anything to your own
machines.

<Install />

### Create your first service

<CreateService demoData={false} />

### Connect to your service

<Connect />

## Next steps

Now that you have a database and a way of connecting to it, you're ready to
start using TimescaleDB features. In the next section, [learn about
hypertables][gsg-hypertables] and how they improve ingest and query for
time-based data.

[forum]: https://www.timescale.com/forum
[gsg-hypertables]: /getting-started/:currentVersion:/create-hypertable/
[slack]: https://slack.timescale.com/
[twelve-data]: https://twelvedata.com/
[sign-up]: https://www.timescale.com/timescale-signup
