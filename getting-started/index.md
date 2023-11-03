---
title: Getting started with Timescale
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

# Getting started with Timescale

<TimescaleIntro />

This guide shows you how to get started with a time-series database in
Timescale. It steps you through creating your first Timescale service, adding
some sample financial data to your database, helps you construct some queries to
find out some interesting things about your data, and start using useful
functions like continuous aggregates.

<CloudIntro />

Timescale offers two products: a time-series database with TimescaleDB, and 
Dynamic PostgreSQL. The time-series database is optimized for your time-series 
and analytics workloads. Dynamic PostgreSQL is built for all of other 
production database workloads. Both products have everything the Timescale data 
platform has to offer. This guide will walk you through creating a time-series 
database. 

Completing this guide should take you less than half an hour. As you go through
the guide, you learn how to:

1.  [Create your first Timescale service][services-create]
1.  [Connect to your service][services-connect]
1.  [Ingest some real financial data into your database][ingest-data]
1.  [Construct some interesting queries][queries] <FeaturedCTA href="/getting-started/latest/queries/#try-it-out-code-block-1" data-tracking="cta-try-out-queries">Try out some <b>live queries</b></FeaturedCTA>
1.  [Create and query a continuous aggregates][caggs]

When you have finished this guide, you might want to check out some
[more advanced tutorials][tutorials], or browse through
[the other guides][use-timescale].

[tutorials]: /tutorials/:currentVersion:/
[use-timescale]: /use-timescale/:currentVersion:/
[services-create]: /getting-started/:currentVersion:/services#create-your-timescale-account
[services-connect]: /getting-started/:currentVersion:/services/#connect-to-your-service
[ingest-data]: /getting-started/:currentVersion:/time-series-data/
[queries]: /getting-started/:currentVersion:/queries/
[caggs]: /getting-started/:currentVersion:/aggregation/
