---
title: Create a service
excerpt: Create a service in Timescale Cloud
product: cloud
keywords: [services, create, installation]
---

# Create a service

Timescale Cloud is a hosted, cloud-native TimescaleDB service that allows you to
quickly spin up new TimescaleDB instances. You can
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

Now that you have your first service up and running, you can check out the
[Timescale Cloud][tsc-docs] section in our documentation, and
find out what you can do with it.

If you want to work through some tutorials to help you get up and running with
TimescaleDB and time-series data, check out our [tutorials][tutorials] section.

If you're interested in learning more about pricing for Timescale Cloud, visit
the [TimescaleDB pricing calculator][timescale-pricing].

You can always [contact us][contact] if you need help working something out, or
if you want to have a chat.

[cloud-install]: /install/:currentVersion:/installation-cloud/
[contact]: https://www.timescale.com/contact
[sign-up]: https://www.timescale.com/timescale-signup
[timescale-pricing]: https://www.timescale.com/products#cloud-pricing
[tsc-docs]: /cloud/:currentVersion:/
[tutorials]: /timescaledb/:currentVersion:/tutorials/
