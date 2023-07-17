---
title: Query time-series data tutorial - set up dataset
excerpt: Set up a dataset so you can query time-series data
products: [cloud, mst, self_hosted]
keywords: [tutorials, create, dataset]
tags: [tutorials, beginner]
layout_components: [next_prev_large]
content_group: Analyze NYC taxi cab data
---

import Install from "versionContent/_partials/_cloud-installation.mdx";
import CreateService from "versionContent/_partials/_cloud-create-service.mdx";
import Connect from "versionContent/_partials/_cloud-connect.mdx";
import CreateHypertableNyc from "versionContent/_partials/_create-hypertable-nyctaxis.mdx";
import AddDataNyc from "versionContent/_partials/_add-data-nyctaxis.mdx";
import GrafanaConnect from "versionContent/_partials/_grafana-connect.mdx";

<Collapsible heading="Sign up for Timescale">

<Install />

</Collapsible>

<Collapsible heading="Create a service">

<CreateService demoData={false} />

</Collapsible>

<Collapsible heading="Connect to your service">

<Connect />

</Collapsible>

<Collapsible heading="The dataset">

This tutorial uses historical data from New York's yellow taxi network, provided
by the New York City Taxi and Limousine Commission [NYC TLC][nyc-tlc].

<CreateHypertableNyc />

<AddDataNyc />

</Collapsible>

<Collapsible heading="Connect to Grafana">

The queries in this tutorial are suitable for visualizing in Grafana. If you
want to visualize the results of your queries, connect your Grafana account to
the NYC taxi cab dataset.

<GrafanaConnect />

</Collapsible>

[nyc-tlc]: https://www1.nyc.gov/site/tlc/about/tlc-trip-record-data.page
