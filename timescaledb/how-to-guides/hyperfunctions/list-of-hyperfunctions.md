# List of hyperfunctions
Many hyperfunctions are available in TimescaleDB. If you're using Timescale
Cloud, all hyperfunctions are included by default. If you're using Managed
Service for TimescaleDB or self-hosted TimescaleDB, only some hyperfunctions are
included by default. You can access all the hyperfunctions by
[installing the Timescale Toolkit extension][install-toolkit].

|Hyperfunction family|Types|API Calls|Included by default|Toolkit required|
|-|-|-|-|-|
|Approximate count distincts|Hyperloglog|`hyperloglog`|❌|✅|
|||`rollup`|❌|✅|
|||`distinct_count`|❌|✅|
|||`stderror`|❌|✅|
|Statistical aggregates|Statistical functions|`average`|❌|✅|
|||`stats_agg`|❌|✅|
|||`rollup`|❌|✅|
|||`rolling`|❌|✅|
|||`sum`|❌|✅|
|||`num_vals`|❌|✅|
|||`stddev`|❌|✅|
|||`variance`|❌|✅|
|||`skewness`|❌|✅|
|||`kurtosis`|❌|✅|
||Regression functions|`slope`|❌|✅|
|||`intercept`|❌|✅|
|||`x_intercept`|❌|✅|
|||`corr`|❌|✅|
|||`covariance`|❌|✅|
|||`skewness`|❌|✅|
|||`kurtosis`|❌|✅|
|||`determination_coeff`|❌|✅|
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
|||`corr`|❌|✅|
|||`counter_zero_time`|❌|✅|
|||`delta`|❌|✅|
|||`extrapolated_delta`|❌|✅|
|||`extrapolated_rate`|❌|✅|
|||`idelta`|❌|✅|
|||`intercept`|❌|✅|
|||`irate`|❌|✅|
|||`num_changes`|❌|✅|
|||`num_elements`|❌|✅|
|||`num_resets`|❌|✅|
|||`rate`|❌|✅|
|||`slope`|❌|✅|
|||`time_delta`|❌|✅|
|||`with_bounds`|❌|✅|
|Time-weighted averages|Time-weighted averages|`time_weight`|❌|✅|
|||`rollup`|❌|✅|
|||`average`|❌|✅|

For more information about the API calls listed in this table, see the
[hyperfunction API documentation][api-hyperfunctions].

[api-hyperfunctions]: /api/:currentVersion:/hyperfunctions
[install-toolkit]: /how-to-guides/hyperfunctions/install-toolkit