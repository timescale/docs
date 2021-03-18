# Best Practices for Partitioning

Like a regular hypertable, a distributed hypertable needs to be
partitioned along a "time" dimension (e.g., a `timestamptz`
column). However, for best performance with most distributed
workloads, we recommend multi-dimensional partitioning with an
additional "space" dimension that consistently partitions the data
over the data nodes, similar to traditional [sharding][sharding].

If your data set has a column called something similar to
`customerID`, `deviceID`, or `location` (as in the example above), and
it figures frequently in the `GROUP BY` clause of queries, then it is
likely a good candidate column for space partitioning. For instance, a
query like the following one would work well on the example
distributed hypertable above:

```sql
SELECT time_bucket('1 hour', time) AS hour, location, avg(temperature)
FROM conditions
GROUP BY hour, location
ORDER BY hour, location
LIMIT 100;
```

as this query would execute in parallel on all data nodes. A query
that would not make the best use of space partitioning, however, would
be:

```sql
SELECT time_bucket('1 hour', time) AS hour, avg(temperature)
FROM conditions
WHERE location = 'office_1'
GROUP BY hour
ORDER BY hour
LIMIT 100;
```

as this query would only involve a single data node. Still, there are
other factors to consider as well. For instance, if the latter example
query is executed concurrently by many different client sessions, each
filtering on a different location, then that would also spread the
load evenly across the distributed hypertable.

Inserts also benefit from space partitioning; the additional space
dimension makes it more likely that a multi-row insert uniformly
spreads across the data nodes, leading to increased insert
performance. In contrast, with a single time dimension it is likely
that in-order inserts write to only one data node and chunk at a
time. Chunks would then be created on data nodes in round-robin
fashion.



[sharding]: https://en.wikipedia.org/wiki/Shard_(database_architecture)
