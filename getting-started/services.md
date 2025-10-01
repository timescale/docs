---
title: Create your first Tiger Cloud service
excerpt: Tiger Cloud offers a range of capabilities to accommodate your real-time analytics and AI and vector workloads. Learn more about each of them and create your first service in Tiger Cloud Console
products: [cloud]
content_group: Getting started
---

import Install from "versionContent/_partials/_cloud-installation.mdx";
import InstallAzure from "versionContent/_partials/_cloud-installation-azure.mdx";
import Connect from "versionContent/_partials/_cloud-connect-service.mdx";
import CreateService from "versionContent/_partials/_create-service.mdx";
import ServiceOverview from "versionContent/_partials/_service-overview.mdx";
import ServiceOverviewAzure from "versionContent/_partials/_service-overview-azure.mdx";
import CloudIntro from "versionContent/_partials/_cloud-intro.mdx";
import CloudIntroAzure from "versionContent/_partials/_cloud-intro-azure.mdx";
import WhereNext from "versionContent/_partials/_where-to-next.mdx";
import StartUsingCloud from "versionContent/_partials/_start-using-cloud.mdx";
import StartUsingCloudAzure from "versionContent/_partials/_start-using-cloud-azure.mdx";

# Create a $SERVICE_LONG

<Tabs label="Tiger Cloud on AWS and Azure" persistKey="tiger-platform-clouds">

<Tab title="Tiger Cloud on AWS" label="aws-cloud">

<CloudIntro />

<ServiceOverview />

<StartUsingCloud />

<Install />

## Create a $SERVICE_LONG

Now that you have an active $ACCOUNT_LONG, you create and manage your $SERVICE_SHORTs in $CONSOLE. When you create a $SERVICE_SHORT, you effectively create a blank $PG database with additional $CLOUD_LONG features available under your $PRICING_PLAN. You then add or migrate your data into this database. 

<CreateService />

## Connect to your $SERVICE_SHORT

To run queries and perform other operations, connect to your $SERVICE_SHORT:

<Connect />

<WhereNext />

</Tab>

<Tab title="Tiger Cloud on Azure" label="azure-cloud">

<CloudIntroAzure />

<ServiceOverviewAzure />

<StartUsingCloudAzure />

<InstallAzure />

## Create a $SERVICE_LONG

Now that you have an active $ACCOUNT_LONG, you create and manage your $SERVICE_SHORTs in $CONSOLE. When you create a $SERVICE_SHORT, you effectively create a blank $PG database with additional $CLOUD_LONG features available under your $PRICING_PLAN. You then add or migrate your data into this database.

<CreateService />

## Connect to your $SERVICE_SHORT

To run queries and perform other operations, connect to your $SERVICE_SHORT:

<Connect />

<WhereNext />

</Tab>

</Tabs>

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
[timescaledb]: https://docs.tigerdata.com/#TimescaleDB

