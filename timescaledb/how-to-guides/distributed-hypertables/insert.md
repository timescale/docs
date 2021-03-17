# Inserting into a Distributed Hypertable

Just like a regular hypertable, it is important to batch data when
inserting into a distributed hypertable. Each insert statement is
often its own transaction, and the overhead and cost of this
transaction is good to amortize over many rows of data. With a
distributed hypertable, the transaction has additional costs due to
the coordination that needs to happen across data nodes (e.g.,
two-phase commit protocol). In such cases, a single insert transaction
to the access node involving many rows of data is processed by the
access node, such that the access node (a) splits the input set into
several smaller batches of rows (with each batch having those rows
that belong to a specific data node based on the distributed
hypertable's partitioning), and then (b) writes each batch of rows to
its corresponding data node.

There are two ways to insert data to the access node (which similarly
uses corresponding methods when interacting with its data nodes):

- [`INSERT`][insert]: the access node sets up a multi-row prepared
  statement on each data node and then splits the original insert
  statement across these sub-statements. The access node can buffer up
  to `timescaledb.max_insert_batch_size` number of rows (default 1000)
  per data node before a prepared statement's limit is reached and
  gets flushed to the data node. Thus, if there are 10000 rows in the
  original insert statement and three data nodes with the default
  insert batch size, the insert would roughly require three full
  batches per data node and a partial final batch.

  By tuning the insert batch size, throughput can be optimized. The
  maximum insert batch size is, however, limited by the maximum number
  of parameters allowed in a prepared statement (32767), and the
  number of columns in each row. For example, if a distributed
  hypertable has 10 columns, the max insert batch size is capped at
  3276 rows.
- [`COPY`][copy]: the access node switches each data node to "copy
  mode" and then routes each row to the correct data node in a
  stream. `COPY` typically delivers better performance than insert
  statements, although it doesn't support features like conflict
  handling (`ON CONFLICT` clause) that are used for
  [upserts][upserts].



[upserts]: /how-to-guides/write-data/upsert/
[insert]: https://www.postgresql.org/docs/current/sql-insert.html
[copy]: https://www.postgresql.org/docs/current/sql-copy.html