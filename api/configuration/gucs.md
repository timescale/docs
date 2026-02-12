---
title: Grand Unified Configuration (GUC) parameters
excerpt: Optimize the behavior of TimescaleDB using Grand Unified Configuration (GUC) parameters
keywords: [GUC, Configuration]
---

import TsdbGucsList from "versionContent/_partials/_timescaledb-gucs.mdx";

# Grand Unified Configuration (GUC) parameters

You use the following Grand Unified Configuration (GUC) parameters to optimize the behavior of your $SERVICE_LONG.

The namespace of each GUC is `timescaledb`. 
To set a GUC you specify `<namespace>.<GUC name>`. For example:

```sql
SET timescaledb.enable_tiered_reads = true;
```

<TsdbGucsList />
