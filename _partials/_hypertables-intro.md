Hypertables are PostgreSQL tables with special features that make it easy to
work with time-series data. You interact with them just as you would with
regular PostgreSQL tables. But behind the scenes, hypertables automatically
partition your data into chunks by time.

In TimescaleDB, hypertables exist alongside regular PostgreSQL tables. Use
hypertables to store time-series data. This gives you improved insert and query
performance, and access to useful time-series features. Use regular PostgreSQL
tables for other relational data.
