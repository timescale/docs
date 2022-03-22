# Chunk architecture
Each chunk in a hypertable is a standard PostgreSQL table. The hypertable is an
abstraction on top of the chunks, making the whole entity look and behave like a
single table. In PostgreSQL terminology, the hypertable is a "parent table" and
the chunks are its "child tables."

To enforce each chunk's time boundaries, the chunk includes time constraints.
For example, a specific chunk can only contain data with time values within
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
Space partitions are also enforced with chunk constraints.

To determine how the values of the space-partitioning column map to partitions,
choose from one of these two methods:
*   Hashing, which maps each value into one of several defined hash buckets.
    This is the most common method.
*   Interval-based partitioning. This works the same way as time-based
    partitioning, where all the values in a specified range fall into the same
    partition.

Like time partitions, space partitions never overlap.

## Chunk local indexes
Rather than building a global index over an entire hypertable, TimescaleDB
builds local indexes on each chunk. In other words, each chunk has its own index
that only indexes data within that chunk. This optimization improves insert
speed for recent data. For more information, see the section on the 
[benefits of local indexes][hypertable-benefits-indexes].

<!-- TODO: insert local indexes diagram -->

Even with multiple local indexes, TimescaleDB can still ensure global uniqueness
for keys. It enforces an important constraint: any key that requires uniqueness,
such as a `PRIMARY KEY`, must include all columns that are used for data
partitioning.

In other words, because data is partitioned between chunks based on time value,
the unique key must include the time value. When data is inserted, TimescaleDB
identifies the corresponding time chunk. Using that chunk's unique index, it
checks for uniqueness within the chunk. Because no other chunk can contain that
time value, uniqueness within the chunk implies global uniqueness.

<!-- TODO: insert local indexes and time partitioning diagram -->

If another column is used for partitioning, the same logic applies. TimescaleDB
identifies the right chunk using the time-and-space partitions and checks for
uniqueness using the chunk's unique index. If the unique index contains both
the time and space partitioning parameters, then those values can appear in no
other partition. Uniqueness within the partition implies global uniqueness.

These checks happen in the background. As a user, you run a regular `INSERT`
command, and the correct index is automatically updated.

<highlight type="note">
To see examples of the partitioning column and unique index constraint in
practice, see the section on
[hypertables and unique indexes](/timescaledb/latest/how-to-guides/hypertables/hypertables-and-unique-indexes/).
</highlight>

[hypertable-benefits-indexes]: /overview/core-concepts/hypertables-and-chunks/hypertables-and-chunks-benefits/#faster-index-updates