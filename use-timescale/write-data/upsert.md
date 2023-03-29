---
title: Upsert data
excerpt: Upsert data to insert a new row or update an existing row
products: [cloud, mst, self_hosted]
keywords: [upsert, hypertables]
---

# Upsert data

Upserting is an operation that performs both:

*   Inserting a new row if a matching row doesn't already exist
*   Either updating the existing row, or doing nothing, if a matching row
    already exists

Upserts only work when you have a unique index or constraint. A matching row is
one that has identical values for the columns covered by the index or
constraint.

<Highlight type="note">
In PostgreSQL, a primary key is a unique index with a `NOT NULL` constraint.
If you have a primary key, you automatically have a unique index.
</Highlight>

## Create a table with a unique constraint

The examples in this section use a `conditions` table with a unique constraint
on the columns `(time, location)`. To create a unique constraint, use `UNIQUE
(<COLUMNS>)` while defining your table:

```sql
CREATE TABLE conditions (
  time        TIMESTAMPTZ       NOT NULL,
  location    TEXT              NOT NULL,
  temperature DOUBLE PRECISION  NULL,
  humidity    DOUBLE PRECISION  NULL,
  UNIQUE (time, location)
);
```

You can also create a unique constraint after the table is created. Use the
syntax `ALTER TABLE ... ADD CONSTRAINT ... UNIQUE`. In this example, the
constraint is named `conditions_time_location`:

```sql
ALTER TABLE conditions
  ADD CONSTRAINT conditions_time_location
    UNIQUE (time, location);
```

When you add a unique constraint to a table, you can't insert data that violates
the constraint. In other words, if you try to insert data that has identical
values to another row, within the columns covered by the constraint, you get an
error.

<Highlight type="note">
Unique constraints must include all partitioning columns. That means unique
constraints on a hypertable must include the time column. If you added other
partitioning columns to your hypertable, the constraint must include those as
well. For more information, see the section on
[hypertables and unique indexes](/use-timescale/latest/hypertables/hypertables-and-unique-indexes/).
</Highlight>

## Insert or update data to a table with a unique constraint

You can tell the database to insert new data if it doesn't violate the
constraint, and to update the existing row if it does. Use the syntax `INSERT
INTO ... VALUES ... ON CONFLICT ... DO UPDATE`.

For example, to update the `temperature` and `humidity` values if a row with the
specified `time` and `location` already exists, run:

```sql
INSERT INTO conditions
  VALUES ('2017-07-28 11:42:42.846621+00', 'office', 70.2, 50.1)
  ON CONFLICT (time, location) DO UPDATE
    SET temperature = excluded.temperature,
        humidity = excluded.humidity;
```

## Insert or do nothing to a table with a unique constraint

You can also tell the database to do nothing if the constraint is violated. The
new data is not inserted, and the old row is not updated. This is useful when
writing many rows as one batch, to prevent the entire transaction from failing.
The database engine skips the row and moves on.

To insert or do nothing, use the syntax `INSERT INTO ... VALUES ... ON CONFLICT
DO NOTHING`:

```sql
INSERT INTO conditions
  VALUES ('2017-07-28 11:42:42.846621+00', 'office', 70.1, 50.0)
  ON CONFLICT DO NOTHING;
```

[postgres-upsert]: https://www.postgresql.org/docs/current/static/sql-insert.html#SQL-ON-CONFLICT
