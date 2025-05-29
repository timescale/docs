---
title: Alter and drop distributed hypertables
excerpt: Sunsetted v2.14.x. Alter and drop distributed hypertables in your self-hosted TimescaleDB installation
keywords: [distributed hypertables, alter, delete]
tags: [change, delete]
seo:
  robots: noindex
---

import MultiNodeDeprecation from "versionContent/partials/_multi-node-deprecation.mdx";

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

[alter]: /use-timescale/:currentVersion:/hypertables/hypertable-crud/#alter-a-hypertable
[drop]: /use-timescale/:currentVersion:/hypertables/hypertable-crud/#drop-a-hypertable
[multinode-admin]: /self-hosted/latest/multinode-timescaledb/multinode-administration/
