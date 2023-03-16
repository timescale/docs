Hypertables are PostgreSQL tables with special features that make it easy to
work with time-series data. You interact with them just as you would with
regular PostgreSQL tables. But behind the scenes, hypertables automatically
partition your data into chunks by time.

In Timescale, hypertables exist alongside regular PostgreSQL tables. Use
hypertables to store time-series data. This gives you improved insert and query
performance, and access to useful time-series features. Use regular PostgreSQL
tables for other relational data.

With hypertables, Timescale makes it easy to improve insert and query
performance by partitioning time-series data on its time parameter. Behind the
scenes, the database performs the work of setting up and maintaining the
hypertable's partitions. Meanwhile, you insert and query your data as if it all
lives in a single, regular PostgreSQL table.
