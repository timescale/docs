# Chunk architecture
Each chunk is a standard PostgreSQL table. The hypertable is an abstraction on
top of the chunks, making the whole entity look and behave like a single table.
In PostgreSQL terminology, the hypertable is a "parent table" and the chunks are
its "child tables."

To enforce each chunk's time boundaries, each chunk includes time constraints.
For example, a specific chunk can only contain data with timestamps within
`['2020-07-01 00:00:00+00', '2020-07-02 00:00:00+00']`.

The TimescaleDB planner uses knowledge of chunks' constraints to optimize
database operations. When a row is inserted, it routes the insertion into the
right chunk for the row's time value. When a query is made, it pushes the query
down to only the chunks that matter. For example, if a query has a `WHERE`
clause specifying `time > now() - INTERVAL '1 week'`, the database only executes
the query against chunks covering the past week. It excludes any chunks from
before that time. 

All of this happens in the background. From your perspective, the hypertable
should look just like a regular PostgreSQL table.

## Space-partitioning architecture
Space partitions are also enforced with chunk constraints. Partitions are always
non-overlapping.

To determine how the values of the space-parititioning column map to partitions,
choose from one of these two methods:
*   Hashing, which maps each value into one of several defined hash buckets.
    This is the most common method.
*   Interval-based partitioning. This works the same way as time-based
    partitioning, where all the values in a specified range fall into the same
    partition.

## Chunk local indexes