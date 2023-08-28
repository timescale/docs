---
title: Query time-series data tutorial - set up dataset
excerpt: Set up a dataset so you can query time-series data
products: [cloud]
keywords: [beginner, tutorials, create, dataset]
layout_components: [next_prev_large]
content_group: Analyze NYC taxi cab data
---

import CreateAndConnect from "versionContent/_partials/_cloud-create-connect-tutorials.mdx";
import CreateHypertableNyc from "versionContent/_partials/_create-hypertable-nyctaxis.mdx";
import AddDataNyc from "versionContent/_partials/_add-data-nyctaxis.mdx";
import PreloadedData from "versionContent/_partials/_preloaded-data.mdx";

# Set up the database

This tutorial uses a dataset that contains historical data from New York's
yellow taxi network, in a hypertable named `rides`. It also includes a separate
tables of payment types and rates, in a regular PostgreSQL table named
`payment_types`, and `rates`.

<PreloadedData />

<Collapsible heading="Create a Timescale service and connect to your service" defaultExpanded={false}>

<CreateAndConnect/>

</Collapsible>

<Collapsible heading="The dataset" defaultExpanded={false}>

This tutorial uses historical data from New York's yellow taxi network, provided
by the New York City Taxi and Limousine Commission [NYC TLC][nyc-tlc].

<CreateHypertableNyc />

<AddDataNyc />

</Collapsible>

[nyc-tlc]: https://www1.nyc.gov/site/tlc/about/tlc-trip-record-data.page
