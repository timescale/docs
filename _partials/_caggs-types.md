While continuous aggregates are built on PostgreSQL materialized views, there
are some important differences:

[Materialized views][pg-materialized views] are a standard PostgreSQL function.
They are used to cache the result of a complex query so that you can reuse it
later on. Materialized views do not update regularly, although you can manually
refresh them as required.

[Continuous aggregates][about-caggs] are a Timescale only feature. They work in
a similar way to a materialized view, but they are updated automatically in the
background, as new data is added to your database. Continuous aggregates are
updated continuously and incrementally, which means they are less resource
intensive to maintain than materialized views. Continuous aggregates are based
on hypertables, and you can query them in the same way as you do your other
tables.

[pg-materialized views]: https://www.postgresql.org/docs/current/rules-materializedviews.html
[about-caggs]: /use-timescale/:currentVersion:/continuous-aggregates/about-continuous-aggregates/
