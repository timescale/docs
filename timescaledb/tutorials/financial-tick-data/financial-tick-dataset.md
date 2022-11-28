---
title: Verb the widget tutorial - set up dataset
excerpt: Set up a dataset so you can verb your widgets to achieve an outcome using the tool
keywords: [noun, verb, tutorial]
tags: [noun, noun]
---

import CreateHypertable from "versionContent/_partials/_create-hypertable-twelvedata.mdx";
import AddData from "versionContent/_partials/_add-data-twelvedata.mdx";

# Create the dataset

This tutorial uses a dataset that contains second-by-second stock-trade data for
the top 100 most-traded symbols, in a hypertable named `stocks_real_time`. It
also includes a separate table of company symbols and company names, in a
regular PostgreSQL table named `company`.

## Prerequisites

Before you begin, make sure you have:

*   A TimescaleDB instance running locally or on the cloud. For more
    information, see [installation options][install-docs].
*   [`psql`][psql], or any other PostgreSQL client.

## The dataset

The dataset is updated on a nightly basis and contains data from the last four
weeks, typically around 8 million rows of data. Stock trades are recorded in
real-time Monday through Friday, typically during normal trading hours of the
New York Stock Exchange (9:30&nbsp;AM - 4:00&nbsp;PM EST).

<CreateHypertable />

<AddData />
