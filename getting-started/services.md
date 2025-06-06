---
title: Create your first Tiger Cloud service
excerpt: Tiger Cloud offers a range of capabilities to accommodate your real-time analytics and AI and vector workloads. Learn more about each of them and create your first service in Tiger Cloud console
products: [cloud]
content_group: Getting started
---

import Install from "versionContent/_partials/_cloud-installation.mdx";
import Connect from "versionContent/_partials/_cloud-connect-service.mdx";
import ServiceOverview from "versionContent/_partials/_service-overview.mdx";
import CloudIntro from "versionContent/_partials/_cloud-intro.mdx";
import WhereNext from "versionContent/_partials/_where-to-next.mdx";

# Create a $SERVICE_LONG

<CloudIntro />

<ServiceOverview />

To start using $CLOUD_LONG for your data:

1. [Create a $COMPANY account][create-an-account]: register to get access to $CONSOLE as a centralized point to administer and interact with your data.
1. [Create a $SERVICE_LONG][create-a-service]: that is, a $PG database instance, powered by [$TIMESCALE_DB][timescaledb], built for production, and extended with cloud features like transparent data tiering to object storage.
1. [Connect to your $SERVICE_LONG][connect-to-your-service]: to run queries, add and migrate your data from other sources.

<Install />

## Create a $SERVICE_LONG

Now that you have an active $CLOUD_LONG account, you create and manage your $SERVICE_SHORTs in $CONSOLE. When you create a $SERVICE_SHORT, you effectively create a blank $PG database with additional $CLOUD_LONG features available under your $PRICING_PLAN. You then add or migrate your data into this database. 

<Procedure>

1. In the [$SERVICE_SHORT creation page][create-service], choose the $PG capability or add `Time-series and analytics` and `AI and Vector` capabilities. Click `Save and continue`.

   ![Create a $SERVICE_LONG](https://assets.timescale.com/docs/images/create-timescale-service.png)

1. Follow the next steps in `Create a service` to configure the region, compute size, environment, availability, connectivity, and $SERVICE_SHORT name. Then click `Create service`.

   Your $SERVICE_SHORT is constructed and ready to use in a few seconds. 

1. Click `Download the config` and store the configuration information you need to connect to this $SERVICE_SHORT in a secure location.

   This file contains the passwords and configuration information you need to connect to your $SERVICE_SHORT using the
   $CONSOLE $DATA_MODE, from the command line, or using third-party database administration tools.

If you choose to go directly to the $SERVICE_SHORT overview, [Connect to your $SERVICE_SHORT][connect-to-your-service] 
shows you how to connect.

</Procedure> 

## Connect to your $SERVICE_SHORT

To run queries and perform other operations, connect to your $SERVICE_SHORT:

<Connect />

<WhereNext />


[tsc-portal]: https://console.cloud.timescale.com/
[services-how-to]: /use-timescale/:currentVersion:/services/
[install-psql]: /integrations/:currentVersion:/psql/
[create-an-account]: /getting-started/:currentVersion:/services/#create-a-timescale-cloud-account
[create-a-service]: /getting-started/:currentVersion:/services/#create-a-timescale-cloud-service
[connect-to-your-service]: /getting-started/:currentVersion:/services/#connect-to-your-service
[create-a-hypertable]: /getting-started/:currentVersion:/services/#create-a-hypertable
[create-service]: https://console.cloud.timescale.com/dashboard/create_services
[what-is-time-series]: https://www.timescale.com/blog/what-is-a-time-series-database/#what-is-a-time-series-database
[what-is-dynamic-postgres]: https://www.timescale.com/dynamic-postgresql
[hypertables]: /use-timescale/:currentVersion:/hypertables/#hypertable-partitioning
[timescaledb]: https://docs.timescale.com/#TimescaleDB

