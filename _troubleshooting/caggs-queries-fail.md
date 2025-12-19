---
title: Queries fail when defining continuous aggregates but work on regular tables
section: troubleshooting
products: [cloud, mst, self_hosted]
topics: [continuous aggregates]
apis:
  - [continuous aggregates, CREATE MATERIALIZED VIEW (Continuous Aggregate)]
keywords: [continuous aggregates]
tags: [continuous aggregates, query]
---

import CaggsFunctionSupport from 'versionContent/_partials/_caggs-function-support.mdx';

Continuous aggregates do not work on all queries. For example, $TIMESCALE_DB does not support window functions on 
continuous aggregates. If you use an unsupported function, you see the following error:

```sql
      ERROR:  invalid continuous aggregate view
      SQL state: 0A000
```

<CaggsFunctionSupport />
