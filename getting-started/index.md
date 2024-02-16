---
title: Get started with Timescale
excerpt: Getting started with your first Timescale instance
products: [cloud]
layout_components: [next_prev_large]
content_group: Getting started
---

import Install from "versionContent/_partials/_cloud-installation.mdx";
import CreateService from "versionContent/_partials/_cloud-create-service.mdx";
import Connect from "versionContent/_partials/_cloud-connect.mdx";
import CloudIntro from "versionContent/_partials/_cloud-intro.mdx";
import TimescaleIntro from "versionContent/_partials/_timescale-intro.mdx";
import WhereNext from "versionContent/_partials/_where-to-next.mdx";

# Get started with Timescale

<CloudIntro />

Timescale extends PostgreSQL for all of your resource-intensive production workloads. You build faster, scale further, and stay under budget. Timescale offers the following PostgreSQL database optimisations:

- [**Time-series data**](https://www.timescale.com/blog/what-is-a-time-series-database/#what-is-a-time-series-database): a
  TimescaleDB instance optimized for your time-series and analytics workloads, with cloud-only features like transparent low-cost bottomless storage.
- **All other workloads**: a Dynamic PostgreSQL instance where you select a compute range, only paying for the base and the amount of extra CPU as you scale.

Each database instance in Timescale is called a service.

This section shows you how to:

1.  [Create and connect to a Timescale service][services-create]
1.  [Ingest some real financial data into your database][ingest-data]
1.  [Construct some interesting queries][queries] <FeaturedCTA href="/getting-started/latest/queries/#try-it-out-code-block-1" data-tracking="cta-try-out-queries">Try out some <b>live queries</b></FeaturedCTA>
1.  [Create and query a continuous aggregates][caggs]

Already know the basics? See the
[more advanced tutorials][tutorials], or see how to
[Use Timescale][use-timescale].

[tutorials]: /tutorials/:currentVersion:/
[use-timescale]: /use-timescale/:currentVersion:/
[services-create]: /getting-started/:currentVersion:/services#create-your-timescale-account
[services-connect]: /getting-started/:currentVersion:/services/#connect-to-your-service
[ingest-data]: /getting-started/:currentVersion:/time-series-data/
[queries]: /getting-started/:currentVersion:/queries/
[caggs]: /getting-started/:currentVersion:/aggregation/
