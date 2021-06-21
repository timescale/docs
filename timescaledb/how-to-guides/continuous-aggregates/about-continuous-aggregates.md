# Continuous aggregates
Time-series data usually grows very quickly. Large data volumes can become slow when aggregating the data into useful summaries. To make aggregating data faster, TimescaleDB uses continuous aggregates.

For example, if you have a table of temperature readings over time in a number of locations, and you want to find the average temperature in each location, you can calculate the average as a one-off, with a query like this:

```sql
SELECT time_bucket(‘1 day’, time) as day,
       location,
       avg(temperature)
FROM temperatures
GROUP BY day, location;
```

If you want to run this query more than once, the database will need to scan the entire table and recalculate the average every time. In most cases, though, the data in the table will not have changed significantly, so there is no need to scan the entire dataset. Continuous aggregates automatically, and in the background, maintain the results from the query, and allow you to retrieve them in the same way as any other data.

Using the same temperature example, you can create the same query as a continuous aggregate view like this:

```sql
CREATE VIEW daily_average WITH (timescaledb.continuous)
    AS SELECT time_bucket(‘1 day’, time) as Day,
              location,
              avg(temperature)
       FROM temperatures
       GROUP BY day, location;
```

Then, you can query the view whenever you need to, like this:

```sql
SELECT * FROM daily_average;
```

Continuous aggregate views are refreshed automatically in the background as new data is added, or old data is modified. TimescaleDB tracks these changes to the dataset, and automatically updates the view in the background. This does not add any maintenance burden to your database, and does not slow down `INSERT` operations.

You can use continuous aggregates with a large number of default aggregation functions, and any custom aggregation function that is parallelizable. You can also use more complex expressions on top of the aggregate functions, for example `max(temperature)-min(temperature)`.


## Components of a continuous aggregate
Continuous aggregates consist of:
*   Materialization hypertable to store the aggregated data in
*   Materialization engine to aggregate data from the raw, underlying, table to the materialization hypertable
*   Invalidation engine to determine when data needs to be re-materialized, due to changes in the data
*   Query engine to access the aggregated data

### Materialization hypertable
Continuous aggregates take raw data from the original hypertable, aggregate it, and store the intermediate state in a materialization hypertable. When you query the continuous aggregate view, the state is returned to you as needed.

Using the same temperature example, the materialization table looks like this:

|day|location|chunk|avg temperature partial|
|-|-|-|-|
|2021/01/01|New York|1|{3, 219}|
|2021/01/01|Stockholm|1|{4, 280}|
|2021/01/02|New York|2||
|2021/01/02|Stockholm|2|{5, 345}|

<!---
Lana, you're up to here! --LKB 2021-06-21
-->


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
