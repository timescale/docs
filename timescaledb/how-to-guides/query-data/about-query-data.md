---
title: About querying data
excerpt: How to query data in TimescaleDB
keywords: [queries]
---

# About querying data

Querying data in TimescaleDB works just like querying data in PostgreSQL. You
can reuse your existing queries if you're moving from another PostgreSQL
database.

TimescaleDB also provides some additional features to help with data analysis:

- The [`SkipScan`][skipscan] feature speeds up `DISTINCT` queries
- [Hyperfunctions][hyperfunctions] improve the experience of writing many data
  analysis queries
- [Function pipelines][pipelines] bring functional programming to SQL queries,
  making it easier to perform consecutive transformations of data

[hyperfunctions]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/
[pipelines]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/function-pipelines/
[skipscan]: /timescaledb/:currentVersion:/how-to-guides/query-data/skipscan/
