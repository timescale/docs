---
title: Use a user-defined action to implement automatic data tiering
excerpt: Implement automatic data tierign with a user-defined action
keywords: [actions, data tiering]
---

# Use a user-defined action to implement automatic data tiering
[Data tiering][data-tiering] helps you save on storage costs by moving older
data to a different tablespace. TimescaleDB supports data tiering by providing
the `move_chunk` function to move chunks between tablespaces. To schedule the
moves automatically, you can write a user-defined action.

<procedure>

## Using a user-defined action to implement automatic data tiering
1.  Create a procedure that moves chunks to a different tablespace if they
    contain data older than the `lag` parameter.
    ```sql
    CREATE OR REPLACE PROCEDURE move_chunks (job_id int, config jsonb)
    LANGUAGE PLPGSQL
    AS $$
    DECLARE
      ht REGCLASS;
      lag interval;
      destination name;
      chunk REGCLASS;
    BEGIN
      SELECT jsonb_object_field_text (config, 'hypertable')::regclass INTO STRICT ht;
      SELECT jsonb_object_field_text (config, 'lag')::interval INTO STRICT lag;
      SELECT jsonb_object_field_text (config, 'tablespace') INTO STRICT destination;

      IF ht IS NULL OR lag IS NULL OR destination IS NULL THEN
        RAISE EXCEPTION 'Config must have hypertable, lag and destination';
      END IF;

      FOR chunk IN
      SELECT show.oid
      FROM show_chunks(ht, older_than => lag)
      SHOW (oid)
        INNER JOIN pg_class pgc ON pgc.oid = show.oid
        INNER JOIN pg_tablespace pgts ON pgts.oid = pgc.reltablespace
      WHERE pgts.spcname != destination
      LOOP
        RAISE NOTICE 'Moving chunk: %', chunk::text;
        EXECUTE format('ALTER TABLE %s SET TABLESPACE %I;', chunk, destination);
      END LOOP;
    END
    $$;
    ```
1.  Register the job to run daily. In the config, set `hypertable` to `metrics`
    to implement data tiering on the `metrics` hypertable. Set `lag` to 12
    months to move chunks containing data older than 12 months. Set
    `tablespace` to the destination tablespace. 
    ```sql
    SELECT add_job(
      'move_chunks',
      '1d',
      config => '{"hypertable":"metrics","lag":"12 month","tablespace":"old_chunks"}'
    );
    ```

<highlight type="note">
This procedure uses PostgreSQL's regular `ALTER TABLE ... SET TABLESPACE` syntax
to move chunks. You could also write the procedure using TimescaleDB's
[`move_chunk`](/api/latest/hypertable/move_chunk) function. The
`move_chunk` function reorders the data as part of the move, which makes
subsequent queries faster. It also requires lower lock levels, so the chunk
remains available for reads during the move.
</highlight>

</procedure>

[data-tiering]: /timescaledb/:currentVersion:/how-to-guides/data-tiering/
