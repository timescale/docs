## Creating Triggers [](triggers)

TimescaleDB supports the full range of PostgreSQL triggers, and creating,
altering, or dropping triggers on the hypertable will similarly
propagate these changes to all of a hypertable's constituent chunks.

In the following example, let's say you want to create a new
table `error_conditions` with the same schema as `conditions`, but designed
to only store records which are deemed erroneous, where an application
signals a sensor error by sending a `temperature` or `humidity` having a
value >= 1000.

So, we'll take a two-step approach. First, let's create a function that
will insert data deemed erroneous into this second table:

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
Second, create a trigger that will call this function whenever a new row is
inserted into the hypertable.

```sql
CREATE TRIGGER record_error
  BEFORE INSERT ON conditions
  FOR EACH ROW
  EXECUTE PROCEDURE record_error();
```
Now, all data is inserted into the `conditions` data, but any row deemed
erroneous is _also_ added to the `error_conditions` table.

TimescaleDB supports the full gamut of
triggers: `BEFORE INSERT`, `AFTER INSERT`, `BEFORE UPDATE`, `AFTER UPDATE`, `BEFORE DELETE`, `AFTER DELETE`.
For additional information, see the [PostgreSQL docs][postgres-createtrigger].