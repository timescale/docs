---
title: Create a PostgreSQL service
excerpt: Create a PostgreSQL service in Tiger Cloud
products: [cloud]
keywords: [services, PostgreSQL, create, install]
---

import EarlyAccess from "versionContent/_partials/_early_access_2_18_0.mdx";

# Create a PostgreSQL service

<EarlyAccess />

$CLOUD_LONG is a hosted, cloud-native service that allows you to
quickly spin up new Tiger PostgreSQL. In addition to your $SERVICE_LONGs, you can also create $SERVICE_SHORTs 
run standard PostgreSQL, without $TIMESCALE_DB's time-series capabilities. PostgreSQL services are less expensive to
run than $SERVICE_LONGs, so they are a great option if you're running
relational databases alongside your time-series databases.

You can [try $CLOUD_LONG for free][sign-up], no credit card required.

For installation instructions, and help getting your first service up and
running, see the [Getting Started section][cloud-install].

<Procedure>

## Creating a PostgreSQL service

1.  Sign in to the [$CONSOLE][cloud-console].
1.  Click `Create service`.
1.  In the `Create a service` dialog, click `Advanced configuration`.
1.  In the `Choose your service type` section, check `PostgreSQL`.
1.  Complete the other fields according to your environment.
1.  Click `Create service` to build your PostgreSQL service.

    <img
        class="main-content__illustration"
        src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-create-pgservice.png"
        alt="Create a new PostgreSQL service in the Tiger Cloud"
    />

</Procedure>

When you return to the $SERVICE_SHORT page, your PostgreSQL service is
marked with a PostgreSQL tag, so you can easily distinguish it from your
time-series services:

<img
    class="main-content__illustration"
    src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-view-pgservice.png"
    alt="A running PostgreSQL service with a running Tiger Cloud service in the Tiger Cloud Console"
/>

[cloud-install]: /getting-started/latest/
[sign-up]: http://console.cloud.tigerdata.com/signup
[cloud-console]: https://console.cloud.tigerdata.com/
