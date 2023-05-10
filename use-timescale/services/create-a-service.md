---
title: Create a Timescale service
excerpt: Create a TimecaleDB service in Timescale
products: [cloud]
keywords: [services, create, installation]
cloud_ui:
    path:
        - [services]
    priority: 2
---

import WhereTonext from "versionContent/_partials/_where-to-next.mdx";

# Create a Timescale service

Timescale is a hosted, cloud-native Timescale service that allows you to
quickly spin up new Timescale instances. You can
[try Timescale for free][sign-up], no credit card required.

For installation instructions, and help getting your first service up and
running, see the [Timescale installation section][cloud-install].

Each Timescale service can have a single database. The database must be
named `tsdb`. If you try to create an additional database you receive an error
like this:

```sql
ERROR:  tsdb_admin: database <DB_NAME> is not an allowed database name
HINT:  Contact your administrator to configure the "tsdb_admin.allowed_databases"
```

If you need another database, you need to create a new service.

## Where to next

<WhereTonext />

[cloud-install]: /getting-started/latest/
[contact]: https://www.timescale.com/contact
[sign-up]: https://www.timescale.com/timescale-signup
[timescale-pricing]: https://www.timescale.com/products#cloud-pricing
[tsc-docs]: /use-timescale/:currentVersion:/
[tutorials]: /tutorials/:currentVersion:/
