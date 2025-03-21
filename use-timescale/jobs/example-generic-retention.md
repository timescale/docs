---
title: Use a job to create a generic retention policy
excerpt: In Timescale Cloud, you can add a data retention policy to a hypertable, to store data more efficiently. Take it one step further by creating a generic data retention policy for your entire service
products: [cloud, mst, self_hosted]
keywords: [jobs, data retention]
---

# Use a $JOB to create a generic retention policy

Timescale natively supports adding a
[data retention policy][data-retention-policy] to a $HYPERTABLE. If you want to
add a generic data retention policy to all $HYPERTABLEs, you can create a custom
$JOB.

<Procedure>

1.  Create a procedure that drops $CHUNKs from any $HYPERTABLE if they are older
    than the `drop_after` parameter. To get all $HYPERTABLEs, the
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

1.  Register the $JOB to run daily. In the `config`, set `drop_after` to 12 months
    to drop $CHUNKs containing data older than 12 months.

    ```sql
    SELECT add_job('generic_retention','1d', config => '{"drop_after":"12 month"}');
    ```

<Highlight type="note">

You can further refine this policy by adding filters to your procedure. For
example, add a `WHERE` clause to the `PERFORM` query to only drop $CHUNKs from
particular $HYPERTABLEs.

</Highlight>

</Procedure>

[data-retention-policy]: /use-timescale/:currentVersion:/data-retention/create-a-retention-policy/
