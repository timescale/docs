---
title: Analyze financial tick data - Set up the dataset
excerpt: Ingest and set up a financial dataset in Timescale Cloud to run real-time analytical queries on it
products: [cloud, self_hosted, mst]
keywords: [tutorials, finance, learn]
tags: [tutorials, beginner]
layout_components: [next_prev_large]
content_group: Analyze financial tick data
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";
import CreateHypertableCrypto from "versionContent/_partials/_create-hypertable-twelvedata-crypto.mdx";
import AddDataCrypto from "versionContent/_partials/_add-data-twelvedata-crypto.mdx";
import GrafanaConnect from "versionContent/_partials/_grafana-connect.mdx";

# Ingest data into a $SERVICE_LONG

This tutorial uses a dataset that contains second-by-second trade data for
the most-traded crypto-assets. You optimize this time-series data in a a hypertable called `assets_real_time`. 
You also create a separate table of asset symbols in a regular PostgreSQL table named `assets`.

The dataset is updated on a nightly basis and contains data from the last four
weeks, typically around 8 million rows of data. Trades are recorded in
real-time from 180+ cryptocurrency exchanges.

## Prerequisites

<IntegrationPrereqs />

<CreateHypertableCrypto />

<AddDataCrypto />

<GrafanaConnect />

