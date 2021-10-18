# Statistical aggregates
This section includes functions related to statistical aggregates.

Some hyperfunctions are included in the default TimescaleDB product. For
additional hyperfunctions, you need to install the
[Timescale Toolkit][install-toolkit] PostgreSQL extension.

|Hyperfunction family|Types|API Calls|Included by default|Toolkit required|
|-|-|-|-|-|
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

Additionally, this table includes some other common statistical aggregate
functions:

|Function|Description|Argument type|Return type|
|-|-|-|-|
|`corr`|Finds the correlation coefficient|DOUBLEPRECISION|DOUBLEPRECISION|
|`covar_pop`|Finds the population covariance|DOUBLEPRECISION|DOUBLEPRECISION|
|`covar_samp`|Finds the sample covariance|DOUBLEPRECISION|DOUBLEPRECISION|
|`regr_avgx`|Finds the average of the independent variable, sum(X)/N|DOUBLEPRECISION|DOUBLEPRECISION|
|`regr_avgy`|Finds the average of the dependent variable, sum(Y)/N|DOUBLEPRECISION|DOUBLEPRECISION|
|`regr_count`|Finds the number of rows in which both inputs are non-null|DOUBLEPRECISION|BIGINT|
|`regr_intercept`|Finds the y-intercept of the least-squares-fit linear equation determined by the (X, Y) pairs|DOUBLEPRECISION|DOUBLEPRECISION|
|`regr_r2`|Finds the square of the correlation coefficient|DOUBLEPRECISION|DOUBLEPRECISION|
|`regr_slope`|Finds the slope of the least-squares-fit linear equation determined by the (X, Y) pairs|DOUBLEPRECISION|DOUBLEPRECISION|
|`regr_sxx`|Finds the sum of squares of the independent variable, sum(X^2) - sum(X)^2/N|DOUBLEPRECISION|DOUBLEPRECISION|
|`regr_sxy`|Finds the sum of products of independent times dependent variables, sum(X*Y) - sum(X) * sum(Y)/N|DOUBLEPRECISION|DOUBLEPRECISION|
|`regr_syy`|Finds the sum of squares of the dependent variable, sum(Y^2) - sum(Y)^2/N|DOUBLEPRECISION|DOUBLEPRECISION|
|`stddev_pop`|Finds the population standard deviation of the input values|NUMERIC_TYPE|DOUBLEPRECISION or NUMERIC_TYPE|
|`stddev_samp`|Finds the sample standard deviation of the input values|NUMERIC_TYPE|DOUBLEPRECISION or NUMERIC_TYPE|
|`var_pop`|Finds the population variance of the input values (square of the population standard deviation)|NUMERIC_TYPE|DOUBLEPRECISION or NUMERIC_TYPE|
|`var_samp`|Finds the sample variance of the input values (square of the sample standard deviation)|NUMERIC_TYPE|DOUBLEPRECISION or NUMERIC_TYPE|

For more information about statistical aggregate functions, see the
[hyperfunctions documentation][hyperfunctions-stats-agg].

[hyperfunctions-stats-agg]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/stats-aggs/
