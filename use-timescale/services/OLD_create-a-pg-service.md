---
title: Create a PostgreSQL service
excerpt: Create a PostgreSQL service in Timescale
products: [cloud]
keywords: [services, PostgreSQL, create, install]
---

import EarlyAccess from "versionContent/_partials/_early_access.mdx";

# Create a PostgreSQL service

<EarlyAccess />

Timescale is a hosted, cloud-native Timescale service that allows you to
quickly spin up new Timescale instances. In addition to your Timescale
databases, you can also create services that run standard PostgreSQL, without
Timescale's time-series capabilities. PostgreSQL services are less expensive to
run than Timescale services, so they are a great option if you're running
relational databases alongside your time-series databases.

You can [try Timescale for free][sign-up], no credit card required.

For installation instructions, and help getting your first service up and
running, see the [Getting Started section][cloud-install].

<Procedure>

## Creating a PostgreSQL service

1.  Sign in to the [Timescale portal][cloud-console].
1.  Click `Create service`.
1.  In the `Create a service` dialog, click `Advanced configuration`.
1.  In the `Choose your service type` section, check `PostgreSQL`.
1.  Complete the other fields according to your environment.
1.  Click `Create service` to build your PostgreSQL service.

    <img
        class="main-content__illustration"
        src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-create-pgservice.png"
        alt="Create a new PostgreSQL service in the Timescale portal"
    />

</Procedure>

When you return to the Timescale Services page, your PostgreSQL service is
marked with a PostgreSQL tag, so you can easily distinguish it from your
time-series services:

<img
    class="main-content__illustration"
    src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-view-pgservice.png"
    alt="A running PostgreSQL service with a running Timescale service in the Timescale portal"
/>

[cloud-install]: /getting-started/latest/
[sign-up]: https://www.timescale.com/timescale-signup
[cloud-console]: https://console.cloud.timescale.com/
