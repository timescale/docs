---
title: Analyze financial tick data - Set up the dataset
excerpt: Ingest and set up a financial dataset in Timescale Cloud to run real-time analytical queries on it
products: [cloud, mst, self_hosted]
keywords: [tutorials, finance, learn]
tags: [tutorials, beginner]
layout_components: [next_prev_large]
content_group: Analyze financial tick data
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";
import CreateHypertable from "versionContent/_partials/_create-hypertable-twelvedata-stocks.mdx";
import AddData from "versionContent/_partials/_add-data-twelvedata-stocks.mdx";

# Ingest data into a $SERVICE_LONG

This tutorial uses a dataset that contains second-by-second stock-trade data for
the top 100 most-traded symbols, in a hypertable named `stocks_real_time`. It
also includes a separate table of company symbols and company names, in a
regular PostgreSQL table named `company`.

The dataset is updated on a nightly basis and contains data from the last four
weeks, typically around 8 million rows of data. Stock trades are recorded in
real-time Monday through Friday, typically during normal trading hours of the
New York Stock Exchange (9:30&nbsp;AM - 4:00&nbsp;PM EST).

## Prerequisites

<IntegrationPrereqs />

<CreateHypertable />

<AddData />

<GrafanaConnect />

