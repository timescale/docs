---
title: Distributed hypertables
excerpt: Create and manage distributed hypertables
keywords: [distributed hypertables]
---

# Distributed Hypertables <Tag type="community">Community</Tag>

Distributed hypertables are an extention of regular hypertables, available when
using a [multi-node installation][getting-started-multi-node] of TimescaleDB.
Distributed hypertables provide the ability to store data chunks across multiple
data nodes for better scale-out performance.

Most management APIs used with regular hypertable chunks also work with distributed
hypertables as documented in this section. There are a number of new APIs for
specifically dealing with data nodes and a special API for executing SQL commands
on data nodes.

[getting-started-multi-node]: /timescaledb/:currentVersion:/how-to-guides/multinode-timescaledb/
