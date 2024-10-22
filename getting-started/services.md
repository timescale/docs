---
title: Create your first Timescale service
excerpt: Sign up for Timescale and create your first service
products: [cloud]
layout_components: [next_prev_large]
content_group: Getting started
---

import Install from "versionContent/_partials/_cloud-installation.mdx";
import Connect from "versionContent/_partials/_cloud-connect.mdx";
import CreateAHypertable from "versionContent/_partials/_create-hypertable.mdx";
import ServiceOverview from "versionContent/_partials/_service-overview.mdx";

# Create your first Timescale service

Timescale Cloud offers the following PostgreSQL optimized database services:

- **Time-series and Analytics**: a Timescale DB instance optimized for your 
    [time-series and analytics][what-is-time-series] workloads.
- **Dynamic PostgreSQL**: for all other workloads. A PostgreSQL instance with a 
    dynamic compute range aligned to your business needs.
- **Vector and AI**: for apps that require fast search on vector embeddings and metadata, like semantic search, image
  search, RAG and Agents. Powered by Timescale Vector and available on Time-series and Dynamic PostgreSQL services. 

<ServiceOverview />

This section shows you how to create a service, connect to it, create a standard PostgreSQL table, then 
convert it into a [Hypertable][hypertables]. Anything you can do with regular PostgreSQL tables, you can 
do with hypertables, just with better performance and improved an user experience for time-series data.

<Install />

## Create a Timescale Cloud service

<Procedure>

Now that you have an active Timescale account, you create and manage your services in Timescale Console:

1. In the [service creation page][create-service], choose **Time Series and Analytics**.
   ![Create Timescale Cloud service](https://assets.timescale.com/docs/images/console-create-service.png)

1. In **Create a service**, configure your service, then click **Create service**.

   Your service is constructed immediately and is ready to use.

1. Click **Download the config** and store the configuration information you need to connect to this service in a 
   secure location. 

   This file contains the passwords and configuration information you need to connect to your service using the
   Timescale Console Cloud SQL editors, from the command line, or using third party database administration tools.

1. Follow the service creation wizard.   

If you choose to go directly to the service overview, [Check your service and connect to it][connect-to-your-service] 
shows you how to connect.

</Procedure> 

## Connect to your service

<Connect />

## Create a hypertable

<CreateAHypertable />

And that is it, you are up and running. Enjoy developing with Timescale.

[tsc-portal]: https://console.cloud.timescale.com/
[services-how-to]: /use-timescale/:currentVersion:/services/
[install-psql]: /use-timescale/:currentVersion:/integrations/query-admin/psql/
[connect-to-your-service]: /getting-started/:currentVersion:/services/#connect-to-your-service
[create-service]: https://console.cloud.timescale.com/dashboard/create_services
[what-is-time-series]: https://www.timescale.com/blog/what-is-a-time-series-database/#what-is-a-time-series-database
[hypertables]: /use-timescale/:currentVersion:/hypertables/about-hypertables/#hypertable-partitioning
