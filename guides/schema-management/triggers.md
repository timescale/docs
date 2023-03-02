---
title: Triggers
excerpt: Create, alter, and drop triggers on a hypertable
products: [cloud, mst, self_hosted]
keywords: [hypertables, triggers]
---

# Triggers

TimescaleDB supports the full range of PostgreSQL triggers. Creating, altering,
or dropping triggers on a hypertable propagates the changes to all of the
underlying chunks.

## Create a trigger

This example creates a new table called `error_conditions` with the same schema
as `conditions`, but that only stores records which are considered errors. An
error, in this case, is when an application sends a `temperature` or `humidity`
reading with a value that is greater than or equal to 1000.

<Procedure>

### Creating a trigger

1.  Create a function that inserts erroneous data into the `error_conditions`
    table:

    ```sql
    CREATE OR REPLACE FUNCTION record_error()
      RETURNS trigger AS $record_error$
    BEGIN
     IF NEW.temperature >= 1000 OR NEW.humidity >= 1000 THEN
       INSERT INTO error_conditions
         VALUES(NEW.time, NEW.location, NEW.temperature, NEW.humidity);
     END IF;
     RETURN NEW;
    END;
    $record_error$ LANGUAGE plpgsql;
    ```

1.  Create a trigger that calls this function whenever a new row is inserted
    into the hypertable:

    ```sql
    CREATE TRIGGER record_error
      BEFORE INSERT ON conditions
      FOR EACH ROW
      EXECUTE PROCEDURE record_error();
    ```

1.  All data is inserted into the `conditions` table, but rows that contain errors
    are also added to the `error_conditions` table.

</Procedure>

TimescaleDB supports the full range of triggers, including `BEFORE INSERT`,
`AFTER INSERT`, `BEFORE UPDATE`, `AFTER UPDATE`, `BEFORE DELETE`, and
`AFTER DELETE`. For more information, see the
[PostgreSQL docs][postgres-createtrigger].

[postgres-createtrigger]: https://www.postgresql.org/docs/current/static/sql-createtrigger.html
