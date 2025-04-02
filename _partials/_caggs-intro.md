In modern applications, data usually grows very quickly. This means that aggregating 
it into useful summaries can become very slow. $CLOUD_LONG continuous aggregates make
aggregating data lightning fast, accurate, and easy. 

If you are collecting data very frequently, you might want to aggregate your
data into minutes or hours instead. For example, if an IoT device takes 
temperature readings every second, you might want to find the average temperature
for each hour. Every time you run this query, the database needs to scan the
entire table and recalculate the average.

Continuous aggregates are a kind of hypertable that is refreshed automatically
in the background as new data is added, or old data is modified. Changes to your
dataset are tracked, and the hypertable behind the continuous aggregate is
automatically updated in the background.

You don't need to manually refresh your continuous aggregates, they are
continuously and incrementally updated in the background. Continuous aggregates
also have a much lower maintenance burden than regular PostgreSQL materialized
views, because the whole view is not created from scratch on each refresh. This
means that you can get on with working your data instead of maintaining your
database.

Because continuous aggregates are based on hypertables, you can query them in
exactly the same way as your other tables, and enable [compression][compression]
or [tiered storage][data-tiering] on them. You can even
create
[continuous aggregates on top of your continuous aggregates][hierarchical-caggs] - for an even more fine-tuned aggregation. 

By default, querying continuous aggregates provides you with real-time data.
Pre-aggregated data from the materialized view is combined with recent data that
hasn't been aggregated yet. This gives you up-to-date results on every query.

[compression]: /use-timescale/:currentVersion:/compression/about-compression
[data-tiering]: /use-timescale/:currentVersion:/data-tiering/
[hypercore]: /use-timescale/:currentVersion:/hypercore/
[hierarchical-caggs]: /use-timescale/:currentVersion:/continuous-aggregates/hierarchical-continuous-aggregates/
