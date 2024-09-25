---
title: Create your first Timescale Cloud service
excerpt: Sign up for Timescale and create your first service
products: [cloud]
layout_components: [next_prev_large]
content_group: Getting started
---

import GetStartedTimescaleConsole from "versionContent/_partials/_get-started-timescale-console.mdx";
import GetStartedTimescaleCli from "versionContent/_partials/_get-started-timescale-cli.mdx";

# Create your first Timescale Cloud service

Timescale Cloud is a cloud-based PostgreSQL platform for resource-intensive workloads that offers the following 
PostgreSQL optimized database services:

- **Time-series**: a Timescale DB instance optimized for your
  [time-series and analytics][what-is-time-series] workloads.
- **AI and Vector**: for apps that require fast search on [vector embeddings and metadata](https://docs.timescale.com/ai/latest/), 
  like semantic search, image search, RAG and Agents.
- **Dynamic PostgreSQL**: for all other workloads. A PostgreSQL instance with a
  [dynamic compute range][what-is-dynamic-postgres] aligned to your business needs.

Each service is a single 100% PostgreSQL database with [usage-based storage][how-plans-work]. This section shows you 
how to use the `Timescale Console` Web app or the `timescale-cli` command line app to create a service and add a hypertable
to it.

<Tabs label="Get started with Timescale Cloud">

<Tab title="Timescale Console">

<GetStartedTimescaleConsole />


</Tab>
<Tab title="timescale-cli">

<GetStartedTimescaleCli />

</Tab>

</Tabs>


And that is it, you are up and running. Enjoy developing with Timescale.

[tsc-portal]: https://console.cloud.timescale.com/
[services-how-to]: /use-timescale/:currentVersion:/services/
[install-psql]: /use-timescale/:currentVersion:/integrations/query-admin/psql/
[connect-to-your-service]: /getting-started/:currentVersion:/services/#connect-to-your-service
[create-service]: https://console.cloud.timescale.com/dashboard/create_services
[what-is-time-series]: https://www.timescale.com/blog/what-is-a-time-series-database/#what-is-a-time-series-database
[what-is-dynamic-postgres]: https://www.timescale.com/dynamic-postgresql
[how-plans-work]: /about/:currentVersion:/pricing-and-account-management/#how-plans-work
