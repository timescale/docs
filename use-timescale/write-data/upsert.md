---
title: Upsert data
excerpt: Insert a new row or update an existing row in a hypertable using UPSERT
products: [cloud, mst, self_hosted]
keywords: [upsert, hypertables, bulk load, copy]
tags: [insert, write, unique constraints]
---

# Upsert data

Upserting is an operation to add data to your database where, if a matching row:

* **Does not exist**: inserts a new row 
* **Exists**: either updates the existing row, or does nothing

## Upsert, unique indexes, and constraints

Upserts work when you have a unique index or constraint. A matching row is one that has identical values for the columns
covered by the index or constraint. In $PG, a primary key is a unique index with a `NOT NULL` constraint.
If you have a primary key, you automatically have a unique index.

Unique constraints must include all partitioning columns. That means unique
constraints on a $HYPERTABLE must include the time column. If you added other
partitioning columns to your $HYPERTABLE, the constraint must include those as
well. For more information, see [$HYPERTABLE_CAPs and unique indexes][hypertables-and-unique-indexes].


The examples in this page use a `conditions` table with a unique constraint
on the columns `(time, location)`. To create a unique constraint, either: 

- Use `UNIQUE (<COLUMNS>)` when you define your table:

    ```sql
    CREATE TABLE conditions (
      time        TIMESTAMPTZ       NOT NULL,
      location    TEXT              NOT NULL,
      temperature DOUBLE PRECISION  NULL,
      humidity    DOUBLE PRECISION  NULL,
      UNIQUE (time, location)
    );
    ```

- Use `ALTER TABLE` after the table is created:

    ```sql
    ALTER TABLE conditions
      ADD CONSTRAINT conditions_time_location
        UNIQUE (time, location);
    ```

## Insert or update data

To insert new data that doesn't violate the constraint, and to update the existing row if it does, use the syntax 
`INSERT INTO ... VALUES ... ON CONFLICT ... DO UPDATE`. For example, to update the `temperature` and `humidity` values 
if a row with the specified `time` and `location` already exists, run:

```sql
INSERT INTO conditions
  VALUES ('2017-07-28 11:42:42.846621+00', 'office', 70.2, 50.1)
  ON CONFLICT (time, location) DO UPDATE
    SET temperature = excluded.temperature,
        humidity = excluded.humidity;
```

## Insert or do nothing

You can also do nothing if the constraint is violated. The new data is not inserted, and the old row is not updated,
the database engine skips the row and moves on. This is useful to prevent the entire transaction from failing when 
writing many rows as one batch.

To insert or do nothing, use the syntax `INSERT INTO ... VALUES ... ON CONFLICT
DO NOTHING`:

```sql
INSERT INTO conditions
  VALUES ('2017-07-28 11:42:42.846621+00', 'office', 70.1, 50.0)
  ON CONFLICT DO NOTHING;
```

## Bulk upsert using COPY

When you need to upsert large amounts of data, `COPY` is significantly faster than `INSERT`. However, `COPY` doesn't 
support `ON CONFLICT` clauses directly. Best practice is to use a staging table. This two-step approach combines the 
speed of `COPY` for bulk loading with the flexibility of `INSERT...ON CONFLICT` for upsert logic. For large datasets, 
this is much faster than using `INSERT...ON CONFLICT` directly.

To load data efficiently with `COPY`, then upsert:

<Procedure>

1. **Create a staging table with the same structure as the destination table**
    ```sql
    CREATE TEMP TABLE conditions_staging (LIKE conditions);
    ```

1. **Use `COPY` to bulk load data into the staging table**
    ```sql
    COPY conditions_staging(time, location, temperature, humidity)
      FROM '/path/to/data.csv'
      WITH (FORMAT CSV, HEADER);
    ```

1. **Upsert from the staging table to the destination table**
    ```sql
    INSERT INTO conditions
      SELECT * FROM conditions_staging
      ON CONFLICT (time, location) DO UPDATE
        SET temperature = EXCLUDED.temperature,
            humidity = EXCLUDED.humidity;
    ```
   To skip duplicate rows, set `ON CONFLICT (time, location) DO NOTHING`.

1. **Clean up the staging table**
    ```sql
    DROP TABLE conditions_staging;
    ```

</Procedure>


[postgres-upsert]: https://www.postgresql.org/docs/current/static/sql-insert.html#SQL-ON-CONFLICT
[postgres-copy]: https://www.postgresql.org/docs/current/sql-copy.html
[hypertables-and-unique-indexes]: /use-timescale/:currentVersion:/hypertables/hypertables-and-unique-indexes/
