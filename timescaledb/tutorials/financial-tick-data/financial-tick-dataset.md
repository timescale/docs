---
title: Analyze financial tick data - Set up the dataset
excerpt: Set up a dataset so you can query financial tick data to analyze price changes
keywords: [tutorials, finance, learn]
tags: [tutorials, beginner]
---

import Install from "versionContent/_partials/_cloud-installation.mdx";
import CreateService from "versionContent/_partials/_cloud-create-service.mdx";
import Connect from "versionContent/_partials/_cloud-connect.mdx";
import CreateHypertable from "versionContent/_partials/_create-hypertable-twelvedata-crypto.mdx";
import AddData from "versionContent/_partials/_add-data-twelvedata-crypto.mdx";

# Create the dataset

This tutorial uses a dataset that contains second-by-second stock-trade data for
the top 100 most-traded symbols, in a hypertable named `stocks_real_time`. It
also includes a separate table of company symbols and company names, in a
regular PostgreSQL table named `company`.

<Collapsible heading="Sign up for Timescale Cloud">

Install Timescale Cloud by signing up for an account. It's free for thirty days.

<Install />

</Collapsible>

<Collapsible heading="Create a service">

<CreateService demoData={false} />

</Collapsible>

<Collapsible heading="Connect to your service">

<Connect />

</Collapsible>

<Collapsible heading="The dataset">

The dataset is updated on a nightly basis and contains data from the last four
weeks, typically around 8 million rows of data. Stock trades are recorded in
real-time Monday through Friday, typically during normal trading hours of the
New York Stock Exchange (9:30&nbsp;AM - 4:00&nbsp;PM EST).

<CreateHypertable />

<AddData />

</Collapsible>
