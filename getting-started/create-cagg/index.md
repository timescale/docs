---
title: Create a continuous aggregate
excerpt: Learn how to speed up queries with continuous aggregates
keywords: [continuous aggregates, create]
---

# Create a continuous aggregate
Aggregates are summaries of raw data for a period of time. Some examples of
aggregates include the average stock price per day, the maximum CPU utilization
per 5 minutes, or the number of visitors on a website per week.

Calculating aggregates on time-series data can be computationally intensive.
There are a few different reasons for this:

1.  Aggregating large amounts of data often requires a lot of calculation time.
1.  Ingesting new data requires new aggregation calculations which can affect
    ingest rate and aggregation speed.

TimescaleDB's continuous aggregates solve both of these problems. Continuous
aggregates are automatically refreshed [materialized views][material-view] that
speed up query workloads for large amounts of data. They solve some of the main
pain points with materialized views and home-grown aggregate solutions in a
couple of ways.

First, TimescaleDB processes the aggregation calculations when the aggregate is
created
and then stores the aggregation results to minimize re-calculation when new raw data is added.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/continuous-aggregate.jpg" alt="Continuous aggregate upon creation"/>

Second, TimescaleDB provides ongoing updates to continuous aggregate data with
an automatic continuous aggregate refresh policy. This schedules an automatic
job that re-calculates new data for a specific interval of time. Thus, the
policy only recomputes the newest changes in the raw data rather then
recomputing everything.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/continuous-aggregate-policy.jpg" alt="Continuous aggregate with refresh policy"/>

For more information on the benefits of continuous aggregates, see the
[Overview page on Continuous aggregates][cagg-overview].

<highlight type="note"> Materialized views in PostgreSQL are table-like objects
within your database. For more information on materialized views, see the
[PostgreSQL documentation](https://www.postgresql.org/docs/current/rules-materializedviews.html).
</highlight>

Follow this tutorial to create a continuous aggregate and continuous aggregate
refresh policy:

* [Create continuous aggregate][create-cagg-basics]
* [Create continuous aggregate policy][create-cagg-policy]

You only get the full benefits of continuous aggregates by creating both the
aggregate itself and its policy. Follow both sections to add the full value of
aggregates to your time-series database.

[material-view]: https://www.postgresql.org/docs/current/rules-materializedviews.html
[cagg-overview]: /timescaledb/:currentVersion:/overview/core-concepts/continuous-aggregates/
[create-cagg-basics]: /create-cagg/create-cagg-basics/
[create-cagg-policy]: /create-cagg/create-cagg-policy/
