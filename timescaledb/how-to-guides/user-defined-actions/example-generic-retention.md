## Generic Retention [](generic-retention)

Create a generic data retention policy that applies to ALL hypertables, as opposed
to just a single one as required by `add_retention_policy`.
The policy could be further refined with additional filters, by adding a WHERE
clause to the PERFORM query in the procedure definition.

```sql
CREATE OR REPLACE PROCEDURE generic_retention (job_id int, config jsonb)
LANGUAGE PLPGSQL
AS $$
DECLARE
  drop_after interval;
BEGIN
  SELECT jsonb_object_field_text (config, 'drop_after')::interval INTO STRICT drop_after;

  IF drop_after IS NULL THEN
    RAISE EXCEPTION 'Config must have drop_after';
  END IF;

  PERFORM drop_chunks(format('%I.%I', table_schema, table_name), older_than => drop_after)
    FROM timescaledb_information.hypertables;
END
$$;
```

Register job to run daily dropping chunks on all hypertables that are older
than 12 months.

```sql
SELECT add_job('generic_retention','1d', config => '{"drop_after":"12 month"}');
```
