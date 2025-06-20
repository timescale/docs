---
title: About services
excerpt: Manage your Tiger Cloud services in the Console. Run daily admin operations, control access, set up security, compress data, run analytical queries, and more
products: [cloud]
keywords: [connect, services]
tags: [storage, resources, disk space]
cloud_ui:
    path:
        - [services, :serviceId, overview]
---
import ServiceOverview from "versionContent/_partials/_service-overview.mdx";

# About $SERVICE_LONGs

<ServiceOverview />

When you log into [$CONSOLE][cloud-login], you see the
$PROJECT_SHORT overview. Click a $SERVICE_SHORT to view run-time data and connection information. 
Click `Operations` to configure your $SERVICE_SHORT. 

![Select a query to edit](https://assets.timescale.com/docs/images/tiger-cloud-console/ops-mode-overview-tiger-cloud.png)

Each $SERVICE_SHORT hosts a single database managed for you by $CLOUD_LONG. 
If you need more than one database, [create a new $SERVICE_SHORT][create-service].

## $SERVICE_SHORT_CAP users

By default, when you create a new $SERVICE_SHORT, a new `tsdbadmin` user is created.
This is the user that you use to connect to your new $SERVICE_SHORT.

<Highlight type="important">

The `tsdbadmin` user is the owner of the database, but is not a superuser. You
cannot access the `postgres` user. There is no superuser access to $CLOUD_LONG databases.

</Highlight>

In your $SERVICE_SHORT, the `tsdbadmin` user can create another user
with any other role. For a complete list of roles available, see the
[PostgreSQL role attributes documentation][pg-roles-doc].

You cannot create multiple databases in a single $SERVICE_SHORT. If you need data isolation, use schemas or create additional $SERVICE_SHORTs.

[cloud-login]: https://console.cloud.timescale.com/
[pg-roles-doc]: https://www.postgresql.org/docs/current/role-attributes.html
[create-service]: /getting-started/:currentVersion:/services/#create-a-timescale-cloud-service

