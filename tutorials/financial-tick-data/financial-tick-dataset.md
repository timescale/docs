---
title: Analyze financial tick data - Set up the dataset
excerpt: Set up a dataset so you can query financial tick data to analyze price changes
products: [cloud, mst, self_hosted]
keywords: [tutorials, finance, learn]
tags: [tutorials, beginner]
layout_components: [next_prev_large]
content_group: Analyze financial tick data
---

import CreateAndConnect from "versionContent/_partials/_cloud-create-connect-tutorials.mdx";
import CreateHypertable from "versionContent/_partials/_create-hypertable-twelvedata-stocks.mdx";
import AddData from "versionContent/_partials/_add-data-twelvedata-stocks.mdx";

# Set up the database

This tutorial uses a dataset that contains second-by-second stock-trade data for
the top 100 most-traded symbols, in a $HYPERTABLE named `stocks_real_time`. It
also includes a separate table of company symbols and company names, in a
regular PostgreSQL table named `company`.

<Collapsible heading="Create a $SERVICE_LONG and connect to your $SERVICE_SHORT" defaultExpanded={false}>

<CreateAndConnect/>

</Collapsible>

<Collapsible heading="The dataset" defaultExpanded={false}>

The dataset is updated on a nightly basis and contains data from the last four
weeks, typically around 8 million rows of data. Stock trades are recorded in
real-time Monday through Friday, typically during normal trading hours of the
New York Stock Exchange (9:30&nbsp;AM - 4:00&nbsp;PM EST).

<CreateHypertable />

<AddData />

</Collapsible>

<Collapsible heading="Connect to Grafana" defaultExpanded={false}>

The queries in this tutorial are suitable for visualizing in Grafana. If you
want to visualize the results of your queries, connect your Grafana account to
the energy consumption dataset.

<GrafanaConnect />

</Collapsible>
