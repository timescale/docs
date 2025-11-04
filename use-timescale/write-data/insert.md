---
title: Insert data
excerpt: Insert single and multiple rows and return data in TimescaleDB with SQL
products: [cloud, mst, self_hosted]
keywords: [ingest]
tags: [insert, write, hypertables]
---

import EarlyAccess2230 from "versionContent/_partials/_early_access_2_23_0.mdx";

# Insert data

Insert data into a hypertable with a standard [`INSERT`][postgres-insert] SQL
command.

## Insert a single row

To insert a single row into a hypertable, use the syntax `INSERT INTO ...
VALUES`. For example, to insert data into a hypertable named `conditions`:

```sql
INSERT INTO conditions(time, location, temperature, humidity)
  VALUES (NOW(), 'office', 70.0, 50.0);
```

## Insert multiple rows

You can also insert multiple rows into a hypertable using a single `INSERT`
call. This works even for thousands of rows at a time. This is more efficient
than inserting data row-by-row, and is recommended when possible.

Use the same syntax, separating rows with a comma:

```sql
INSERT INTO conditions
  VALUES
    (NOW(), 'office', 70.0, 50.0),
    (NOW(), 'basement', 66.5, 60.0),
    (NOW(), 'garage', 77.0, 65.2);
```

<Highlight type="note">

You can insert multiple rows belonging to different
chunks within the same `INSERT` statement. Behind the scenes, $TIMESCALE_DB batches the rows by chunk, and writes to each chunk in a single
transaction.

</Highlight>

## Insert and return data

In the same `INSERT` command, you can return some or all of the inserted data by
adding a `RETURNING` clause. For example, to return all the inserted data, run:

```sql
INSERT INTO conditions
  VALUES (NOW(), 'office', 70.1, 50.1)
  RETURNING *;
```

This returns:

```sql
time                          | location | temperature | humidity
------------------------------+----------+-------------+----------
2017-07-28 11:42:42.846621+00 | office   |        70.1 |     50.1
(1 row)
```

## Direct compress on INSERT

This columnar format enables fast scanning and
aggregation, optimizing performance for analytical workloads while also saving significant storage space. In the
$COLUMNSTORE conversion, $HYPERTABLE chunks are compressed by up to 98%, and organized for efficient, large-scale
queries.

To improve performance, you can compress data during `INSERT` so that it is injected directly into chunks
in the $COLUMNSTORE rather than waiting for the policy.

To enable direct compress on INSERT, enable the following [GUC parameters][gucs]:

```sql
SET timescaledb.enable_compressed_insert = true;
SET timescaledb.enable_compressed_insert_sort_batches = true;
SET timescaledb.enable_compressed_insert_client_sorted = true;
```

When you set `enable_compressed_insert_client_sorted` to `true`, you must ensure that data in the input 
stream is sorted. 

<EarlyAccess2230 />

[postgres-update]: https://www.postgresql.org/docs/current/sql-update.html
[hypertable-create-table]: /api/:currentVersion:/hypertable/create_table/
[add_columnstore_policy]: /api/:currentVersion:/hypercore/add_columnstore_policy/
[remove_columnstore_policy]: /api/:currentVersion:/hypercore/remove_columnstore_policy/
[create_table_arguments]: /api/:currentVersion:/hypertable/create_table/#arguments
[alter_job_samples]: /api/:currentVersion:/jobs-automation/alter_job/#samples
[convert_to_columnstore]: /api/:currentVersion:/hypercore/convert_to_columnstore/
[gucs]: /api/:currentVersion:/configuration/gucs/

[postgres-insert]: https://www.postgresql.org/docs/current/sql-insert.html
