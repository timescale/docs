---
title: Statistical aggregates
excerpt: Calculate aggregate statistics from a dataset
keywords: [statistics, hyperfunctions, toolkit]
---

# Statistical aggregates
This section includes functions related to statistical aggregates.

Some hyperfunctions are included in the default TimescaleDB product. For
additional hyperfunctions, you need to install the
[Timescale Toolkit][install-toolkit] PostgreSQL extension. All of these aggregates 
are in the [Timescale Toolkit][install-toolkit]. They provide a superset of functionality
available with [PostgreSQL statistical aggregates][pg-stats-aggs].

Statistical aggregates have one-dimensional (1D) aggregates which are 
computed for a single variable, and two-dimensional (2D) or regression 
aggregates which are computed over two variables. All 1D aggregates are 
available for each of the 2D variables separately, this is denoted by `_y` 
or `_x` following the name. 

For more information about statistical aggregate functions, see the
[hyperfunctions documentation][hyperfunctions-stats-aggs].

<hyperfunctionTable
    hyperfunctionFamily='statistical aggregates'
    includeExperimental
    sortByType
/>

[hyperfunctions-stats-aggs]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/stats-aggs/
[install-toolkit]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/install-toolkit
[pg-stats-aggs]: https://www.postgresql.org/docs/current/functions-aggregate.html#FUNCTIONS-AGGREGATE-STATISTICS-TABLE
