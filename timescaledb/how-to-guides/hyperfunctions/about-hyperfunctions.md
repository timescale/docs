# About Timescale hyperfunctions
Timescale hyperfunctions are a specialized set of functions that allow you to to
analyze time-series data. You can use hyperfunctions to analyze anything you
have stored as time-series data, including IoT devices, IT systems, marketing
analytics, user behavior, financial metrics, and cryptocurrency.

Hyperfunctions allow you to perform critical time-series queries quickly,
analyze time-series data, and extract meaningful information. They aim to
identify, build, and combine all of the functionality SQL needs to perform
time-series analysis into a single extension.

Some hyperfunctions are included in the default TimescaleDB product. For
additional hyperfunctions, you need to install the
[Timescale Toolkit][install-toolkit] PostgreSQL extension.

|Hyperfunction family|Types|API Calls|Included by default|Toolkit required|
|-|-|-|-|-|
|Approximate count distincts|Hyperloglog|`hyperloglog`|❌|✅|
|||`rollup`|❌|✅|
|||`distinct_count`|❌|✅|
|||`stderror`|❌|✅|
|Statistical aggregates|Statistical functions|`average`|✅|❌|
|||`stats_agg`|❌|✅|
|||`rollup`|❌|✅|
|||`rolling`|❌|✅|
|||`sum`|✅|❌|
|||`num_vals`|✅|❌|
|||`stddev`|✅|❌|
|||`variance`|✅|❌|
|||`skewness`|✅|❌|
|||`kurtosis`|✅|❌|
||Regression functions|`slope`|✅|❌|
|||`intercept`|✅|❌|
|||`x_intercept`|✅|❌|
|||`corr`|✅|❌|
|||`covariance`|✅|❌|
|||`skewness`|✅|❌|
|||`kurtosis`|✅|❌|
|||`determination_coeff`|✅|❌|
|Gapfilling and interpolation|Time bucket gapfill|`time_bucket_gapfill`|❌|✅|
||Last observation carried forward|`locf`|✅|❌|
|||`interpolate`|✅|❌|
|Percentile approximation|Approximate percentile|`percentile_agg`|❌|✅|
|||`approx_percentile`|❌|✅|
|||`approx_percentile_rank`|❌|✅|
|||`rollup`|❌|✅|
|||`max_val`|✅|❌|
|||`mean`|✅|❌|
|||`error`|✅|❌|
|||`min_val`|✅|❌|
|||`num_vals`|✅|❌|
||Advanced aggregation methods|`uddsketch`|❌|✅|
|||`tdigest`|❌|✅|
|Counter aggregation|Counter aggregates|`counter_agg`|❌|✅|
|||`rollup`|❌|✅|
|||`corr`|✅|❌|
|||`counter_zero_time`|✅|❌|
|||`delta`|✅|❌|
|||`extrapolated_delta`|✅|❌|
|||`extrapolated_rate`|✅|❌|
|||`idelta`|✅|❌|
|||`intercept`|✅|❌|
|||`irate`|✅|❌|
|||`num_changes`|✅|❌|
|||`num_elements`|✅|❌|
|||`num_resets`|✅|❌|
|||`rate`|✅|❌|
|||`slope`|✅|❌|
|||`time_delta`|✅|❌|
|||`with_bounds`|❌|✅|
|Time-weighted averages|Time-weighted averages|`time_weight`|❌|✅|
|||`rollup`|❌|✅|
|||`average`|❌|✅|

For more information about each of the API calls listed in this table, see our [hyperfunction API documentation][api-hyperfunctions].

## Toolkit feature development
Timescale Toolkit features are developed in the open. As features are developed
they are categorized as experimental, beta, stable, or deprecated. This
documentation covers the stable features, but more information on our
experimental features in development can be found in the [Toolkit
repository][gh-docs].

## Contribute to Timescale Toolkit
We want and need your feedback! What are the frustrating parts of analyzing
time-series data? What takes far more code than you feel it should? What runs
slowly, or only runs quickly after many rewrites? We want to solve
community-wide problems and incorporate as much feedback as possible.

*   Join the [discussion][gh-discussions].
*   Check out the [proposed features][gh-proposed].
*   Explore the current [feature requests][gh-requests].
*   Add your own [feature request][gh-newissue].

[api-hyperfunctions]: /api/:currentVersion:/hyperfunctions
[gh-docs]: https://github.com/timescale/timescale-analytics/tree/main/docs
[gh-discussions]: https://github.com/timescale/timescale-analytics/discussions
[gh-proposed]: https://github.com/timescale/timescale-analytics/labels/proposed-feature
[gh-requests]: https://github.com/timescale/timescale-analytics/labels/feature-request
[gh-newissue]: https://github.com/timescale/timescale-analytics/issues/new?assignees=&labels=feature-request&template=feature-request.md&title=
