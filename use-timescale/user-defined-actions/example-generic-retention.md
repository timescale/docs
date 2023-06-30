---
title: Use a user-defined action to create a generic retention policy
excerpt: Create a generic data retention policy that applies to all hypertables
products: [cloud, mst, self_hosted]
keywords: [actions, data retention]
---

# Use a user-defined action to create a generic retention policy

Timescale natively supports adding a
[data retention policy][data-retention-policy] to a hypertable. If you want to
add a generic data retention policy to _all_ hypertables, you can write a
user-defined action.

<Procedure>

## Using a user-defined action to create a generic retention policy

1.  Create a procedure that drops chunks from any hypertable if they are older
    than the `drop_after` parameter. To get all hypertables, the
    `timescaledb_information.hypertables` table is queried.

    ```sql
    CREATE OR REPLACE PROCEDURE generic_retention (job_id int, config jsonb)
    LANGUAGE PLPGSQL
    AS $$
    DECLARE
      drop_after interval;
    BEGIN
      SELECT jsonb_object_field_text (config, 'drop_after')::interval
        INTO STRICT drop_after;

      IF drop_after IS NULL THEN
        RAISE EXCEPTION 'Config must have drop_after';
      END IF;

      PERFORM drop_chunks(
        format('%I.%I', hypertable_schema, hypertable_name),
        older_than => drop_after
      ) FROM timescaledb_information.hypertables;
    END
    $$;
    ```

1.  Register the job to run daily. In the `config`, set `drop_after` to 12 months
    to drop chunks containing data older than 12 months.

    ```sql
    SELECT add_job('generic_retention','1d', config => '{"drop_after":"12 month"}');
    ```

<Highlight type="note">
You can further refine this policy by adding filters to your procedure. For
example, add a `WHERE` clause to the `PERFORM` query to only drop chunks from
particular hypertables.
</Highlight>

</Procedure>

[data-retention-policy]: /use-timescale/:currentVersion:/data-retention/create-a-retention-policy/
