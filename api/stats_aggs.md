# Statistical aggregates
This section includes functions related to statistical aggregates.

Some hyperfunctions are included in the default TimescaleDB product. For
additional hyperfunctions, you need to install the
[Timescale Toolkit][install-toolkit] PostgreSQL extension, all of these aggregates 
are in the [Timescale Toolkit][install-toolkit]. They provide a superset of functionality
available with [PostgreSQL statistical aggregates][pg-stats-aggs

Note that statistical aggregates have 1D aggregates which are computed for a single variable
and 2D or regression aggregates which are computed over two variables. All 1D aggregates are available
for each of the 2D variables separately, this is denoted by `_y` or `_x` following the name. 
For more information about statistical aggregate functions, see the
[hyperfunctions documentation][hyperfunctions-stats-aggs].


|Hyperfunction family|Types|API Calls|Included by default|Toolkit required|
|-|-|-|-|-|
|Statsistical Aggregates|Statistical Aggregates|[`stats_agg`](/hyperfunctions/stats_aggs/stats_agg/)|❌|✅|
|||[`rollup`](/hyperfunctions/stats_aggs/rollup-stats/)|❌|✅|
|||[`rolling`](/hyperfunctions/stats_aggs/rolling-stats/)|❌|✅|
|Statistical aggregation|Stats Agg 1D Accessors|[`average` / `average_y` / `average_x`](/hyperfunctions/stats_aggs/average-stats/)|✅|❌|
|||[`kurtosis` / `kurtosis_y` / `kurtosis_x`](/hyperfunctions/stats_aggs/kurtosis/)|✅|❌|
|||[`num_vals`](/hyperfunctions/stats_aggs/num_vals-stats/)|✅|❌|
|||[`skewness` / `skewness_y` / `skewness_x`](/hyperfunctions/stats_aggs/skewness/)|✅|❌|
|||[`stddev` / `stddev_y` / `stddev_x`](/hyperfunctions/stats_aggs/stddev/)|✅|❌|
|||[`sum` / `sum_y` / `sum_x`](/hyperfunctions/stats_aggs/sum/)|✅|❌|
|||[`variance` / `variance_y` / `variance_x`](/hyperfunctions/stats_aggs/variance/)|✅|❌|
|Statistical aggregation|Stats Agg 2D Accessors|[`corr`](/hyperfunctions/stats_aggs/corr-stats/)|✅|❌|
|||[`covariance`](/hyperfunctions/stats_agg/covariance/)|✅|❌|
|||[`determination_coeff`](/hyperfunctions/stats_agg/determination_coeff/)|✅|❌|
|||[`intercept`](/hyperfunctions/stats_agg/intercept/)|✅|❌|
|||[`slope`](/hyperfunctions/stats_agg/slope-stats/)|✅|❌|
|||[`x_intercept`](/hyperfunctions/stats_agg/x_intercept/)|✅|❌|



[hyperfunctions-stats-aggs]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/stats-aggs/
[install-toolkit]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/install-toolkit
[pg-stats-aggs]: https://www.postgresql.org/docs/current/functions-aggregate.html#FUNCTIONS-AGGREGATE-STATISTICS-TABLE