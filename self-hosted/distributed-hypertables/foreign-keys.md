---
title: Create foreign keys in a distributed hypertable
excerpt: Add foreign keys to the nodes of a distributed hypertable
products: [self_hosted]
keywords: [distributed hypertable, foreign keys]
tags: [constraints]
---

import MultiNodeDeprecation from "versionContent/_partials/_multi-node-deprecation.mdx";

<MultiNodeDeprecation />

# Create foreign keys in a distributed hypertable

Tables and values referenced by a distributed hypertable must be present on the
access node and all data nodes. To create a foreign key from a distributed
hypertable, use [`distributed_exec`][distributed_exec] to first create the
referenced table on all nodes.

<Procedure>

## Creating foreign keys in a distributed hypertable

1.  Create the referenced table on the access node.
1.  Use [`distributed_exec`][distributed_exec] to create the same table on all
    data nodes and update it with the correct data.
1.  Create a foreign key from your distributed hypertable to your referenced
    table.

</Procedure>

[distributed_exec]: /api/:currentVersion:/distributed-hypertables/distributed_exec/
