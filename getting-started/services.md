---
title: Create your first Timescale Cloud service
excerpt: Sign up for Timescale and create your first service
products: [cloud]
layout_components: [next_prev_large]
content_group: Getting started
---

import Install from "versionContent/_partials/_cloud-installation.mdx";
import CreateService from "versionContent/_partials/_cloud-create-service.mdx";
import Connect from "versionContent/_partials/_cloud-connect.mdx";
import CloudIntro from "versionContent/_partials/_cloud-intro.mdx";

# Create your first Timescale service

You use Timescale Console to create and manage Timescale services. Each service is a single 100% PostgreSQL database with usage-based storage.

Timescale Cloud offers the following PostgreSQL optimized database services:

- **Time-series and Analytics**: a Timescale DB instance optimized for your 
    [time-series and analytics][what-is-time-series] workloads.
- **Dynamic PostgreSQL**: for all other workloads. A PostgreSQL instance with a 
    [dynamic compute range][what-is-dynamic-postgres] aligned to your business needs.

This section shows you how to create a Timescale service, then connect to your service using either a secure Cloud SQL 
editor in Timescale Console, or command line tools.

<Install />

## Create a Timescale Cloud service

<Procedure>

Now that you have an active Timescale account, you can create and manage your services in Timescale Console:

1. In the [service creation page][create-service],
   choose **Time Series and Analytics** or **Dynamic PostgreSQL**.
1. In **Create a service**, configure your service, then click **Create service**.

   Your service is constructed immediately and is ready to use.

1. Click **Download the config** and store the configuration information you need to connect to this service in a 
   secure location. 

   This file contains the passwords and configuration information you need to connect to your service from the command 
   line, or third party database administration tools. You can also connect to your service from Timescale Console 
   using our Cloud SQL editors.

1. Follow the service creation wizard.   

If you choose to go directly to the service overview, [Check your service and connect to it][connect-to-your-service] 
shows you how to connect.

</Procedure> 

<Connect />

And that is it, you are up and running. Enjoy developing with Timescale.

[tsc-portal]: https://console.cloud.timescale.com/
[services-how-to]: /use-timescale/:currentVersion:/services/
[install-psql]: /use-timescale/:currentVersion:/integrations/query-admin/psql/
[connect-to-your-service]: /getting-started/:currentVersion:/services/#check-your-service-and-connect-to-it
[create-service]: https://console.cloud.timescale.com/dashboard/create_services
[popsql]: /getting-started/:currentVersion:/run-queries-from-console/#popsql
[what-is-time-series]: https://www.timescale.com/blog/what-is-a-time-series-database/#what-is-a-time-series-database
[what-is-dynamic-postgres]: https://www.timescale.com/dynamic-postgresql
