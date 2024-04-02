---
title: About querying data
excerpt: How to query data in Timescale
products: [cloud, mst, self_hosted]
keywords: [queries]
---

# About querying data

Querying data in Timescale works just like querying data in PostgreSQL. You
can reuse your existing queries if you're moving from another PostgreSQL
database.

Timescale also provides some additional features to help with data analysis:

* Use [PopSQL][popsql] to work on data with centralized SQL queries, interactive visuals and real-time collaboration
*   The [`SkipScan`][skipscan] feature speeds up `DISTINCT` queries
*   [Hyperfunctions][hyperfunctions] improve the experience of writing many data
    analysis queries
*   [Function pipelines][pipelines] bring functional programming to SQL queries,
    making it easier to perform consecutive transformations of data

[hyperfunctions]: /use-timescale/:currentVersion:/hyperfunctions/
[pipelines]: /use-timescale/:currentVersion:/hyperfunctions/function-pipelines/
[skipscan]: /use-timescale/:currentVersion:/query-data/skipscan/
[popsql]: /use-timescale/:currentVersion:/popsql/