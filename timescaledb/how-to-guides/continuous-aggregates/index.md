# Continuous aggregates
Continuous aggregates are designed to make queries on very large datasets run
faster. TimescaleDB continuous aggregates use
PostgreSQL [materialized views][postgres-materialized-views] to continuously and
incrementally refresh a query in the background, so that when you run the query,
only the data that has changed needs to be computed, not the entire dataset.

*   [Learn about continuous aggregates][about-caggs] to understand how it works
    before you begin using it.
*   [Create a continuous aggregate][cagg-create] and query it.
*   [Add refresh policies][cagg-autorefresh] to an existing continuous aggregate.
*   [Manage time][cagg-time] in your continuous aggregates.
*   [Drop data][cagg-drop] from your continuous aggregates.
*   [Manage materialized hypertables][cagg-mat-hypertables].
*   [Use real-time aggregates][cagg-realtime].
*   [Troubleshoot][cagg-tshoot] continuous aggregates.


[postgres-materialized-views]: https://www.postgresql.org/docs/current/rules-materializedviews.html
[about-caggs]: /how-to-guides/continuous-aggregates/about-continuous-aggregates
[cagg-create]: /how-to-guides/continuous-aggregates/create-a-continuous-aggregate
[cagg-autorefresh]: /how-to-guides/continuous-aggregates/refresh-policies
[cagg-time]: /how-to-guides/continuous-aggregates/time
[cagg-drop]: /how-to-guides/continuous-aggregates/drop-data
[cagg-mat-hypertables]: /how-to-guides/continuous-aggregates/materialized-hypertables
[cagg-realtime]: /how-to-guides/continuous-aggregates/real-time-aggregates
[cagg-tshoot]: /how-to-guides/continuous-aggregates/troubleshooting
