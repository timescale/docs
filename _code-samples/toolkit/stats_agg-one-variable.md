<!-- markdownlint-disable -->
<!-- vale off -->
# Statistical Aggregates (1D)

## Common 1-D Statistical Functions

*   `average`
*   `sum`
*   `num_vals`
*   `stddev`(population and sample)
*   `variance` (population and sample )
*   `skewness`
*   `kurtosis`

For 2D statistical functions, for example to create a linear regression model,
see [Statistical Aggregates (2D)](./stats_agg_2D.md).

In order to make common statistical aggregates easier to work with in window
functions and continuous aggregates, Toolkit provides common statistical
aggregates in a slightly different form than  otherwise available in
PostgreSQL or TimescaleDB. They are re-implemented within the [two-step aggregates
framework](./two-step_aggregation.md) which exposes a summary form to the
user which can then have multiple accessors.

```SQL, non-transactional
CREATE TABLE foo (
    t timestamptz,
    x DOUBLE PRECISION,
    y DOUBLE PRECISION
);
```

In order to run any of these statistical functions you must first perform the
`stats_agg` aggregate.

<!-- DOCS-DESCRIPTION: Create a one-dimensional statistical aggregate from column `x` in table `foo` -->
```SQL, ignore-output, publish(stats_agg)
SELECT stats_agg(x) FROM foo;
```

As with other aggregates in the Toolkit, you can use any of the accessors on the
results of the aggregation, so:

<!-- DOCS-DESCRIPTION: Calculate the average of column `x` in table `foo` -->
```SQL, ignore-output, publish(average)
SELECT average(
    stats_agg(x)
) FROM foo;
```
