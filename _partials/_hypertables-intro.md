$CLOUD_LONG supercharges your real-time analytics by letting you run complex queries continuously, with near-zero latency. Under the hood, this is achieved by using hypertables - PostgreSQL tables that automatically partition your time-series data by time and optionally by space. When you run a query, $CLOUD_LONG identifies the correct partition and runs the query on it, instead of going through the entire table. 

Hypertables offer a range of other features, such as [skipping partitions][chunk-skipping] or running [hyperfunctions][hyperfunctions], that boost the performance of your analytical queries even more.

To top it all, there is no added complexity - you interact with hypertables in the same way as you would with regular PostgreSQL tables. All the optimization magic happens behind the scenes.

[chunk-skipping]: /use-timescale/:currentVersion:/hypertables/improve-query-performance/
[hyperfunctions]: /use-timescale/:currentVersion:/hyperfunctions/




