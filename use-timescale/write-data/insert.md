---
title: Insert data
excerpt: Insert data into a hypertable
products: [cloud, mst, self_hosted]
keywords: [ingest]
tags: [insert, write, hypertables]
---

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
chunks within the same `INSERT` statement. Behind the scenes, the Timescale
engine batches the rows by chunk, and writes to each chunk in a single
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

[postgres-insert]: https://www.postgresql.org/docs/current/static/sql-insert.html
