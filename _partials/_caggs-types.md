There are three main ways to make aggregation easier: materialized views,
$CAGGs, and $RTAGGs.

[Materialized views][pg-materialized views] are a standard PostgreSQL function.
They are used to cache the result of a complex query so that you can reuse it
later on. Materialized views do not update regularly, although you can manually
refresh them as required.

[$CAGG_CAPs][about-caggs] are a Timescale only feature. They work in
a similar way to a materialized view, but they are updated automatically in the
background, as new data is added to your database. $CAGG_CAPs are
updated continuously and incrementally, which means they are less resource
intensive to maintain than materialized views. $CAGG_CAPs are based
on hypertables, and you can query them in the same way as you do your other
tables.

[$RTAGGs][real-time-aggs] are a Timescale only feature. They are
the same as $CAGGs, but they add the most recent raw data to the
previously aggregated data to provide accurate and up-to-date results, without
needing to aggregate data as it is being written.

[pg-materialized views]: https://www.postgresql.org/docs/current/rules-materializedviews.html
[about-caggs]: /use-timescale/:currentVersion:/continuous-aggregates/about-continuous-aggregates/
[real-time-aggs]: /use-timescale/:currentVersion:/continuous-aggregates/real-time-aggregates/
