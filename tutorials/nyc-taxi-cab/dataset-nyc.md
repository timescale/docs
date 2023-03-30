---
title: Query time-series data tutorial - set up dataset
excerpt: Set up a dataset so you can query time-series data
products: [cloud, mst, self_hosted]
keywords: [tutorials, create, dataset]
tags: [tutorials, beginner]
---

import Install from "versionContent/_partials/_cloud-installation.mdx";
import CreateService from "versionContent/_partials/_cloud-create-service.mdx";
import Connect from "versionContent/_partials/_cloud-connect.mdx";
import CreateHypertableNyc from "versionContent/_partials/_create-hypertable-nyctaxis.mdx";
import AddDataNyc from "versionContent/_partials/_add-data-nyctaxis.mdx";

## Sign up for Timescale Cloud

Install Timescale Cloud by signing up for an account. It's free for thirty days.

<Install />

## Create a service

<CreateService demoData={false} />

## Connect to your service

<Connect />

# The dataset

This tutorial uses historical data from New York's yellow taxi network, provided
by the New York City Taxi and Limousine Commission [NYC TLC][nyc-tlc].

<CreateHypertableNyc />

<AddDataNyc />

[nyc-tlc]: https://www1.nyc.gov/site/tlc/about/tlc-trip-record-data.page
