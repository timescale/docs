# Continuous aggregates
Continuous aggregates are designed to make queries on very large datasets run
faster. TimescaleDB continuous aggregates use
PostgreSQL [materialized views][postgres-materialized-views] to continuously and
incrementally refresh a query in the background, so that when you run the query,
only the data that has changed needs to be computed, not the entire dataset.

*   [Learn about continuous aggregates][about-caggs] to understand how it works
    before you begin using it.
*   [Create a continuous aggregate][cagg-create].
*   [Add automatic refresh policies][cagg-autorefresh] to an existing continuous aggregate.
*   [Query a continuous aggregate][cagg-query].
*   [Manually refresh][cagg-manual-refresh] a specific range.
*   [Use integer-based time][cagg-integer-time] in your continuous aggregates.
*   [Drop raw data][cagg-drop-raw] from your continuouis aggregates.
*   [Discover useful tips][cagg-best-practice] about continuous aggregates.


[postgres-materialized-views]: https://www.postgresql.org/docs/current/rules-materializedviews.html
[about-caggs]: /how-to-guides/continuous-aggregates/about-continuous-aggregates
[cagg-create]: /how-to-guides/continuous-aggregates/create-a-continuous-aggregate
[cagg-autorefresh]: /how-to-guides/continuous-aggregates/adding-automatic-refresh-policies
[cagg-query]: /how-to-guides/continuous-aggregates/query-a-continuous-aggregate
[cagg-manual-refresh]: /how-to-guides/continuous-aggregates/manually-refresh-specific-ranges
[cagg-integer-time]: /how-to-guides/continuous-aggregates/integer-based-time
[cagg-drop-raw]: /how-to-guides/continuous-aggregates/drop-raw-data
[cagg-best-practice]: /how-to-guides/continuous-aggregates/best-practices
