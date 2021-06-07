# FAQs - About time-series databases

## Why is time-series data important?
At Timescale, we are dedicated to serving developers worldwide, enabling
them to build exceptional data-driven products that measure everything that
matters: software applications, industrial equipment, financial markets,
blockchain activity, consumer behavior, machine learning models, climate
change, and more. Analyzing this data across the time dimension
("time-series data") enables developers to understand what is happening
right now, how that is changing, and why that is changing.

This might be measuring the temperature and humidity of soil, to help
farmers combat climate change. Or measuring flight data to predict
landing and arrival times for airlines and travelers. Or tracking every
action that a user takes in an application, and the performance of the
infrastructure underlying that application, to help resolve support
issues and increase customer happiness. But these are just a few of
the thousands of different ways developers are using time-series data
to measure everything that matters today.

## Why build another time-series database?
Time-series data is cropping up in more and more places: monitoring and DevOps,
sensor data and IoT, financial data, logistics data, app usage data, and more.
Often this data is high in volume and complex in nature (e.g., multiple
measurements and labels associated with a single time). This means that storing
time-series data demands both scale and efficient complex queries. Yet achieving
both of these properties has remained elusive. Users have typically been faced
with the trade-off between the horizontally scalability of NoSQL and the query
power of relational databases. We needed something that offered both, so we
built it.


[api]: /api/:currentVersion:/
[why-sql]: https://www.timescale.com/blog/why-sql-beating-nosql-what-this-means-for-future-of-data-time-series-database-348b777b847a
[new-queries]: /how-to-guides/query-data/advanced-analytic-queries/
[INSERT]: /how-to-guides/write-data/insert/
[SELECT]: /how-to-guides/query-data/select/
[rdbms > nosql]: http://www.timescale.com/blog/time-series-data-why-and-how-to-use-a-relational-database-instead-of-nosql-d0cd6975e87c
[benchmarks]: https://blog.timescale.com/blog/timescaledb-2-0-a-multi-node-petabyte-scale-completely-free-relational-database-for-time-series/
[distributed-hypertable]: /timescaledb/:currentProduct:/how-to-guides/distributed-hypertables
[docs-architecture]: /overview/core-concepts/hypertables-and-chunks/
[hypertable-best-practices]: /how-to-guides/hypertables/best-practices/
[PostgreSQL-benchmark]: https://www.timescale.com/blog/timescaledb-vs-6a696248104e
[PostgreSQL-problems-time-series]: https://www.timescale.com/blog/time-series-data-postgresql-10-vs-timescaledb-816ee808bac5
[time_bucket]: /api/:currentVersion:/analytics/time_bucket/
[first]: /api/:currentVersion:/analytics/first/
[last]: /api/:currentVersion:/analytics/last/
[data-retention]: /how-to-guides/data-retention/
[postgis]: /tutorials/nyc-taxi-cab
[GitHub]: https://github.com/timescale/timescaledb/issues
[contact]: https://www.timescale.com/contact
[join_slack]: https://slack.timescale.com/
[install]: /how-to-guides/install-timescaledb/
[update]: /how-to-guides/update-timescaledb/
[compression-docs]: /how-to-guides/compression/
[compression-blog]: https://blog.timescale.com/blog/building-columnar-compression-in-a-row-oriented-database/
[timescale-license]: https://www.timescale.com/legal/licenses
[timescale-k8s]: https://github.com/timescale/timescaledb-kubernetes
[timescale-signup]: https://www.timescale.com/timescale-signup
[timescale-support]: https://www.timescale.com/support
