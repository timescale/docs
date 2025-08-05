---
title: Query time-series data tutorial - set up dataset
excerpt: Inject and set up a dataset in Tiger Cloud so you can query and visualize time-series data
products: [cloud]
keywords: [beginner, tutorials, create, dataset]
layout_components: [next_prev_large]
content_group: Analyze NYC taxi cab data
---

import CreateAndConnect from "versionContent/_partials/_cloud-create-connect-tutorials.mdx";
import CreateHypertableNyc from "versionContent/_partials/_create-hypertable-nyctaxis.mdx";
import AddDataNyc from "versionContent/_partials/_add-data-nyctaxis.mdx";
import PreloadedData from "versionContent/_partials/_preloaded-data.mdx";
import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";


# Ingest data into a $SERVICE_LONG

This tutorial uses a dataset that contains historical data from the New York City Taxi and Limousine 
Commission [NYC TLC][nyc-tlc], in a hypertable named `rides`. It also includes a separate
tables of payment types and rates, in a regular $PG table named
`payment_types`, and `rates`.

## Prerequisites

<IntegrationPrereqs />

<CreateHypertableNyc />

<AddDataNyc />

[nyc-tlc]: https://www1.nyc.gov/site/tlc/about/tlc-trip-record-data.page
