---
title: Configuration recommendations
excerpt: Recommended configuration for Promscale
products: [promscale]
keywords: [analytics]
tags: [install]
---

import PromscaleDeprecation from "versionContent/_partials/_deprecated-promscale.mdx";

# Configuration recommendations

<PromscaleDeprecation />

This section describes the configuration recommendations for Promscale.

## Database configuration

You can use the `timescaledb-tune` tool to set most common parameters to the best
values for your system. The tool accounts for memory, CPU, and PostgreSQL version. For
more information, see [configuration][timescale-tune-configuration]. Additionally,
there are a few other PostgreSQL parameters that you might like to adjust:

*   `checkpoint_timeout=15min` - when a lot of data is ingested, increase the
  checkpoint timeout to reduce the input/output pressure.
*   `bgwriter_delay=10ms` - the background writer needs to be active to reduce
  delays.
*   `bgwriter_lru_maxpages=100000` - increase the number of pages a background
  writer can handle, to make it more efficient.
*   `max_wal_size` - set it to a high enough value so that the checkpoint is triggered
  by the timeout setting, much before the `max_wal_size` is reached.
*   `synchronous_commit=off` - this does not cause data corruption or
  inconsistency. However, in case of a crash, some of the most recent data points could be
  lost. For a monitoring observability use case, it's a reasonable trade-off to
  increase ingest performance.

<Highlight type="important">
Make sure that the maximum latency between the
Promscale connector and the database is no more than 100&nbsp;ms.
</Highlight>

[timescale-tune-configuration]: /timescaledb/:currentVersion:/how-to-guides/configuration/timescaledb-tune/#timescaledb-tuning-tool
