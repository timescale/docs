---
title: Administer your Timescale deployment
excerpt: Learn how to work with Timescale
plans: [scale, enterprise]
---

import CloudIntro from "versionContent/_partials/_cloud-intro.mdx";
import MSTIntro from "versionContent/_partials/_mst-intro.mdx";
import CloudMSTComparison from "versionContent/_partials/_cloud-mst-comparison.mdx";
import CloudOverview from "versionContent/_partials/_cloud-service-overview.mdx";
import MSTOverview from "versionContent/_partials/_mst-service-overview.mdx";
import SelfOverview from "versionContent/_partials/_self-hosted-overview.mdx";

# Administer your deployment

$TIMESCALE_DB is an open-source database designed to make SQL scalable for time-series data. 
It is engineered up from PostgreSQL and packaged as a PostgreSQL extension, maintaining 
full SQL support.

You can use TimescaleDB in:

* **Timescale Cloud**: a high-performance developer focused cloud that provides PostgreSQL services enhanced with our blazing fast vector search.
* **Managed Service for TimescaleDB** (MST) :  TimescaleDB hosted on Azure and GCP. MST is offered in partnership with Aiven.
* **Self-hosted**: add TimescaleDB to your PostgreSQL deploment and manage everything yourself. 

This section shows you how to administer Timescale products using the different 
deployment options. 


<Tabs label="Admin overview" persistKey="Timescale Cloud">

<Tab title="Timescale Cloud">

<CloudOverview />

</Tab>

<Tab title="MST">

<MSTOverview />

</Tab>

<Tab title="Self-hosted">

<SelfOverview />

</Tab>

</Tabs>


[find-docs]: /navigation/:currentVersion:/
