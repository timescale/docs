---
title: Create a PostgreSQL service
excerpt: Create a PostgreSQL service in Timescale Cloud
product: cloud
keywords: [services, PostgreSQL, create, install]
---

# Create a PostgreSQL service

Timescale Cloud is a hosted, cloud-native TimescaleDB service that allows you to
quickly spin up new TimescaleDB instances. In addition to your TimescaleDB
databases, you can also create services that run PostgreSQL, if you need to
handle other data alongside your time-series data.

You can [try Timescale Cloud for free][sign-up], no credit card required.

For installation instructions, and help getting your first service up and
running, see the [Timescale Cloud installation section][cloud-install].

<procedure>

## Creating a PostgreSQL service

1.  Sign in to the [Timescale Cloud portal][cloud-console].
1.  Click `Create service`.
1.  In the `Create a service` dialog, under `Choose your service type`, check
    `PostgreSQL`. Complete the other fields according to your environment.
1.  Click `Create service` to build your PostrgeSQL service.

    <img
        class="main-content__illustration"
        src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-create-pgsidecloud.png"
        alt="Create a new PostgreSQL service in the Timescale Cloud portal"
    />

</procedure>

When you return to the Timescale Cloud Services page, your PostgreSQL service is
marked with a PostgreSQL tag, so you can easily distinguish it from your
time-series services:

<img
    class="main-content__illustration"
    src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-view-pgsidecloud.png"
    alt="A running PostgreSQL service in the Timescale Cloud portal"
/>

[cloud-install]: /install/:currentVersion:/installation-cloud/
[sign-up]: https://www.timescale.com/timescale-signup
[cloud-console]: /console.cloud.timescale.com/
