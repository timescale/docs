# Writing data

If you are familiar with SQL, then the commands for writing to the database
will be familiar to you.  TimescaleDB uses standard SQL commands for writing data,
including INSERT, UPDATE, and DELETE as well as UPSERTs through ON CONFLICT statements;
and it all works as expected with changes to hypertables propagating down to
individual chunks.

## INSERT [](insert)

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

>:TIP: The rows that belong to a single batch INSERT command do **not** need
to belong to the same chunk (by time interval or partitioning key).
Upon receiving an `INSERT` command for multiple rows, the TimescaleDB
engine will determine which rows (sub-batches) belong to which chunks,
and will write them accordingly to each chunk in a single transaction.

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

---

## UPDATE Commands [](update)

Updates in TimescaleDB work as expected in standard SQL ([PostgreSQL docs][postgres-update]).

```sql
UPDATE conditions SET temperature = 70.2, humidity = 50.0
  WHERE time = '2017-07-28 11:42:42.846621+00' AND location = 'office';
```

An update command can touch many rows at once, i.e., the following
will modify all rows found in a 10-minute block of data.

```sql
UPDATE conditions SET temperature = temperature + 0.1
  WHERE time >= '2017-07-28 11:40' AND time < '2017-07-28 11:50';
```

>:WARNING: TimescaleDB achieves much higher insert performance compared to
 vanilla PostgreSQL when inserts are localized to the most recent time
 interval (or two).  If your workload is heavily based on `UPDATE`s to old
 time intervals instead, you may observe significantly lower write
 throughput.

---

## UPSERT Functionality [](upsert)

TimescaleDB supports UPSERTs in the same manner as PostgreSQL
via the optional `ON CONFLICT` clause ([PostgreSQL docs][postgres-upsert]).
If such a clause is provided, rather than cause an error,
an inserted row that
conflicts with another can either (a) do nothing or (b) result in a
subsequent update of that existing row.

In order to create a conflict, an insert must be performed on
identical value(s) in column(s) covered by a unique index or constraint. Such an
index is created automatically when marking column(s) as `PRIMARY KEY`
or with a `UNIQUE` constraint.

Following the examples given above, an `INSERT` with an identical
timestamp and location as an existing row will succeed and create an
additional row in the database.

If, however, the `conditions` table had been created with a UNIQUE
constraint defined on one or more of the columns (either at table
creation time or via an `ALTER` command):

```sql
CREATE TABLE conditions (
    time        TIMESTAMPTZ       NOT NULL,
    location    TEXT              NOT NULL,
    temperature DOUBLE PRECISION  NULL,
    humidity    DOUBLE PRECISION  NULL,
    UNIQUE (time, location)
);
```

then the second attempt to insert to this same time will normally
return an error.

The above `UNIQUE` statement during table creation internally is similar to:

```sql
CREATE UNIQUE INDEX on conditions (time, location);
```
Both of these result in a unique index for the table:
```sql
# \d+ conditions;
                              Table "public.conditions"
   Column    |           Type           | Modifiers | Storage  | Stats target | Description
-------------+--------------------------+-----------+----------+--------------+-------------
 time        | timestamp with time zone | not null  | plain    |              |
 location    | text                     | not null  | extended |              |
 temperature | double precision         |           | plain    |              |
 humidity    | double precision         |           | plain    |              |
Indexes:
    "conditions_time_location_idx" UNIQUE, btree ("time", location)
```

Now, however, the `INSERT` command can specify that nothing be done on
a conflict. This is particularly important when writing many rows as
one batch, as otherwise the entire transaction will fail (as opposed
to just skipping the row that conflicts).

```sql
INSERT INTO conditions
  VALUES ('2017-07-28 11:42:42.846621+00', 'office', 70.1, 50.0)
  ON CONFLICT DO NOTHING;
```

Alternatively, one can specify how to update the existing data:
```sql
INSERT INTO conditions
  VALUES ('2017-07-28 11:42:42.846621+00', 'office', 70.2, 50.1)
  ON CONFLICT (time, location) DO UPDATE
    SET temperature = excluded.temperature,
        humidity = excluded.humidity;
```

>:TIP: Unique constraints must include all partitioning keys.
 For example, if the table just uses time partitioning,
 the system requires `time` as part of the
 constraint: `UNIQUE(time)`, `UNIQUE(time, location)`, `UNIQUE(location, time)`, etc.
 On the other hand, `UNIQUE(location)` is *not* a valid constraint.
>
>If the schema were to have an additional column like `device` that is used
 as an additional partition dimension, then the constraint would have
 to be `UNIQUE(time, device)` or `UNIQUE(time, device, location)`. In
 such scenarios then, `UNIQUE(time, location)` would *no longer* be
 a valid constraint.

<!-- -->
>:WARNING: TimescaleDB does not yet support using `ON CONFLICT ON CONSTRAINT` with
 a named key (e.g., `conditions_time_location_idx`), but much of this
 functionality can be captured by specifying the same columns as above with
 a unique index/constraint. This limitation will be removed in a future version.


---

## DELETE [](delete)

Data can be deleted from a hypertable using the standard `DELETE` SQL
command ([PostgreSQL docs][postgres-delete]), which will propagate
down to the appropriate chunks that comprise the hypertable.

```sql
DELETE FROM conditions WHERE temperature < 35 OR humidity < 60;

DELETE FROM conditions WHERE time < NOW() - INTERVAL '1 month';
```

After running a large `DELETE` operation, users are recommended to
`VACUUM` or `VACUUM FULL` the hypertable to reclaim storage occupied
by deleted or obsoleted rows ([PostgreSQL docs][postgres-vacuum]).

>:TIP: For deleting old data, such as in the second example
 above, we recommend using the TimescaleDB function
 [`drop_chunks`][drop_chunks] instead.  This feature is much more
 performant: it deletes entire *chunks* of data (basically, removing
 files), rather than at the individual row level (necessitating
 vacuuming). See the section on [data retention][].


[postgres-insert]: https://www.postgresql.org/docs/current/static/sql-insert.html
[postgres-update]: https://www.postgresql.org/docs/current/static/sql-update.html
[postgres-upsert]: https://www.postgresql.org/docs/current/static/sql-insert.html#SQL-ON-CONFLICT
[postgres-delete]: https://www.postgresql.org/docs/current/static/sql-delete.html
[postgres-vacuum]: https://www.postgresql.org/docs/current/static/sql-vacuum.html
[drop_chunks]: /api#drop_chunks
[data retention]: /using-timescaledb/data-retention
