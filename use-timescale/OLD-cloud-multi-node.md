---
title: Multi-node
excerpt: Horizontally scale your database by setting up multi-node on Timescale
products: [cloud]
keywords: [multi-node, scaling]
tags: [cluster, distributed hypertables]
---

import EarlyAccess from "versionContent/_partials/_early_access.mdx";

# Multi-node

If you have a larger workload, you might need more than one Timescale
instance. Multi-node can give you faster data ingest, and more responsive and
efficient queries for many large workloads.

This section shows you how to use multi-node on Timescale. You can also
set up multi-node on [self-hosted TimescaleDB][multinode-timescaledb].

<EarlyAccess />

<Highlight type="important">
In some cases, your processing speeds could be slower in a multi-node cluster,
because distributed hypertables need to push operations down to the various data
nodes. It is important that you understand multi-node architecture before you
begin, and plan your database according to your specific environment.
</Highlight>

## Set up multi-node

To create a multi-node cluster, you need an access node that stores metadata
for the distributed hypertable and performs query planning across the cluster,
and any number of data nodes that store subsets of the distributed hypertable
dataset and run queries locally.

<Procedure>

### Setting up multi-node

1.  [Log in to your Timescale account][cloud-login] and click
    `Create Service`.
1.  Click `Advanced configuration`.
1.  Under `Choose your architecture`, click `Multi-node`.
1.  The customer support team contacts you. When your request is approved,
    return to the screen for creating a multi-node service.
1.  Choose your preferred region, or accept the default region of `us-east-1`.
1.  Accept the default for the data nodes, or click `Edit` to choose the number
    of data nodes, and their compute and disk size.
1.  Accept the default for the access node, or click `Edit` to choose the
    compute and disk size.
1.  Click `Create service`. Take a note of the service information, you need
    these details to connect to your multi-node cluster. The service takes a few
    minutes to start up.
1.  When the service is ready, you can see the service in the Service Overview
    page. Click on the name of your new multi-node service to see more
    information, and to make changes.

<img class="main-content__illustration"
src="https://assets.timescale.com/docs/images/tsc-running-service-multinode.png"
alt="Timescale running multi-node service"/>

</Procedure>

[cloud-login]: https://console.cloud.timescale.com/
[multinode-timescaledb]: /self-hosted/:currentVersion:/multinode-timescaledb/
