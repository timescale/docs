---
title: About services
excerpt: See information on your service's connection parameters, configuration, and resource usage
products: [cloud]
keywords: [connect, services]
tags: [storage, resources, disk space]
cloud_ui:
    path:
        - [services, :serviceId, overview]
---

# About services

You use Timescale Console to create and manage `Ops` for your Timescale Cloud services, and securely manage
`Data` in your services.

![Timescle Console overview](https://assets.timescale.com/docs/images/console-overview.png)

When you log into your [Timescale account][cloud-login], you see the
Project overview. Click a service to view run-time data and connection information. 
Click `Operations` to configure your service. 

![Select a query to edit](https://assets.timescale.com/docs/images/ops-mode-overview.png)

Each service hosts a single database managed for you by Timescale in the cloud. 
If you need more than one database, [create a new service][create-service].

## Service users

By default, when you create a new service, a new `tsdbadmin` user is created.
This is the user that you use to connect to your new service.

<Highlight type="important">
The `tsdbadmin` user is the owner of the database, but is not a superuser. You
cannot access the `postgres` user. There is no superuser access to Timescale
Cloud databases.
</Highlight>

On Timescale services, the `tsdbadmin` user can create another user
with any other roles. For a complete list of roles available, see the
[PostgreSQL role attributes documentation][pg-roles-doc].

You cannot create multiple databases on a single Timescale
service. If you need data isolation, use schemas or create additional services.

[cloud-login]: https://console.cloud.timescale.com/
[pg-roles-doc]: https://www.postgresql.org/docs/current/role-attributes.html
[create-service]: /getting-started/:currentVersion:/services/#create-a-timescale-cloud-service

