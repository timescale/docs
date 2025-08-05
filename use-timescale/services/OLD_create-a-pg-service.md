---
title: Create a Postgres service
excerpt: Create a Postgres service in Tiger Cloud
products: [cloud]
keywords: [services, Postgres, create, install]
---

import EarlyAccess from "versionContent/_partials/_early_access_2_18_0.mdx";

# Create a $PG service

<EarlyAccess />

$CLOUD_LONG is a hosted, cloud-native service that allows you to
quickly spin up new Tiger $PG. In addition to your $SERVICE_LONGs, you can also create $SERVICE_SHORTs 
run standard $PG, without $TIMESCALE_DB's time-series capabilities. $PG services are less expensive to
run than $SERVICE_LONGs, so they are a great option if you're running
relational databases alongside your time-series databases.

You can [try $CLOUD_LONG for free][sign-up], no credit card required.

For installation instructions, and help getting your first service up and
running, see the [Getting Started section][cloud-install].

<Procedure>

## Creating a $PG service

1.  Sign in to the [$CONSOLE][cloud-console].
1.  Click `Create service`.
1.  In the `Create a service` dialog, click `Advanced configuration`.
1.  In the `Choose your service type` section, check `PostgreSQL`.
1.  Complete the other fields according to your environment.
1.  Click `Create service` to build your $PG service.

    <img
        class="main-content__illustration"
        src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-create-pgservice.png"
        alt="Create a new Postgres service in the Tiger Cloud"
    />

</Procedure>

When you return to the $SERVICE_SHORT page, your $PG service is
marked with a $PG tag, so you can easily distinguish it from your
time-series services:

<img
    class="main-content__illustration"
    src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-view-pgservice.png"
    alt="A running Postgres service with a running Tiger Cloud service in the Tiger Cloud Console"
/>

[cloud-install]: /getting-started/latest/
[sign-up]: http://console.cloud.timescale.com/signup
[cloud-console]: https://console.cloud.timescale.com/
