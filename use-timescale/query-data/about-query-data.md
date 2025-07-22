---
title: About querying data
excerpt: Querying data in TimescaleDB works just like querying data in Postgres, which means you can reuse your existing queries from another Postgres database
products: [cloud, mst, self_hosted]
keywords: [queries]
---

# About querying data

Querying data in $TIMESCALE_DB works just like querying data in $PG. You
can reuse your existing queries if you're moving from another $PG
database.

$TIMESCALE_DB also provides some additional features to help with data analysis:

*   Use [PopSQL][popsql] to work on data with centralized SQL queries, interactive visuals and real-time collaboration
*   The [`SkipScan`][skipscan] feature speeds up `DISTINCT` queries
*   [Hyperfunctions][hyperfunctions] improve the experience of writing many data
    analysis queries
*   [Function pipelines][pipelines] bring functional programming to SQL queries,
    making it easier to perform consecutive transformations of data

[hyperfunctions]: /use-timescale/:currentVersion:/hyperfunctions/
[pipelines]: /use-timescale/:currentVersion:/hyperfunctions/function-pipelines/
[skipscan]: /use-timescale/:currentVersion:/query-data/skipscan/
[popsql]: /getting-started/:currentVersion:/run-queries-from-console/#data-mode
[readreplica]: /use-timescale/:currentVersion:/ha-replicas/read-scaling/
