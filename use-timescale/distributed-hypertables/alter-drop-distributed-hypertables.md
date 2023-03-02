---
title: Alter and drop distributed hypertables
excerpt: How to alter and drop distributed hypertables
products: [cloud, mst, self_hosted]
keywords: [distributed hypertables, alter, delete]
tags: [change, delete]
---

# Alter and drop distributed hypertables

You can alter and drop distributed hypertables in the same way as regular
hypertables. To lean more, see:

*   [Altering hypertables][alter]
*   [Dropping hypertables][drop]

<Highlight type="note">
When you alter a distributed hypertable, or set privileges on it, the commands
are automatically applied across all data nodes. For more information, see the
section on [multi-node
administration](/timescaledb/latest/how-to-guides/multinode-timescaledb/multinode-administration/).
</Highlight>

[alter]: /timescaledb/:currentVersion:/how-to-guides/hypertables/alter/
[drop]: /timescaledb/:currentVersion:/how-to-guides/hypertables/drop/
