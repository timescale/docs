# Continuous aggregates

Aggregate queries which touch large swathes of time-series data can
take a long time to compute because the system needs to scan large
amounts of data on every query execution. To make such queries faster,
a continuous aggregate allows materializing the computed aggregates,
while also providing means to continuously, and with low overhead,
keep them up-to-date as the underlying source data changes.

Continuous aggregates are somewhat similar to PostgreSQL's
[materialized views][postgres-materialized-views], but, unlike a
materialized view, a continuous aggregate can be continuously and
incrementally refreshed. The refreshing can be done either manually or
via a policy that runs in the background, and can cover the entire
continuous aggregate or just a specific time range. In either case,
the refresh only recomputes the aggregate buckets that have changed
since the last refresh.

[postgres-materialized-views]: https://www.postgresql.org/docs/current/rules-materializedviews.html
