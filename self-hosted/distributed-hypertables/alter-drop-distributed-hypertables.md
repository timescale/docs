---
title: Alter and drop distributed hypertables
excerpt: How to alter and drop distributed hypertables
products: [self_hosted]
keywords: [distributed hypertables, alter, delete]
tags: [change, delete]
---

import MultiNodeDeprecation from "versionContent/_partials/_multi-node-deprecation.mdx";

<MultiNodeDeprecation />

# Alter and drop distributed hypertables

You can alter and drop distributed hypertables in the same way as standard
hypertables. To learn more, see:

*   [Altering hypertables][alter]
*   [Dropping hypertables][drop]

When you alter a distributed hypertable, or set privileges on it, the commands
are automatically applied across all data nodes. For more information, see the
section on
[multi-node administration][multinode-admin].

[alter]: /use-timescale/:currentVersion:/hypertables/alter/
[drop]: /use-timescale/:currentVersion:/hypertables/drop/
[multinode-admin]: /self-hosted/latest/multinode-timescaledb/multinode-administration/
