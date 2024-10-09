---
title: Distributed hypertables
excerpt: Create and manage distributed hypertables
keywords: [distributed hypertables]
---

import MultiNodeDeprecation from "versionContent/_partials/_multi-node-deprecation.mdx";

<MultiNodeDeprecation />

# Distributed Hypertables <Tag type="community">Community</Tag>

Distributed hypertables are an extension of regular hypertables, available when
using a [multi-node installation][getting-started-multi-node] of TimescaleDB.
Distributed hypertables provide the ability to store data chunks across multiple
data nodes for better scale-out performance.

Most management APIs used with regular hypertable chunks also work with distributed
hypertables as documented in this section. There are a number of APIs for
specifically dealing with data nodes and a special API for executing SQL commands
on data nodes.

[getting-started-multi-node]: /self-hosted/:currentVersion:/multinode-timescaledb/
