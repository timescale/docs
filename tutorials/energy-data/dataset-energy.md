---
title: Energy time-series data tutorial - set up dataset
excerpt: Ingest and set up a sample dataset with energy consumption data so that you can run queries on it in Timescale Console
products: [cloud, mst, self_hosted]
keywords: [tutorials, create, dataset]
tags: [tutorials, beginner]
layout_components: [next_prev_large]
content_group: Analyze energy consumption data
---

import CreateAndConnect from "versionContent/_partials/_cloud-create-connect-tutorials.mdx";
import CreateHypertableEnergy from "versionContent/_partials/_create-hypertable-energy.mdx";
import AddDataEnergy from "versionContent/_partials/_add-data-energy.mdx";
import GrafanaConnect from "versionContent/_partials/_grafana-connect.mdx";
import CreateCaggs from "versionContent/_partials/_caggs-intro.mdx";
import CreateCaggsOnIOTData from "versionContent/_partials/_use-case-iot-create-cagg.mdx";

# Set up the database

This tutorial uses the energy consumption data for over a year in a
hypertable named `metrics`.

<Collapsible heading="Create a Timescale service and connect to your service" defaultExpanded={false}>

<CreateAndConnect/>

</Collapsible>

<Collapsible heading="The dataset" defaultExpanded={false}>

This tutorial uses the energy consumption data for over a year in a typical
household. You can use this data to analyze the energy consumption pattern.

<CreateHypertableEnergy />

<AddDataEnergy />

</Collapsible>

<Collapsible heading="Downsampling the data" defaultExpanded={false}>

<CreateCaggs />

## Create continuous aggregates

<Procedure>

<CreateCaggsOnIOTData />

</Procedure>

</Collapsible>

<Collapsible heading="Connect to Grafana" defaultExpanded={false}>

The queries in this tutorial are suitable for visualizing in Grafana. If you
want to visualize the results of your queries, connect your Grafana account to
the energy consumption dataset.

<GrafanaConnect />

</Collapsible>
