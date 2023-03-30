---
title: Service overview
excerpt: See information on your service's connection parameters, configuration, and resource usage
products: [cloud]
keywords: [connect, services]
tags: [storage, resources, disk space]
cloud_ui:
    path:
        - [services, :serviceID, overview]
    priority: 1
---

# Service overview

When you log in to your [Timescale Cloud account][cloud-login], you see the
`Services` page. Click the service you are interested in to see the `Services
Overview` tab. This section contains your service's connection information, and
an overview of the configuration and resource usage for the service.

<img
class="main-content__illustration"
src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-services-overview.png"
alt="Timescale Cloud Services Overview"
/>

## Service users

By default, when you create a new service, a new `tsdbadmin` user is created.
This is the user that you use to connect to your new service.

<Highlight type="important">
The `tsdbadmin` user is the owner of the database, but is not a superuser. You
cannot access the `postgres` user. There is no superuser access to Timescale
Cloud databases.
</Highlight>

On Timescale Cloud services, the `tsdbadmin` user can create another user
with any other roles. For a complete list of roles available, see the
[PostgreSQL role attributes documentation][pg-roles-doc].

Additionally, you cannot create multiple databases on a single Timescale Cloud
service. If you need data isolation, use schemas or create additional services.

[cloud-login]: https://console.cloud.timescale.com/
[pg-roles-doc]: https://www.postgresql.org/docs/current/role-attributes.html
