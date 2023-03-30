Time-series data usually grows very quickly. And that means that aggregating the
data into useful summaries can become very slow. Continuous aggregates makes
aggregating data lightning fast.

If you are collecting data very frequently, you might want to aggregate your
data into minutes or hours instead. For example, if you have a table of
temperature readings taken every second, you can find the average temperature
for each hour. Every time you run this query, the database needs to scan the
entire table and recalculate the average every time.

Continuous aggregate views are refreshed automatically in the background as new
data is added, or old data is modified. Timescale tracks these changes to the
dataset, and automatically updates the view in the background. This does not add
any maintenance burden to your database, and does not slow down `INSERT`
operations.

By default, querying continuous aggregates provides you with real-time data.
Pre-aggregated data from the materialized view is combined with recent data that
hasn't been aggregated yet. This gives you up-to-date results on every query.
