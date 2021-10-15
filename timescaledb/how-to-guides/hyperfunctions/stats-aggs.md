# Statistical aggregation
To make common statistical aggregates easier to work with in window functions
and continuous aggregates, Timescale Toolkit provides common statistical
aggregates in a slightly different form than otherwise available in PostgreSQL
and TimescaleDB. This uses a two-step aggregation process. The first step is an
aggregation step, which creates a machine-readable dataset. The second step is
an accessor, which creates a human-readable output for the display of the data.

For example, a typical Timescale Toolkit query to get the time-weighted
average of a set of values could look like this: ```sql SELECT
average(time_weight('LOCF', value)) as time_weighted_average FROM foo; ```

The first step in this query is to call the inner aggregate function, such as
`time_weighted_average`. The second step is to call the accessor function, such
as `average`.

This makes it easier to construct your queries, because it distinguishes the
parameters, and makes it clear which aggregates are being re-aggregated or
stacked. Additionally, because this query syntax is used in all Timescale
Toolkit queries, when you are used to it, you can use it to construct more and
more complicated queries.


For more information about statistical aggregation API calls, see the [hyperfunction API documentation][hyperfunctions-api-stats-agg].


[hyperfunctions-api-stats-agg]: /api/:currentVersion:/hyperfunctions/stats_aggs/
