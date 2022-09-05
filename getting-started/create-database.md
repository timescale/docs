---
title: Create a TimescaleDB database
excerpt: Create and connect to a TimescaleDB database
keywords: [databases, create, connect]
---

import Install from "versionContent/_partials/_cloud-installation.mdx";
import CreateService from "versionContent/_partials/_cloud-create-service.mdx";
import Connect from "versionContent/_partials/_cloud-connect.mdx";

# Create a TimescaleDB database

<!-- vale Google.We = NO -->
To work with TimescaleDB, you need a TimescaleDB database. The easiest way to
get started is to use Timescale Cloud, our hosted, cloud-native database
service.
<!-- vale Google.We = YES -->

## Install Timescale Cloud

Install Timescale Cloud by signing up for an account. It's free for thirty days.
It's a cloud service, so you don't need to download anything to your own
machines.

<Install />

<highlight type="note">
Need to self-host your own database? See the other installation options in the
[install section](/install/latest/).
</highlight>

## Create your first service

<CreateService demoData={false} />

## Connect to your service

<Connect />

## Next steps

Now that you have a database and a way of connecting to it, you're ready to
start using TimescaleDB features. In the next section, [learn about
hypertables][gsg-hypertables] and how they improve ingest and query for
time-based data.

[gsg-hypertables]: /getting-started/:currentVersion:/create-hypertable/
