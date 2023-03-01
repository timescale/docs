---
title: Gapfilling and interpolation
excerpt: Fill gaps in time-series data
products: [cloud, mst, self_hosted]
keywords: [hyperfunctions, Toolkit, gapfilling, interpolate]
---

# Gapfilling and interpolation

Most time-series data analysis techniques aggregate data into fixed time
intervals, which smooths the data and makes it easier to interpret and analyze.
When you write queries for data in this form, you need an efficient way to
aggregate raw observations, which are often noisy and irregular, in to fixed
time intervals. TimescaleDB does this using time bucketing, which gives a clear
picture of the important data trends using a concise, declarative SQL query.

Sorting data into time buckets works well in most cases, but problems can arise
if there are gaps in the data. This can happen if you have irregular sampling
intervals, or you have experienced an outage of some sort. You can use a
gapfilling function to create additional rows of data in any gaps, ensuring that
the returned rows are in chronological order, and contiguous.

*   For more information about how gapfilling works, read our
    [gapfilling blog][blog-gapfilling].
*   For more information about gapfilling and interpolation API calls, see the
    [hyperfunction API documentation][hyperfunctions-api-gapfilling].

[blog-gapfilling]: https://blog.timescale.com/blog/sql-functions-for-time-series-analysis/
[hyperfunctions-api-gapfilling]: /api/:currentVersion:/hyperfunctions/gapfilling-interpolation/
