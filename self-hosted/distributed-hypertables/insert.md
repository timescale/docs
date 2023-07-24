---
title: Insert data
excerpt: How to insert data into distributed hypertables
products: [self_hosted]
keywords: [write, distributed hypertables]
tags: [ingest, insert]
---

# Insert data

You can insert data into a distributed hypertable with an `INSERT` statement.
The syntax looks the same as for a standard hypertable or PostgreSQL table. For
example:

```sql
INSERT INTO conditions(time, location, temperature, humidity)
  VALUES (NOW(), 'office', 70.0, 50.0);
```

## Optimize data insertion

Distributed hypertables have higher network load than standard hypertables,
because they must push inserts from the access node to the data nodes. You can
optimize your insertion patterns to reduce load.

### Insert data in batches

Reduce load by batching your `INSERT` statements over many rows of data, instead
of performing each insertion as a separate transaction.

The access node first splits the batched data into smaller batches by
determining which data node each row should belong to. It then writes each batch
to the correct data node.

### Optimize insert batch size

When inserting to a distributed hypertable, the access node tries to convert
`INSERT` statements into more efficient [`COPY`][postgresql-copy] operations
between the access and data nodes. But this doesn't work if:

*   The `INSERT` statement has a `RETURNING` clause _and_
*   The hypertable has triggers that could alter the returned data

In this case, the planner uses a multi-row prepared statement to insert into
each data node. It splits the original insert statement across these
sub-statements. You can view the plan by running an
[`EXPLAIN`][postgresql-explain] on your `INSERT` statement.

In the prepared statement, the access node can buffer a number of rows before
flushing them to the data node. By default, the number is 1000. You can optimize
this by changing the `timescaledb.max_insert_batch_size` setting, for example to
reduce the number of separate batches that must be sent.

The maximum batch size has a ceiling. This is equal to the maximum number of
parameters allowed in a prepared statement, which is currently 32,767
parameters, divided by the number of columns in each row. For example, if you
have a distributed hypertable with 10 columns, the highest you can set the batch
size is 3276.

For more information on changing `timescaledb.max_insert_batch_size`, see the
section on [configuration][config].

### Use a copy statement instead

[`COPY`][postgresql-copy] can perform better than `INSERT` on a distributed
hypertable. But it doesn't support some features, such as conflict handling
using the `ON CONFLICT` clause.

To copy from a file to your hypertable, run:

```sql
COPY <HYPERTABLE> FROM '<FILE_PATH>';
```

When doing a [`COPY`][postgresql-copy], the access node switches each data node
to copy mode. It then streams each row to the correct data node.

[config]: /self-hosted/:currentVersion:/configuration/timescaledb-config/#distributed-hypertables
[postgresql-copy]: https://www.postgresql.org/docs/14/sql-copy.html
[postgresql-explain]: https://www.postgresql.org/docs/14/sql-explain.html
