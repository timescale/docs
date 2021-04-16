# UPSERT Functionality

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

<highlight type="tip">
Unique constraints must include all partitioning keys.
 For example, if the table just uses time partitioning,
 the system requires `time` as part of the
 constraint: `UNIQUE(time)`, `UNIQUE(time, location)`, `UNIQUE(location, time)`, etc.
 On the other hand, `UNIQUE(location)` is *not* a valid constraint.

If the schema were to have an additional column like `device` that is used
 as an additional partition dimension, then the constraint would have
 to be `UNIQUE(time, device)` or `UNIQUE(time, device, location)`. In
 such scenarios then, `UNIQUE(time, location)` would *no longer* be
 a valid constraint.
</highlight>

<highlight type="warning">
TimescaleDB does not yet support using `ON CONFLICT ON CONSTRAINT` with
 a named key (e.g., `conditions_time_location_idx`), but much of this
 functionality can be captured by specifying the same columns as above with
 a unique index/constraint. This limitation will be removed in a future version.
</highlight>


[postgres-upsert]: https://www.postgresql.org/docs/current/static/sql-insert.html#SQL-ON-CONFLICT
