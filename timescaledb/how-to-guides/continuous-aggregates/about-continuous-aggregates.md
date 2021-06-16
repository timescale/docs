# Continuous aggregates
One characteristic of time-series data workloads is that the dataset will grow very quickly. Without the proper data infrastructure, these large data volumes can cause slowdowns in primarily two areas: inserting the data into the database, and aggregating the data into summaries which are more useful to analyze.

The first we’ve discussed in detail in our blog posts about the underlying architecture of TimescaleDB: keeping storage and indexing data structures small, and minimizing memory usage, to support high ingest. As for the second, TimescaleDB 1.3 introduces new capabilities to make aggregation simple and easy.

In particular, TimescaleDB 1.3 introduces automated continuous aggregates, which can massively speed up workloads that need to process large amounts of data. In this blog post, we will describe what continuous aggregates are, how they work, and how you can use them to speed up your workloads.

(Special thanks to Gayathri Ayyappan and David Kohn for their work on this feature.)

What are continuous aggregates?
Say you have a table of temperature readings over time in a number of locations:

      time        |      location     |   temperature   
------------------+-------------------+-----------------
2019/01/01 1:00am |      New York     |     68 F       
2019/01/01 1:00am |      Stockholm    |     66 F
2019/01/01 2:00am |      New York     |     70 F
2019/01/01 2:00am |      Stockholm    |     60 F
     ...          |         ...       |     ...
2019/01/02 1:00am |      New York     |     72 F
2019/01/02 1:00am |      Stockholm    |     66 F
     ...          |         ...       |     ...


And you want the average temperature read per-day in each location:

      day         |      location     |  avg temperature   
------------------+-------------------+-----------------
2019/01/01        |      New York     |     73 F       
2019/01/01        |      Stockholm    |     70 F
2019/01/02        |      New York     |     72 F
2019/01/02        |      Stockholm    |     69 F


If you only need this average as a one-off, than you can simply calculate it with a query such as:

SELECT time_bucket(‘1 day’, time) as day,
       location,
       avg(temperature)
FROM temperatures
GROUP BY day, location;


But if you’re going to want to find the average temperature repeatedly, this is wasteful. Every time you perform the SELECT, the database will need to scan the entire table and recalculate the average. But most of the data has not changed, and so re-scanning it is redundant. Alternatively, you could store the full results of the query in another table (or materialized view).  But this quickly becomes unwieldy, because updating this table efficiently is cumbersome and complex.

Continuous aggregates solve this problem: they automatically, and in the background, maintain the results from the query, and allow you to retrieve them as you would any other data. A continuous aggregate looks just like a regular view.

A continuous aggregate for the aforementioned query can be created as easily as:

CREATE VIEW daily_average WITH (timescaledb.continuous)
    AS SELECT time_bucket(‘1 day’, time) as Day,
              location,
              avg(temperature)
       FROM temperatures
       GROUP BY day, location;


And queried just like any other view:

SELECT * FROM daily_average;


That’s it! Unlike a regular view, a continuous aggregate does not perform the average when queried, and unlike a materialized view, it does not need to be refreshed manually. The view will be refreshed automatically in the background as new data is added, or old data is modified. This latter capability is fairly unique to TimescaleDB, which properly tracks when previous data is updated, or delayed data points are backfilled in older time intervals; the continuous aggregate will be automatically recomputed on this older data.  Further, since this is automatic, it doesn’t add any maintenance burden to your database, and since it runs in the background, continuous aggregates do not slow down INSERT operations.

Continuous aggregates work out of the box with a large number of aggregation functions [1], can work with any custom aggregation function as long as it is parallelizable, and you can even use more complex expressions on top of those aggregate functions, e.g., something like max(temperature)-min(temperature).

Continuous aggregates sound great, but how do they work?
At a very high level, a continuous aggregate consists of four parts:

A materialization hypertable: to store the aggregated data in.
A materialization engine: to aggregate data from the raw, underlying, table to the materialization table.
An invalidation engine: to determine when data needs to be re-materialized, due to INSERTs, UPDATEs, or DELETEs within the materialized data.
A query engine: to access the aggregated data.
Of course, all of these parts need to be performant, otherwise Continuous Aggregates wouldn’t be worth using. In this section, we describe these components, and how their design is used to ensure good performance. Due to the way in which they interact with each other, we will go through the components in order: materialization hypertable, query engine, invalidation engine, and materialization engine.

Materialization Table and Data Model
A continuous aggregate takes raw data from the original hypertable, aggregates it, and stores intermediate state in a materialization hypertable. When you query the continuous aggregate view, the state is returned to you as needed.

For our temperature case above, the materialization table would look something like:

    day    |    location   |    chunk   |   avg temperature partial   
-----------+---------------+------------+----------------------------
2019/01/01 |   New York    |      1     |    {3, 219}       
2019/01/01 |   Stockholm   |      1     |    {4, 280}
2019/01/02 |   New York    |      2     |    {3, 216}
2019/01/02 |   Stockholm   |      2     |    {5, 345}



The data stored inside a materialization table consists of a column for each group-by clause in the query, a chunk column identifying the raw-data chunk this data came from, and a partial aggregate representation for each aggregate in the query. A partial is the intermediate form of an aggregation function, and it is what’s used internally to calculate the aggregate’s output. For instance, for avg the partial consists of a {count, sum} pair, representing the number of rows seen, and the sum of all their values.

For our purposes, the key feature of partials is that they can be combined with each other to create new partials spanning all of the old partials’ rows. This property is needed when combining groups that span multiple chunks. It is also key for additional features currently in development: creating aggregates at multiple time granularities and combining aggregates generated in the background with those created live from the raw data. For each query group originating from a given chunk, we will store one row with a partial representation for each aggregate in the query.

The materialization-table itself represents time-series data and is stored as a TimescaleDB hypertable, in order to take advantage of the scaling and query optimizations that hypertables offer over vanilla tables.

Query Engine
When you query the continuous aggregate view, the aggregate partials are combined into a single partial for each time range, and finalized into the value the user receives. In other words, to compute the average temperature, each partial sum is added up to the total sum, each partial count is added up to a total count, then the average is computed by total sum / total count.

In addition to this functionality, we are currently developing a version which always provides up-to-date aggregates by combining partials from the materialization table with partials calculated on-demand from the raw table, when needed.

Invalidation Engine
The Invalidation Engine is one of the core performance-critical pieces of the Continuous Aggregates. Any INSERT, UPDATE, or DELETE to a hypertable which has a continuous aggregate could potentially invalidate some materialized rows, and we need to ensure that the system does not become swamped with invalidations.

Fortunately, our data is time-series data, which has one important implication: nearly all INSERTs and UPDATEs happen near the portion of the data closest to the present. We design our invalidation engine around this assumption. We do not materialize all the way to the last inserted datapoint, but rather to some point behind that, called the materialization threshold.


This threshold is set so that the vast majority of INSERTs will contain timestamps greater than its value. These data points have never been materialized by the continuous aggregate, so there is no additional work needed to notify the continuous aggregate that they have been added. When the materializer next runs, it is responsible for determining how much new data can be materialized without risking the continuous aggregate will be invalidated. Having done this, it will materialize some of the more recent data and move the materialization threshold forward in time. This ensures that the threshold lags behind the point-in-time where data changes are common, and that most INSERTs do not require any extra writes.

When data is changed that lies below the threshold, we log the maximum and minimum timestamps whose rows were edited by the transaction. The materializer uses these values to determine which rows in the aggregation table need to be recalculated. The additional logging for old values does cause some write amplification, but since the materialization threshold lags behind the area of data that is currently changing, such writes are small and rare.

Materialization Engine
Materializing the continuous aggregate is a potentially long-running operation with two important goals: correctness and performance. In terms of correctness, we must ensure that all of our invalidations are logged when needed, and that our continuous aggregates will eventually reflect the latest data changes. On the other hand, materialization can take a long time, and data-modifying transactions must perform well even while the materialization is in progress.

We achieve this by having materialization use two transactions. In a quick first transaction, we block all INSERTs, UPDATEs, and DELETEs, determine the time period we will materialize, and update the invalidation threshold. In the second, other operations are unblocked as we perform the bulk of the work, materializing the aggregates. This ensures that the vast majority of the work does not interfere with other operations.

Why do we block data modification in the first transaction? For our invalidations to work, any data-modifying transaction must either be included in the materialized aggregation or be logged for the next materialization. Blocking data-modifying operations in the first transaction provides a convenient barrier we can use to decide which transactions need to be logged. It divides the transactions into two groups, those that happened before the threshold was updated, and those happened after. Those transactions that came before the threshold update will be included in the materialization and thus never require any additional work, while those that occur after must log their invalidations, and seeing the new threshold inform these transactions that they need to do so.

Using Continuous Aggregates
To test out continuous aggregates, follow our tutorial which uses a sample dataset. Before starting the tutorial, make sure you’ve upgraded to (or installed) TimescaleDB version 1.3.
