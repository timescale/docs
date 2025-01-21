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
import CloudIntro from "versionContent/_partials/_cloud-intro.mdx";

# Create your first $SERVICE_LONG

<CloudIntro />

<ServiceOverview />

To start using $CLOUD_LONG for your data:

1. [Create a $COMPANY account][create-an-account]: register in $CONSOLE to get a centralized point to administer and interact with your data.
1. [Create a $SERVICE_LONG][create-a-service]: that is, a PostgreSQL database instance, powered by [$TIMESCALE_DB][timescaledb], built for production, and extended with cloud features like transparent data tiering to object storage.
1. [Connect to your $SERVICE_LONG][connect-to-your-service]: to run queries, add and migrate your data from other sources.
1. [Create a hypertable][create-a-hypertable]: create a standard PostgreSQL table in your service, then convert it into a [hypertable][hypertables].

   Anything you can do with regular PostgreSQL tables, you can do with hypertables, just with better performance and improved user experience for time-series data.

<Install />

## Create a $SERVICE_LONG

Now that you have an active $COMPANY account, you create and manage your $SERVICE_SHORTs in $CONSOLE. When you create a service, you give a structure for your future data, which you then add manually or migrate from other services. All relevant $CLOUD_LONG features under your pricing plan are automatically available when you create a service. 

<Procedure>

1. In the [service creation page][create-service], choose the PostgreSQL service or add `Time-series and analytics` and `AI and Vector` capabilities. Click `Save and continue`.

   ![Create Timescale Cloud service](https://assets.timescale.com/docs/images/create-timescale-service.png)

1. Follow the next steps in `Create a service` to configure the compute size, environment, availability, region, and service name. Then click `Create service`.

   Your service is constructed immediately and is ready to use.

1. Click `Download the config` and store the configuration information you need to connect to this service in a secure location.

   This file contains the passwords and configuration information you need to connect to your service using the
   $CONSOLE data mode, from the command line, or using third-party database administration tools.

If you choose to go directly to the service overview, [Check your service and connect to it][connect-to-your-service] 
shows you how to connect.

</Procedure> 

## Connect to your service

A Timescale service comes with access control to its data. To be able to run queries and perform other operations, connect to the service with credentials generated during its creation.

<Connect />

## Create a hypertable

<CreateAHypertable />

And that is it, you are up and running. Enjoy developing with $COMPANY.

[tsc-portal]: https://console.cloud.timescale.com/
[services-how-to]: /use-timescale/:currentVersion:/services/
[install-psql]: /use-timescale/:currentVersion:/integrations/psql/
[create-an-account]: /getting-started/:currentVersion:/services/#create-a-timescale-cloud-account
[create-a-service]: /getting-started/:currentVersion:/services/#create-a-timescale-cloud-service
[connect-to-your-service]: /getting-started/:currentVersion:/services/#connect-to-your-service
[create-a-hypertable]: /getting-started/:currentVersion:/services/#create-a-hypertable
[create-service]: https://console.cloud.timescale.com/dashboard/create_services
[what-is-time-series]: https://www.timescale.com/blog/what-is-a-time-series-database/#what-is-a-time-series-database
[what-is-dynamic-postgres]: https://www.timescale.com/dynamic-postgresql
[hypertables]: /use-timescale/:currentVersion:/hypertables/about-hypertables/#hypertable-partitioning
[timescaledb]: https://docs.timescale.com/#TimescaleDB

