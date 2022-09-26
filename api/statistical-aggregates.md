---
title: Statistical aggregates
excerpt: Calculate aggregate statistics from a dataset
keywords: [statistics, hyperfunctions, toolkit]
summarizes: [api, hyperfunctions, statistical aggregates]
---

# Statistical aggregates <tag type="toolkit" content="Toolkit" />

This family of hyperfunctions provides SQL commands for common statistical
analyses. It extend the features provided by the [PostgreSQL statistical
aggregates][pg-stats-aggs], making them easier to work with in [window
functions][window-functions] and [continuous aggregates][continuous-aggregates].

It consists of one subfamily of functions, based on the
[`stats_agg`][stats_agg] aggregate.

<hyperfunctionTable
    hyperfunctionFamily='statistical aggregates'
    includeExperimental
    sortByType
/>

[continuous-aggregates]: /timescaledb/:currentVersion:/how-to-guides/continuous-aggregates/
[pg-stats-aggs]: https://www.postgresql.org/docs/current/functions-aggregate.html#FUNCTIONS-AGGREGATE-STATISTICS-TABLE
[stats_agg]: /api/:currentVersion:/hyperfunctions/statistical-aggregates/stats_agg/
[window-functions]: https://www.postgresql.org/docs/current/tutorial-window.html
