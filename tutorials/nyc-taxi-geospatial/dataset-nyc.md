---
title: Plot geospatial time-series data tutorial - set up dataset
excerpt: Set up a dataset so you can query geospatial time-series data
products: [cloud]
keywords: [tutorials, GIS, geospatial, learn]
tags: [tutorials, intermediate]
layout_components: [next_prev_large]
content_group: Plot geospatial NYC taxi cab data
---

import CreateAndConnect from "versionContent/_partials/_cloud-create-connect-tutorials.mdx";
import CreateHypertableNyc from "versionContent/_partials/_create-hypertable-nyctaxis.mdx";
import AddDataNyc from "versionContent/_partials/_add-data-nyctaxis.mdx";
import GrafanaConnect from "versionContent/_partials/_grafana-connect.mdx";

# Set up the database

This tutorial uses a dataset that contains historical data from New York's
yellow taxi network, in a hypertable named `rides`. It also includes a separate
tables of payment types and rates, in a regular PostgreSQL table named
`payment_types`, and `rates`.

<Collapsible heading="Create a $SERVICE_LONG and connect to your $SERVICE_SHORT" defaultExpanded={false}>

<CreateAndConnect/>

</Collapsible>

<Collapsible heading="The dataset" defaultExpanded={false}>

This tutorial uses historical data from New York's yellow taxi network, provided
by the New York City Taxi and Limousine Commission [NYC TLC][nyc-tlc].

<CreateHypertableNyc />

<AddDataNyc />

</Collapsible>

<Collapsible heading="Connect to Grafana" defaultExpanded={false}>

The queries in this tutorial are suitable for visualizing in Grafana. If you
want to visualize the results of your queries, connect your Grafana account to
the NYC taxi cab dataset.

<GrafanaConnect />

</Collapsible>

[nyc-tlc]: https://www1.nyc.gov/site/tlc/about/tlc-trip-record-data.page
