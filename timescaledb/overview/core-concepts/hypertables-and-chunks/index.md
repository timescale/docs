# Hypertables
Hypertables are PostgreSQL tables with special features that make it easy to
handle time-series data. Anything you can do with a regular PostgreSQL table,
you can do with a hypertable. In addition, you get the benefits of improved
performance and user experience for time-series data.

With hypertables, TimescaleDB makes it easy to [improve insert and query
performance][performance-benchmark] by partitioning time-series data on its time
parameter. Behind the scenes, the database performs the work of setting up and
maintaining the hypertable's partitions. Meanwhile, you insert and query your
data as if it all lives in a single, regular PostgreSQL table.

A hypertable's behind-the-scenes partitions, called chunks, also make other
features of TimescaleDB possible. These include continuous aggregates,
compression, retention policies, and more.

Learn more about:
*   The [benefits of hypertables][hypertable-benefits] for handling time-series
    data
*   [Hypertable architecture][hypertable-architecture], and how hypertables and
    chunks work behind the scenes
*   [How to work with hypertables][hypertable-how-to]

## Hypertables compared to partitioning in regular PostgreSQL
If you use regular PostgreSQL, you can also partition your time-series data by
writing the partitioning logic yourself. But handling child tables, constraints,
chunk indexes, and other details gets complex. And that's before you get into
more advanced features such as compression, continuous aggregates, and retention
policies.

TimescaleDB handles all this for you so you can focus on your application.

## When to use a hypertable in TimescaleDB
You can have both hypertables and regular PostgreSQL tables in the same
database. Choose a hypertable for time-series data, and choose a regular
PostgreSQL table for relational data.

For example, you might have:
*   A hypertable to record sensor readings over time, and a regular table
    to record sensor location and other metadata
*   A hypertable to record stock asset prices over time, and a regular table to
    record ticker symbols and names for each asset
*   A hypertable to record truck GPS coordinates over time, and a regular table
    to record the make, model, and age of each truck

[hypertable-architecture]: /overview/core-concepts/hypertables-and-chunks/hypertable-architecture/
[hypertable-benefits]: /overview/core-concepts/hypertables-and-chunks/hypertables-and-chunks-benefits/
[hypertable-how-to]: /how-to-guides/hypertables/
[performance-benchmark]: https://www.timescale.com/blog/timescaledb-vs-6a696248104e/
