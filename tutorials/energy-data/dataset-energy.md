---
title: Energy time-series data tutorial - set up dataset
excerpt: Ingest and set up a sample dataset with energy consumption data so that you can run queries on it in Tiger Cloud Console
products: [cloud, self_hosted, mst]
keywords: [tutorials, create, dataset]
tags: [tutorials, beginner]
layout_components: [next_prev_large]
content_group: Analyze energy consumption data
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";
import CreateHypertableEnergy from "versionContent/_partials/_create-hypertable-energy.mdx";
import AddDataEnergy from "versionContent/_partials/_add-data-energy.mdx";
import GrafanaConnect from "versionContent/_partials/_grafana-connect.mdx";
import CreateCaggs from "versionContent/_partials/_caggs-intro.mdx";
import CreateCaggsOnIOTData from "versionContent/_partials/_use-case-iot-create-cagg.mdx";

# Ingest data into a $SERVICE_LONG

This tutorial uses the energy consumption data for over a year in a
hypertable named `metrics`.

## Prerequisites

<IntegrationPrereqs />

<CreateHypertableEnergy />

<AddDataEnergy />

## Create continuous aggregates

<CreateCaggs />

<Procedure>

<CreateCaggsOnIOTData />

</Procedure>

<GrafanaConnect />

