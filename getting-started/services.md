---
title: Create your first Timescale service
excerpt: Sign up for Timescale and create your first service
products: [cloud]
layout_components: [next_prev_large]
content_group: Getting started
---

import Install from "versionContent/_partials/_cloud-installation.mdx";
import CreateService from "versionContent/_partials/_cloud-create-service.mdx";
import Connect from "versionContent/_partials/_cloud-connect.mdx";
import CloudIntro from "versionContent/_partials/_cloud-intro.mdx";

# Create your first Timescale service

You use Timescale Console to create and manage Timescale services. Each service is a single 100% PostgreSQL database with usage-based storage.

Timescale offers the following PostgreSQL service types:

- [**Time-series and Analytics**](https://www.timescale.com/blog/what-is-a-time-series-database/#what-is-a-time-series-database): a Timescale DB instance optimized for your time-series and analytics workloads.
- **All other workloads**: a [Dynamic PostgreSQL](https://www.timescale.com/dynamic-postgresql) instance with a Dynamic Compute range aligned to your business needs. For this Early Access product, you only pay the base. If your workload demands it, we dynamically scale CPU use between your min and max limits.
  



This section shows you how to create a Timescale service using Timescale Console, then connect to your service using PopSQL or the command line.

<Install />

<Procedure>

### Create a Timescale service

Now that you have an active Timescale account, you can create and manage your services in Timescale Console:

1. In the [service creation page][create-service],
   choose **Time Series and Analytics** or **Dynamic PostgreSQL**.
2. Configure your service, then click **Create service**.
3. In the **Service Information** page:
    1. Click **Download the config** and store your configuration information in a secure location.

       This page contains all you need to connect to your service. Spoiler alert, you need the config page to complete this Get Started process.

    1. Either:
        - Follow the instructions and connect to your service.
        - Click **I stored my password, go to service overview**.

If you choose to go to the service overview, [Check your service and connect to it][connect-to-your-service] shows you how to connect.

</Procedure> 

<Connect />

And that is it, you are up and running. Enjoy developing with Timescale.

[tsc-portal]: https://console.cloud.timescale.com/
[services-how-to]: /use-timescale/:currentVersion:/services/
[install-psql]: /use-timescale/:currentVersion:/integrations/query-admin/psql/
[connect-to-your-service]: /getting-started/:currentVersion:/services/#check-your-service-and-connect-to-it
[create-service]: https://console.cloud.timescale.com/dashboard/create_services
[popsql]: /use-timescale/:currentVersion:/popsql/