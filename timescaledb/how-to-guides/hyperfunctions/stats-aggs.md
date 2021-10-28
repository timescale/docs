# Statistical aggregation
To make common statistical aggregates easier to work with in window functions
and continuous aggregates, TimescaleDB provides common statistical aggregates in
a slightly different form than otherwise available in PostgreSQL and
TimescaleDB.

<!--- Add an example here. --LKB 2021-10-18 --->

This uses a two-step aggregation process. The first step is an aggregation step,
which creates a machine-readable dataset. The second step is an accessor, which
creates a human-readable output for the display of the data. This makes it
easier to construct your queries, because it distinguishes the parameters, and
makes it clear which aggregates are being re-aggregated or stacked.
Additionally, because this query syntax is used in all Timescale Toolkit
queries, when you are used to it, you can use it to construct more and more
complicated queries.

*   For some more technical details and usage examples of the two-step
    aggregation method, see the [developer documentation][gh-two-step-agg].
*   For more information about statistical aggregation API calls, see the
    [hyperfunction API documentation][hyperfunctions-api-stats-agg].


[gh-two-step-agg]: https://github.com/timescale/timescaledb-toolkit/blob/main/docs/two-step_aggregation.md
[hyperfunctions-api-stats-agg]: /api/:currentVersion:/hyperfunctions/stats_aggs/
