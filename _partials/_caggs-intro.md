Time-series data usually grows very quickly. And that means that aggregating the
data into useful summaries can become very slow. $CAGG_CAPs make
aggregating data lightning fast.

If you are collecting data very frequently, you might want to aggregate your
data into minutes or hours instead. For example, if you have a table of
temperature readings taken every second, you can find the average temperature
for each hour. Every time you run this query, the database needs to scan the
entire table and recalculate the average every time.

$CAGG_CAPs are a kind of $HYPERTABLE that is refreshed automatically
in the background as new data is added, or old data is modified. Changes to your
dataset are tracked, and the $HYPERTABLE behind the $CAGG is
automatically updated in the background.

You don't need to manually refresh your $CAGGs, they are
continuously and incrementally updated in the background. They also have a much lower maintenance burden than regular PostgreSQL materialized
views, because the whole view is not created from scratch on each refresh. This
means that you can get on with working your data instead of maintaining your
database.

Because $CAGGs are based on $HYPERTABLEs, you can query them in
exactly the same way as your other tables, and enable [compression][compression]
or [tiered storage][data-tiering] on your $CAGGs. You can even
create [$CAGGs on top of your $CAGGs][hierarchical-caggs].

By default, querying $CAGGs provides you with real-time data.
Pre-aggregated data from the materialized view is combined with recent data that
hasn't been aggregated yet. This gives you up-to-date results on every query.

[data-tiering]: /use-timescale/:currentVersion:/data-tiering/
[compression]: /use-timescale/:currentVersion:/compression/
[hierarchical-caggs]: /use-timescale/:currentVersion:/continuous-aggregates/hierarchical-continuous-aggregates/
