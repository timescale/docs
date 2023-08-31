---
title: Create a PostgreSQL service
excerpt: Create a PostgreSQL service in Timescale
products: [cloud]
keywords: [services, PostgreSQL, create, install]
---

import EarlyAccess from "versionContent/_partials/_early_access.mdx";
import UsageBasedStorage from "versionContent/_partials/_usage-based-storage-intro.mdx";

# PostgreSQL services

<EarlyAccess />

Timescale is a hosted, cloud-native Timescale service that allows you to quickly
spin up new Timescale instances. In addition to your Timescale databases, you
can also create services that run standard PostgreSQL, without Timescale's
time-series capabilities.

## Create a PostgreSQL service

You can use PostgreSQL services to store metadata,
business information, customer records, or any other data that is not
time-series. PostgreSQL services are a great option if you're running relational
databases alongside your time-series databases.

<UsageBasedStorage />

When choosing your dynamic compute range, think of your peak compute load, and
provision a plan that has this as the maximum limit. Timescale only ever uses
the minimum compute capacity required for your workload, and if your workload
increases, you are automatically scaled up to your maximum compute capacity.
This means that you are only ever charged for the compute you have actually
used.

<Procedure>

## Creating a PostgreSQL service

1.  Sign in to the [Timescale portal][cloud-console].
1.  Click `Create service`.
1.  On the `Pick your service type` page, click `PostgreSQL`.
1.  Complete the other fields according to your environment.
1.  Click `Create service` to build your PostgreSQL service.

    <img
        class="main-content__illustration"
        src="https://s3.amazonaws.com/assets.timescale.com/docs/images/FIXME.png"
        alt="Create a new PostgreSQL service in the Timescale portal"
    />

</Procedure>

When you return to the Timescale Services page, your PostgreSQL service is
marked with a PostgreSQL tag, so you can easily distinguish it from your
time series services:

<img
    class="main-content__illustration"
    src="https://s3.amazonaws.com/assets.timescale.com/docs/images/FIXME.png"
    alt="A running PostgreSQL service with a running Timescale service in the Timescale portal"
/>

[cloud-console]: https://console.cloud.timescale.com/
