---
title: About services
excerpt: Manage your Tiger Cloud services in Console. Run daily admin operations, control access, set up security, compress data, run analytical queries, and more
products: [cloud]
keywords: [connect, services]
tags: [storage, resources, disk space]
cloud_ui:
    path:
        - [services, :serviceId, overview]
---
import ServiceOverview from "versionContent/_partials/_service-overview.mdx";
import ServiceOverviewAzure from "versionContent/_partials/_service-overview-azure.mdx";
import ServiceUsers from "versionContent/_partials/_service-users.mdx";

# About $SERVICE_LONGs

<Tabs label="Tiger Cloud on AWS and Azure" persistKey="tiger-platform-clouds">

<Tab title="Tiger Cloud on AWS" label="aws-cloud">

<ServiceOverview />

When you log into [$CONSOLE][cloud-login], you see the
$PROJECT_SHORT overview. Click a $SERVICE_SHORT to view run-time data and connection information. 
Click `Operations` to configure your $SERVICE_SHORT. 

![Select a query to edit][select-a-query-to-edit]

Each $SERVICE_SHORT hosts a single database managed for you by $CLOUD_LONG. 
If you need more than one database, [create a new $SERVICE_SHORT][create-service].

## $SERVICE_SHORT_CAP users

<ServiceUsers />

</Tab>

<Tab title="Tiger Cloud on Azure" label="azure-cloud">

<ServiceOverviewAzure />

When you log into [$CONSOLE][cloud-login], you see the
$PROJECT_SHORT overview. Click a $SERVICE_SHORT to view run-time data and connection information.
Click `Operations` to configure your $SERVICE_SHORT.

![Select a query to edit][select-a-query-to-edit]

Each $SERVICE_SHORT hosts a single database managed for you by $CLOUD_LONG.
If you need more than one database, [create a new $SERVICE_SHORT][create-service].

## $SERVICE_SHORT_CAP users

<ServiceUsers />

</Tab>

</Tabs>

[cloud-login]: https://console.cloud.timescale.com/
[create-service]: /getting-started/:currentVersion:/services/#create-a-service_long
[select-a-query-to-edit]: https://assets.timescale.com/docs/images/tiger-on-azure/ops-mode-overview-tiger-console.png
