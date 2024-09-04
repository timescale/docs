{/* markdownlint-disable */}
{/* vale off */}
# Statistical Aggregates (1D)

## 2-D Statistical Regression Functions

*   `slope`
*   `intercept`
*   `x_intercept`
*   `corr` (correlation coefficient)
*   `covariance` (population  and sample)
*   `skewness`
*   `kurtosis`
*   `determination_coeff`

For 1D statistical functions, see [Statistical Aggregates
(1D)](./stats_agg_1D.md).

In order to make common statistical aggregates easier to work with in window
functions and continuous aggregates, Toolkit provides common statistical
aggregates in a slightly different form than  otherwise available in
PostgreSQL or TimescaleDB. They are re-implemented within the [two-step aggregates
framework](./two-step_aggregation.md) which exposes a summary form to the user
which can then have multiple accessors.

```SQL, non-transactional
CREATE TABLE foo (
    t timestamptz,
    x DOUBLE PRECISION,
    y DOUBLE PRECISION
);
```

In order to run any of these statistical functions you must first perform the
`stats_agg` aggregate with two variables, following the general SQL framework
for these things, when being used for statistical regression with two
dimensions, the dependent variable comes first and the independent variable
second, ie:

{/* DOCS-DESCRIPTION: Create a two-dimensional statistical aggregate from columns `x` and `y` in table `foo` */}
```SQL, ignore-output, publish(stats_agg)
SELECT stats_agg(y, x) FROM foo;
```

You can access single variable statistics by calling the function with `_x` or `_y` like so:

{/* DOCS-DESCRIPTION: Calculate the average of variable `x` from two-dimensional data */}
```SQL, ignore-output, publish(average_x)
SELECT average_x(
    stats_agg(y, x)
) FROM foo;
```

Statistics involving both variables are called normally:

{/* DOCS-DESCRIPTION: Calculate the slope from a two-dimensional statistical aggregate */}
```SQL, ignore-output, publish(slope)
SELECT slope(
    stats_agg(y, x)
) FROM foo;
```

For those statistics which have variants for either the sample or population we have made these accessible via a separate variable ie:

{/* DOCS-DESCRIPTION: Calculate the covariance from a two-dimensional statistical aggregate */}
```SQL, ignore-output, publish(covariance)
SELECT covariance(
    stats_agg(y, x),
    'population'
) FROM foo;
```

The default for all of these is 'population' (the abbreviations 'pop' and 'samp' are also acceptable). The default means the function may also be called without the second argument, like so:

{/* DOCS-DESCRIPTION: Calculate the covariance with an implicit argument of `population` */}
```SQL, ignore-output, publish(covariance)
SELECT covariance(
    stats_agg(y, x)
) FROM foo;
```

Which will still return the population covariance.

This is a minimum working version of the documentation for now, another working
document can be found [here](./rolling_average_api_working.md), which goes
into the window function usecase and some of the reasoning behind our naming
decisions. Please feel free to open issues or discussions if you have questions
or comments on the current API. We will further develop the documentation as we
stabilize these functions over the coming releases.
