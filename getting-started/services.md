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

# Create your first $SERVICE_LONG

$CLOUD_LONG offers the following PostgreSQL optimized database $SERVICE_SHORTs:

- **Time-series and Analytics**: a $TIMESCALE_DB instance optimized for your 
    [time-series and analytics][what-is-time-series] workloads.
- **Dynamic PostgreSQL**: for all other workloads. A PostgreSQL instance with a 
    [dynamic compute range][what-is-dynamic-postgres] aligned to your business needs.
- **Vector and AI**: for apps that require fast search on vector embeddings and metadata, like semantic search, image
  search, RAG and Agents. Powered by $COMPANY Vector and available on Time-series and Dynamic PostgreSQL services. 

<ServiceOverview />

This section shows you how to create a $SERVICE_SHORT, connect to it, create a standard PostgreSQL table, then 
convert it into a [$HYPERTABLE][hypertables]. Anything you can do with regular PostgreSQL tables, you can 
do with $HYPERTABLES, just with better performance and improved user experience for time-series data.

<Install />

## Create a $SERVICE_LONG

<Procedure>

Now that you have an active $COMPANY account, you create and manage your services in $CONSOLE:

1. In the [$SERVICE_SHORT creation page][create-service], choose **Time Series and Analytics**.
   ![Create Timescale Cloud service](https://assets.timescale.com/docs/images/console-create-service.png)

1. In **Create a service**, configure your $SERVICE_SHORT, then click **Create service**.

   Your $SERVICE_SHORT is constructed immediately and is ready to use.

1. Click **Download the config** and store the configuration information you need to connect to this $SERVICE_SHORT in a 
   secure location. 

   This file contains the passwords and configuration information you need to connect to your $SERVICE_SHORT using the
   $CONSOLE Cloud SQL editors, from the command line, or using third-party database administration tools.

1. Follow the $SERVICE_SHORT creation wizard.   

If you choose to go directly to the $SERVICE_SHORT overview, [Check your $SERVICE_SHORT and connect to it][connect-to-your-service] 
shows you how to connect.

</Procedure> 

## Connect to your $SERVICE_SHORT

<Connect />

## Create a $HYPERTABLE

<CreateAHypertable />

And that is it, you are up and running. Enjoy developing with $COMPANY.

[tsc-portal]: https://console.cloud.timescale.com/
[services-how-to]: /use-timescale/:currentVersion:/services/
[install-psql]: /use-timescale/:currentVersion:/integrations/query-admin/psql/
[connect-to-your-service]: /getting-started/:currentVersion:/services/#connect-to-your-service
[create-service]: https://console.cloud.timescale.com/dashboard/create_services
[what-is-time-series]: https://www.timescale.com/blog/what-is-a-time-series-database/#what-is-a-time-series-database
[what-is-dynamic-postgres]: https://www.timescale.com/dynamic-postgresql
[hypertables]: /use-timescale/:currentVersion:/hypertables/about-hypertables/#hypertable-partitioning
