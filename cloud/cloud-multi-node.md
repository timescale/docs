---
title: Multi-node on Timescale Cloud
excerpt: Horizontally scale your database by setting up multi-node on Timescale Cloud
product: cloud
keywords: [multi-node, scaling]
tags: [cluster, distributed hypertables]
---

# Multi-node on Timescale Cloud

If you have a larger workload, you might need more than one TimescaleDB
instance. TimescaleDB multi-node allows you to run and manage multiple
instances, which can give you faster data ingest, and more responsive and
efficient queries for many large workloads.

This section shows you how to use multi-node on Timescale Cloud. You can also
set up multi-node on [self-hosted TimescaleDB][multinode-timescaledb].

<highlight type="important">
Multi-node in Timescale Cloud is an early access feature. If you'd like to use
multi-node, first contact the Timescale customer support team to discuss your
use case. The team can help you understand if multi-node is a good fit for your
needs.

You can contact Support from the Cloud Console by clicking `Support` in the main
menu.
</highlight>

<highlight type="important">
In some cases, your processing speeds could be slower in a multi-node cluster,
because distributed hypertables need to push operations down to the various data
nodes. It is important that you understand multi-node architecture before you
begin, and plan your database according to your specific environment.
</highlight>

For more information about how multi-node works, see the
[multi-node on TimescaleDB][multinode-timescaledb] section.

## Set up multi-node on Timescale Cloud

To create a multi-node cluster, you need an access node that stores metadata
for the distributed hypertable and performs query planning across the cluster,
and any number of data nodes that store subsets of the distributed hypertable
dataset and run queries locally.

Before you begin, make sure you have [signed up][cloud-signup] for your
Timescale Cloud account.

<procedure>

### Setting up multi-node on Timescale Cloud

1.  [Log in to your Timescale Cloud account][cloud-login] and click `Create
    Service`.
1.  Click `Advanced configuration`.
1.  Under `Choose your architecture`, click `Mult-node`.
1.  Our customer support team contacts you. When your request is approved,
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
src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-running-service-multinode.png"
alt="Timescale Cloud running multi-node service"/>

</procedure>

For more information about how multi-node works, see the
[multi-node on TimescaleDB][multinode-timescaledb] section.

[cloud-login]: https://console.cloud.timescale.com/
[cloud-signup]: https://www.timescale.com/timescale-signup
[multinode-timescaledb]: /timescaledb/:currentVersion:/how-to-guides/multinode-timescaledb/
