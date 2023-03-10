---
title: Create a Timescale service
excerpt: Create a TimecaleDB service in Timescale Cloud
products: [cloud]
keywords: [services, create, installation]
cloud_ui:
    path:
        - [services]
    priority: 2
---

# Create a Timescale service

Timescale Cloud is a hosted, cloud-native Timescale service that allows you to
quickly spin up new Timescale instances. You can
[try Timescale Cloud for free][sign-up], no credit card required.

For installation instructions, and help getting your first service up and
running, see the [Timescale Cloud installation section][cloud-install].

Each Timescale Cloud service can have a single database. The database must be
named `tsdb`. If you try to create an additional database you receive an error
like this:

```sql
ERROR:  tsdb_admin: database <DB_NAME> is not an allowed database name
HINT:  Contact your administrator to configure the "tsdb_admin.allowed_databases"
```

If you need another database, you need to create a new service.

## Where to next

If you want to work through some tutorials to help you get up and running with
Timescale and time-series data, check out the [tutorials][tutorials] section.

If you're interested in learning more about pricing for Timescale Cloud, visit
the [Timescale pricing calculator][timescale-pricing].

You can always [contact us][contact] if you need help working something out, or
if you want to have a chat.

[cloud-install]: /install/:currentVersion:/installation-cloud/
[contact]: https://www.timescale.com/contact
[sign-up]: https://www.timescale.com/timescale-signup
[timescale-pricing]: https://www.timescale.com/products#cloud-pricing
[tutorials]: /timescaledb/:currentVersion:/tutorials/
