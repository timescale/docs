# Create a continuous aggregate

## What are continuous aggregates?

First, let's look at **Aggregates**. Aggregates are summaries of raw data for a period 
of time. Some examples of aggregates include the average stock price per day, the maximum 
CPU utilization per 5 minutes, or the number of visitors on a website per week.

Calculating aggregates on time-series data can be computationally intensive. Such reasons
indlude:
1. Aggregating large amounts of data often require a lot of calulation time. 

2. Ingesting new data requires new aggregation calculations which can affect ingest rate 
and aggregation speed. 

Now, let's look at **Continuous aggregates**. Continuous aggregates are automatically refreshed 
[materialized views][material-view] that massively speed up workloads for large amounts of data. 

**Continuous aggregates solve both the problems above.**

1. For continuous aggregates, the database processes the aggregation calculations upon creation 
and then stores the aggregation results to minimized re-calculation once new raw is added. 

  <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/continuous-aggregate.jpg" alt="Continuous aggregate upon creation"/>

2. With the addition of continuous aggregate refresh policies, you can set up an automatic job 
which only re-calculates new data for specific time periods, thus only recomputing the newest 
changes in the raw data rather then recomuting everything. 

  <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/continuous-aggregate-policy.jpg" alt="Continuous aggregate with refresh policy"/>

For more information on the benefits of continuous aggregates, check out the 
['Overiview' page on 'Continuous aggregates'][cagg-overview].

<highlight type="note">
Materialized view's in PostgreSQL are essentially table-like objects within your database. For more 
information on materialized views, see the [PostgreSQL documentation](https://www.postgresql.org/docs/current/rules-materializedviews.html).
</highlight>

For this tutorial, you will create a continuous aggregate and continuous aggregate 
refresh policy. 
* [Create continuous aggregate][create-cagg-basics]
* [Create continuous aggregate policy][create-cagg-policy]

The full benefits of continuous aggregates cannot be accomplished without both the continuous 
aggregate *and* it's policy. Make sure to follow each section to gain the most value. 


[material-view]: https://www.postgresql.org/docs/current/rules-materializedviews.html
[cagg-overview]: /overview/core-concepts/continuous-aggregates/
[create-cagg-basics]: /getting-started/create-cagg/create-cagg-basics/
[create-cagg-policy]: /getting-started/create-cagg/create-cagg-policy/
