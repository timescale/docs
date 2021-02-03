# Why Use TimescaleDB over Relational DBs?

TimescaleDB offers three key benefits over vanilla PostgreSQL or other
traditional RDBMSs for storing time-series data:
1. Much higher data ingest rates, especially at larger database sizes.
2. Query performance ranging from equivalent to _orders of magnitude greater_.
3. Time-oriented features.

And because TimescaleDB still allows you to use the full range of
PostgreSQL features and tools &mdash; e.g., JOINs with relational tables,
geospatial queries via PostGIS, `pg_dump` and `pg_restore`, any
connector that speaks PostgreSQL &mdash; there is little reason **not** to
use TimescaleDB for storing time-series data within a PostgreSQL node.

## Much Higher Ingest Rates

TimescaleDB achieves a much higher and more stable ingest rate than
PostgreSQL for time-series data.  As described in our [architectural discussion][],
PostgreSQL's performance begins to significantly suffer as soon as indexed tables
can no longer fit in memory.

In particular, whenever a new row is inserted, the database needs to
update the indexes (e.g., B-trees) for each of the table's indexed
columns, which will involve swapping one or more pages in from disk.
Throwing more memory at the problem only delays the inevitable, and
your throughput in the 10K-100K+ rows per second can crash to
hundreds of rows per second once your time-series table is in the tens
of millions of rows.

TimescaleDB solves this through its heavy utilization of
time-space partitioning, even when running *on a single machine*.  So
all writes to recent time intervals are only to tables that remain in
memory, and updating any secondary indexes is also fast as a result.

Benchmarking shows the clear advantage of this approach.  The
following benchmark out to 1 billion rows (on a single machine)
emulates a common monitoring
scenario, with database clients inserting moderately-sized batches of
data containing time, a device's tagset, and multiple numeric metrics (in
this case, 10).  Here, experiments were performed on a standard Azure VM
(DS4 v2, 8 core) with network-attached SSD storage.

<img width="100%" src="//assets.timescale.com/benchmarks/timescale-vs-postgres-insert-1B.jpg"></img>

We observe that both PostgreSQL and TimescaleDB start at around the
same throughput (106K and 114K, respectively) for the first 20M
requests, or over 1M metrics per second.  However, at around 50M rows,
PostgreSQL's performance begins to drop precipitously.  Its average
over the last 100M rows is only 5K rows/s, while TimescaleDB retains its
throughput of 111K rows/s.

In short, TimescaleDB loads the one billion row database in
**one-fifteenth** the total time of PostgreSQL, and sees throughput
more than **20x** that of PostgreSQL at these larger sizes.

Our benchmarks of TimescaleDB show that it maintains its constant
performance at over 10B rows, even with a single disk.

Additionally, users have reported such stable performance for **100s
of billions of rows** when leveraging many disks on a single
machine, either in RAIDed configuration or using TimescaleDB's support
for spreading a single hypertable across multiple disks
(through multiple tablespaces, which is not possible on a traditional
PostgreSQL table).

## Superior or Similar Query Performance

On single-disk machines, many simple queries that just
perform indexed lookups or table scans are similarly performant
between PostgreSQL and TimescaleDB.

For example, on a 100M row table with indexed time, hostname, and cpu
usage information, the following query will take less than 5ms for
each database:

```sql
SELECT date_trunc('minute', time) AS minute, max(user_usage)
  FROM cpu
  WHERE hostname = 'host_1234'
    AND time >= '2017-01-01 00:00' AND time < '2017-01-01 01:00'
  GROUP BY minute ORDER BY minute;
```

Similar queries which involve a basic scan over an index are also
equivalently performant between the two:

```sql
SELECT * FROM cpu
  WHERE usage_user > 90.0
    AND time >= '2017-01-01' AND time < '2017-01-02';
```

Larger queries involving time-based GROUP BYs -- quite common in
time-oriented analysis -- often achieve superior performance in TimescaleDB.

For example, the following query that touches 33M rows is **5x** faster
in TimescaleDB when the entire (hyper)table is 100M rows, and
around **2x** faster when it is 1B rows.

```sql
SELECT date_trunc('hour', time) as hour,
    hostname, avg(usage_user)
  FROM cpu
  WHERE time >= '2017-01-01' AND time < '2017-01-02'
  GROUP BY hour, hostname
  ORDER BY hour;
```

Moreover, other queries that can reason specifically about time ordering can
be _much_ more performant in TimescaleDB.

For example, TimescaleDB introduces a time-based "merge append" optimization to
minimize the number of groups which must be processed to execute the
following (given its knowledge that time is already ordered).  For our
100M row table, this results in query latency that is **396x** faster
than PostgreSQL (82ms vs. 32566ms).

```sql
SELECT date_trunc('minute', time) AS minute, max(usage_user)
  FROM cpu
  WHERE time < '2017-01-01'
  GROUP BY minute
  ORDER BY minute DESC
  LIMIT 5;
```

We will be publishing more complete benchmarking comparisons between
PostgreSQL and TimescaleDB soon, as well as the software to replicate
our benchmarks.

The high-level result from our query benchmarking is that
for almost **every query** that we have tried, TimescaleDB achieves
either **similar or superior (or vastly superior) performance** to vanilla PostgreSQL.

The one additional cost of TimescaleDB compared to PostgreSQL is more
complex planning (given that a single hypertable can be comprised of
many chunks).  This can translate to a few extra milliseconds of
planning time, which can have a disproportional influence for very
low-latency queries (< 10ms).

## Time-oriented Features

TimescaleDB also includes a number of time-oriented features that
aren't found in traditional relational databases.  These include
special query optimizations (like the merge append above) that provide
some of the huge performance improvements for time-oriented queries,
as well as other time-oriented functions (some of which are listed below).

#### Time-oriented Analytics

TimescaleDB includes *new* functions for time-oriented analytics,
including some of the following:

- **Time bucketing**: A more powerful version of the standard `date_trunc` function,
    it allows for arbitrary time intervals (e.g., 5 minutes, 6 hours, etc.),
    as well as flexible groupings and offsets, instead of just second,
    minute, hour, etc.

- **Last** and **first** aggregates: These functions allow you
    to get the value of one column as ordered by another.  For
    example, `last(temperature, time)` will return the latest
    temperature value based on time within a group (e.g., an hour).

These type of functions enable very natural time-oriented queries.
The following financial query, for example, prints the opening,
closing, high, and low price of each asset.

```sql
SELECT time_bucket('3 hours', time) AS period
    asset_code,
    first(price, time) AS opening, last(price, time) AS closing,
    max(price) AS high, min(price) AS low
  FROM prices
  WHERE time > NOW() - INTERVAL '7 days'
  GROUP BY period, asset_code
  ORDER BY period DESC, asset_code;
```

The ability of `last` to order by a secondary column (even different
than the aggregate) enables some powerful types of queries.  For
example, a common technique in financial reporting is "bitemporal
modeling", which separately reasons about the time associated with an
observation from the time that observation was recorded.  In such a
model, corrections are inserted as a new row (with a more
recent *time_recorded* field) and do not replace existing data.

The following query returns the daily price for each assets, as
ordered by the latest recorded price.

```sql
SELECT time_bucket('1 day', time) AS day,
    asset_code,
    last(price, time_recorded)
  FROM prices
  WHERE time > '2017-01-01'
  GROUP BY day, asset_code
  ORDER BY day DESC, asset_code;
```

For more information about TimescaleDB's current (and growing) list of
time features, please [see our API][api].

#### Time-oriented Data Management

TimescaleDB also provides certain data management capabilities that
are not readily available or performant in PostgreSQL.  For example, when dealing
with time-series data, data often builds up very quickly. So, you then want
to write a *data retention* policy along the lines of "only store raw
data for a week."

In fact, it's common to couple this with the use of continuous
aggregations, so you might keep two hypertables: one with raw data,
the other with data that has already been rolled up into minutely or
hourly aggregates.  Then, you might want to define different retention
policies on the two (hyper)tables, storing the aggregated data much
longer.

TimescaleDB allows efficient deletion of old data at the **chunk** level,
rather than at the row level, via its `drop_chunks` functionality.

```sql
SELECT drop_chunks('conditions', INTERVAL '7 days');
```

This will delete all chunks (files) from the hypertable 'conditions'
that only include data older than this duration, rather than deleting
any individual rows of data in chunks.  This avoids fragmentation in
the underlying database files, which in turn avoids the need for
vacuuming that can be prohibitively expensive in very large tables.

For more details, see our [data retention][] discussion, including how
to automate your data retention policies.

**Next:** How does TimescaleDB compare to NoSQL time-series DBs? [TimescaleDB vs. NoSQL][vs NoSQL]

[architectural discussion]: /introduction/architecture#benefits-chunking
[api]: /api
[data retention]: /using-timescaledb/data-retention
[vs NoSQL]: /introduction/timescaledb-vs-nosql
