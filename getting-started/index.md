---
title: Getting started with TimescaleDB
excerpt: Get started with your first TimescaleDB instance
---

import Install from "versionContent/_partials/_cloud-installation.mdx";
import CreateService from "versionContent/_partials/_cloud-create-service.mdx";
import Connect from "versionContent/_partials/_cloud-connect.mdx";

# Getting started with TimescaleDB

Get started with TimescaleDB to experience the power of its core features, such
as hypertables, continuous aggregates, and compression.

## What is TimescaleDB?

TimescaleDB is an extension on top of PostgreSQL. It gives you all the power of
PostgreSQL, plus new superpowers that help you work with time-series data and
complex SQL queries.

## About the getting-started guide

In this tutorial, you'll set up a TimescaleDB database and work with some
real-time stock trading data, provided by [Twelve Data][twelve-data].

If you have any questions or concerns as you go through the tutorial, check out
the Timescale community [Slack][slack] and [Timescale Forum][forum], where you
can find help from the Timescale community and team.

## Get started with a TimescaleDB database

<!-- vale Google.We = NO -->
To work with TimescaleDB, you need a TimescaleDB database. The easiest way to
get started is to use Timescale Cloud, our hosted, cloud-native database
service.
<!-- vale Google.We = YES -->

### Install Timescale Cloud

Install Timescale Cloud by signing up for an account. It's free for thirty days.
It's a cloud service, so you don't need to download anything to your own
machines.

<highlight type="note">
Need to self-host your own database? See the other installation options in the
[install section](/install/latest/).
</highlight>

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
