---
title: Create your first $SERVICE_LONG
excerpt: Sign up for $COMPANY and create your first $SERVICE_SHORT
products: [cloud]
layout_components: [next_prev_large]
content_group: Getting started
---

import Install from "versionContent/_partials/_cloud-installation.mdx";
import Connect from "versionContent/_partials/_cloud-connect.mdx";
import CreateAHypertable from "versionContent/_partials/_create-hypertable.mdx";

# Create your first $SERVICE_LONG

You use $CONSOLE to create and manage `Ops` for your $SERVICE_LONG ($SERVICE_SHORT), and securely manage 
`Data` in your $SERVICE_SHORTs. 

![$CONSOLE overview](https://assets.timescale.com/docs/images/console-overview.png)

Each $SERVICE_SHORT is a single 100% PostgreSQL database with [usage-based storage][how-plans-work].

$CLOUD_LONG offers the following PostgreSQL optimized database services:

- **$SERVICE_TSA**: a Timescale DB instance optimized for your 
    [time-series and analytics][what-is-time-series] workloads.
- **$SERVICE_DPSQL**: for all other workloads. A PostgreSQL instance with a 
    [dynamic compute range][what-is-dynamic-postgres] aligned to your business needs.

This section shows you how to create a $CLOUD_SHORT, then connect to it using either a secure Cloud SQL 
editor in $CONSOLE, or command line tools.

<Install />

## Create a $SERVICE_LONG

<Procedure>

Now that you have an active $CLOUD_LONG account, you create and manage your services in $CONSOLE:

1. In the [service creation page]($CONSOLE_CREATE_SERVICE_URL), choose **$SERVICE_TSA**.
   ![Create $SERVICE_LONG](https://assets.timescale.com/docs/images/console-create-service.png)

1. In **Create a $SERVICE_SHORT **, configure your $CLOUD_SHORT, then click **Create service**.

   Your $CLOUD_SHORT is constructed immediately and is ready to use.

1. Click **Download the config** and store the configuration information you need to connect to this service in a 
   secure location. 

   This file contains the passwords and configuration information you need to connect to your service using the
   $CONSOLE Cloud SQL editors, from the command line, or using third party database administration tools.

1. Follow the service creation wizard.   

If you choose to go directly to the service overview, [Check your service and connect to it][connect-to-your-service] 
shows you how to connect.

Hmm, try with a variable [Check your service and connect to it]($CONNECT_TO_SERVICE) which?  

A variable 

$SIGH

Another variable

$GNNNN

Wow


</Procedure> 

## Connect to your $CLOUD_SHORT

<Connect />

## Create a hypertable

<CreateAHypertable />

And that is it, you are up and running. Enjoy developing with Timescale.

[services-how-to]: /use-timescale/:currentVersion:/services/
[install-psql]: /use-timescale/:currentVersion:/integrations/query-admin/psql/
[connect-to-your-service]: /getting-started/:currentVersion:/services/#connect-to-your-service
[create-service]: https://console.cloud.timescale.com/dashboard/create_services
[what-is-time-series]: https://www.timescale.com/blog/what-is-a-time-series-database/#what-is-a-time-series-database
[what-is-dynamic-postgres]: https://www.timescale.com/dynamic-postgresql
[how-plans-work]: /about/:currentVersion:/pricing-and-account-management/#how-plans-work
