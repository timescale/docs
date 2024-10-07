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

# Create your first Timescale service

You use Timescale Console to create and manage `Ops` for your Timescale Cloud services, and securely manage 
`Data` in your services. 

![Timescle Console overview](https://assets.timescale.com/docs/images/console-overview.png)

Each service is a single 100% PostgreSQL database with [usage-based storage][how-plans-work] and basic relational capabilities. 
This section shows you how to create a service, then connect to it using either a secure Cloud SQL 
editor in Timescale Console, or command line tools.

<Install />

## Create a Timescale Cloud service

<Procedure>

Now that you have an active Timescale account, you create and manage your services in Timescale Console:

1. In the [service creation page][create-service], choose the general-purpose PostgreSQL service or enable additional capabilities. See more about these capabilities [here][docs-home-page]. 

   ![Create Timescale Cloud service](https://assets.timescale.com/docs/images/create-timescale-service.png)

1. Follow the next steps in **Create a service** to configure the compute size, environment, availability, region, and service name. Then click **Create service**.

   Your service is constructed immediately and is ready to use.

1. Click **Download the config** and store the configuration information you need to connect to this service in a 
   secure location. 

   This file contains the passwords and configuration information you need to connect to your service using the
   Timescale Console Cloud SQL editors, from the command line, or using third-party database administration tools.

1. Follow the rest of the service creation wizard.   

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
[how-plans-work]: /about/:currentVersion:/pricing-and-account-management/#how-plans-work
[docs-home-page]: https://docs.timescale.com/
