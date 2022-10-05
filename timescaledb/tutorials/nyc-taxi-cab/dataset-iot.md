---
title: Query IoT data tutorial - set up dataset
excerpt: Set up a dataset so you can query IoT data
keywords: [tutorials, create, dataset, iot]
tags: [tutorials, IoT]
---

import Install from "versionContent/_partials/_cloud-installation.mdx";
import CreateService from "versionContent/_partials/_cloud-create-service.mdx";
import Connect from "versionContent/_partials/_cloud-connect.mdx";
import CreateHypertable from "versionContent/_partials/_create-hypertable-nyctaxis.mdx";
import AddData from "versionContent/_partials/_add-data-nyctaxis.mdx";

## Sign up for Timescale Cloud

Install Timescale Cloud by signing up for an account. It's free for thirty days.

<Install />

## Create your first service

<CreateService demoData={false} />

## Connect to your service

<Connect />

# The dataset

New York City is home to about 9 million people. This tutorial uses historical
data from New York's yellow taxi network, provided by the New York City Taxi and
Limousine Commission [[NYC TLC]](nyc-tlc). The NYC TLC tracks over 200,000
licensee vehicles completing about 1 million trips each day. Because nearly all
of this data is time-series data, proper analysis requires a purpose-built
time-series database, like TimescaleDB.

<CreateHypertable />

<AddData />

[nyc-tlc]: https://www1.nyc.gov/site/tlc/about/tlc-trip-record-data.page
