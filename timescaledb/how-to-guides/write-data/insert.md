# INSERT

Data can be inserted into a hypertable using the standard `INSERT` SQL command
([PostgreSQL docs][postgres-insert]).

```sql
INSERT INTO conditions(time, location, temperature, humidity)
  VALUES (NOW(), 'office', 70.0, 50.0);
```

You can also insert multiple rows into a hypertable using a single `INSERT` call,
even thousands at a time. This is typically much more efficient than
inserting data row-by-row, and is recommended when possible.

```sql
INSERT INTO conditions
  VALUES
    (NOW(), 'office', 70.0, 50.0),
    (NOW(), 'basement', 66.5, 60.0),
    (NOW(), 'garage', 77.0, 65.2);
```

<highlight type="tip">
The rows that belong to a single batch INSERT command do **not** need
to belong to the same chunk (by time interval or partitioning key).
Upon receiving an `INSERT` command for multiple rows, the TimescaleDB
engine will determine which rows (sub-batches) belong to which chunks,
and will write them accordingly to each chunk in a single transaction.
</highlight>

You can also specify that `INSERT` returns some or all of the inserted
data via the `RETURNING` statement:

```sql
INSERT INTO conditions
  VALUES (NOW(), 'office', 70.1, 50.1) RETURNING *;

             time              | location | temperature | humidity
-------------------------------+----------+-------------+----------
 2017-07-28 11:42:42.846621+00 | office   |        70.1 |     50.1
(1 row)
```


[postgres-insert]: https://www.postgresql.org/docs/current/static/sql-insert.html
