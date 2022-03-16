# Create a continuous aggregate

## What are continuous aggregates?

Aggregates are summaries of raw data for a period 
of time. Some examples of aggregates include the average stock price per day, the maximum 
CPU utilization per 5 minutes, or the number of visitors on a website per week.

Calculating aggregates on time-series data can be computationally intensive. Reasons include:
1. Aggregating large amounts of data often requires a lot of calulation time. 

2. Ingesting new data requires new aggregation calculations which can affect ingest rate 
and aggregation speed. 

TimescaleDB's continuous aggregates solve both of these problems. Continuous aggregates 
are automatically refreshed [materialized views][material-view]. They massively speed up 
workloads for large amounts of data because:


1. The database processes the aggregation calculations when the aggregate is created. 
It then stores the aggregation results to minimize re-calculation when new raw data is added. 

  <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/continuous-aggregate.jpg" alt="Continuous aggregate upon creation"/>

2. You can set up an automatic continuous aggregate refresh policy. This schedules an automatic job 
that re-calculates new data only for specific time periods. Thus, the policy only recomputes the newest 
changes in the raw data rather then recomputing everything. 

  <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/continuous-aggregate-policy.jpg" alt="Continuous aggregate with refresh policy"/>

For more information on the benefits of continuous aggregates, see the 
['Overview' page on 'Continuous aggregates'][cagg-overview].

<highlight type="note">
Materialized views in PostgreSQL are essentially table-like objects within your database. For more 
information on materialized views, see the [PostgreSQL documentation](https://www.postgresql.org/docs/current/rules-materializedviews.html).
</highlight>

Follow this tutorial to create a continuous aggregate and continuous aggregate 
refresh policy. 
* [Create continuous aggregate][create-cagg-basics]
* [Create continuous aggregate policy][create-cagg-policy]

You only get the full benefits of continuous aggregates by creating both the aggregate itself and
its policy. Follow both sections to add the full value of aggregates to your time-series database.


[material-view]: https://www.postgresql.org/docs/current/rules-materializedviews.html
[cagg-overview]: /overview/core-concepts/continuous-aggregates/
[create-cagg-basics]: /getting-started/create-cagg/create-cagg-basics/
[create-cagg-policy]: /getting-started/create-cagg/create-cagg-policy/
