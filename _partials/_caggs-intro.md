Time-series data usually grows very quickly. Large data volumes can become slow
when aggregating the data into useful summaries. To make aggregating data
faster, TimescaleDB uses continuous aggregates.

For example, if you have a table of temperature readings over time in a number
of locations, and you want to find the average temperature in each location, you
can calculate the average as a one-off. If you want to run this query more than
once, the database needs to scan the entire table and recalculate the average
every time. In most cases, though, the data in the table has not changed
significantly, so there is no need to scan the entire dataset. Continuous
aggregates automatically, and in the background, maintain the results from the
query, and allow you to retrieve them in the same way as any other data.

Continuous aggregate views are refreshed automatically in the background as new
data is added, or old data is modified. TimescaleDB tracks these changes to the
dataset, and automatically updates the view in the background. This does not add
any maintenance burden to your database, and does not slow down `INSERT`
operations.

By default, querying continuous aggregates provides you with real-time data.
Pre-aggregated data from the materialized view is combined with recent data that
hasn't been aggregated yet. This gives you up-to-date results on every query.
