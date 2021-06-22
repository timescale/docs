# Continuous aggregates
Time-series data usually grows very quickly. Large data volumes can become slow
when aggregating the data into useful summaries. To make aggregating data
faster, TimescaleDB uses continuous aggregates.

For example, if you have a table of temperature readings over time in a number
of locations, and you want to find the average temperature in each location, you
can calculate the average as a one-off, with a query like this:

```sql
SELECT time_bucket(‘1 day’, time) as day,
       location,
       avg(temperature)
FROM temperatures
GROUP BY day, location;
```

If you want to run this query more than once, the database will need to scan the
entire table and recalculate the average every time. In most cases, though, the
data in the table will not have changed significantly, so there is no need to
scan the entire dataset. Continuous aggregates automatically, and in the
background, maintain the results from the query, and allow you to retrieve them
in the same way as any other data.

Using the same temperature example, you can create the same query as a
continuous aggregate view like this:

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

Continuous aggregate views are refreshed automatically in the background as new
data is added, or old data is modified. TimescaleDB tracks these changes to the
dataset, and automatically updates the view in the background. This does not add
any maintenance burden to your database, and does not slow down `INSERT`
operations.

You can use continuous aggregates with a large number of default aggregation
functions, and any custom aggregation function that is parallelizable. You can
also use more complex expressions on top of the aggregate functions, for example
`max(temperature)-min(temperature)`.

To test out continuous aggregates, follow
the [continuous aggregate tutorial][tutorial-caggs].

## Components of a continuous aggregate
Continuous aggregates consist of:
*   Materialization hypertable to store the aggregated data in
*   Materialization engine to aggregate data from the raw, underlying, table to
    the materialization hypertable
*   Invalidation engine to determine when data needs to be re-materialized, due
    to changes in the data
*   Query engine to access the aggregated data

### Materialization hypertable
Continuous aggregates take raw data from the original hypertable, aggregate it,
and store the intermediate state in a materialization hypertable. When you query
the continuous aggregate view, the state is returned to you as needed.

Using the same temperature example, the materialization table looks like this:

|day|location|chunk|avg temperature partial|
|-|-|-|-|
|2021/01/01|New York|1|{3, 219}|
|2021/01/01|Stockholm|1|{4, 280}|
|2021/01/02|New York|2||
|2021/01/02|Stockholm|2|{5, 345}|

The materialization table table is stored as a TimescaleDB hypertable, to take
advantage of the scaling and query optimizations that hypertables offer.
Materialization tables contain a a column for each group-by clause in the query,
a `chunk` column identifying which chunk in the raw data this entry came from,
and a `partial aggregate` column for each aggregate in the query.

The partial column is used internally to calculate the output. In this example,
because the query looks for an average, the partial column contains the number
of rows seen, and the sum of all their values. The most important thing to know
about partials is that they can be combined to create new partials spanning all
of the old partials' rows. This is important if you combine groups that span
multiple chunks.

### Materialization engine
When you query the continuous aggregate view, the materialization engine
combines the aggregate partials into a single partial for each time range, and
calculates the value that is returned. For example, to compute an average, each
partial sum is added up to a total sum, and each partial count is added up to a
total count, then the average is computed as the total sum divided by the total
count.

### Invalidation Engine
Any change to the data in a hypertable could potentially invalidate some
materialized rows. The invalidation engine checks to ensure that the system does
not become swamped with invalidations.

Fortunately, time-series data means that nearly all INSERTs and UPDATEs have a
recent timestamp, so the invalidation engine does not materialize all the data,
but to a set point in time called the materialization threshold. This threshold
is set so that the vast majority of INSERTs contain more recent timestamps.
These data points have never been materialized by the continuous aggregate, so
there is no additional work needed to notify the continuous aggregate that they
have been added. When the materializer next runs, it is responsible for
determining how much new data can be materialized without invalidating the
continuous aggregate. It then materializes the more recent data and moves the
materialization threshold forward in time. This ensures that the threshold lags
behind the point-in-time where data changes are common, and that most INSERTs do
not require any extra writes.

When data older than the invalidation threshold is changed, the maximum and
minimum timestamps of the changed rows is logged, and the values are used to
determine which rows in the aggregation table need to be recalculated. This
logging does cause some write load, but because the threshold lags behind the
area of data that is currently changing, the writes are small and rare.

### Materialization engine
The materialization engine performs two transactions. The first transaction
blocks all INSERTs, UPDATEs, and DELETEs, determines the time range to
materialize, and updates the invalidation threshold. The second transaction
unblocks other transactions, and materializes the aggregates. The first
transaction is very quick, and most of the work happens during the second
transaction, to ensure that the work does not interfere with other operations.


[tutorial-caggs]: timescaledb/getting-started/create-cagg
