# Statistical aggregation
To make common statistical aggregates easier to work with in window functions
and continuous aggregates, Timescale Toolkit provides common statistical
aggregates in a slightly different form than otherwise available in PostgreSQL
and TimescaleDB.

This uses a two-step aggregation process. The first step is an aggregation step,
which creates a machine-readable dataset. The second step is an accessor, which
creates a human-readable output for the display of the data.

When you construct a query using this method, you need to start with an
aggregation step, and then provide an accessor. For example, you can use
`time_weight` as the aggregation function, and then `time_weighted_average` as
the accessor:
```sql
SELECT average(time_weight('LOCF', value)) as time_weighted_average FROM <example>;
```

This section is broken up into statistical and regression functions:

Statistical Functions
*   `average`
*   `sum`
*   `num_vals`
*   `stddev` (population and sample)
*   `variance` (population and sample)
*   `skewness`
*   `kurtosis`

Regression Functions
*   `slope`
*   `intercept`
*   `x_intercept`
*   `corr` (correlation coefficient)
*   `covariance` (population and sample)
*   `skewness`
*   `kurtosis`
*   `determination_coeff`
