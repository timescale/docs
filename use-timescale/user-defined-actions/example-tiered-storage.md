---
title: Use a user-defined action to implement automatic tablespace management
excerpt: Automatically move hypertable chunks between tablespaces
products: [cloud, mst, self_hosted]
keywords: [actions, tablespaces]
---

# Use a user-defined action to implement automatic tablespace management

[Moving older data to a different tablespace][moving-data] can help you save on
storage costs. Timescale supports automatic tablespace management by providing
the `move_chunk` function to move chunks between tablespaces. To schedule the
moves automatically, you can write a user-defined action.

<Procedure>

## Using a user-defined action to implement automatic chunk moving

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
    to implement automatic chunk moves on the `metrics` hypertable. Set `lag` to
    12 months to move chunks containing data older than 12 months. Set
    `tablespace` to the destination tablespace.

    ```sql
    SELECT add_job(
      'move_chunks',
      '1d',
      config => '{"hypertable":"metrics","lag":"12 month","tablespace":"old_chunks"}'
    );
    ```

<Highlight type="note">
This procedure uses PostgreSQL's regular `ALTER TABLE ... SET TABLESPACE` syntax
to move chunks. You could also write the procedure using TimescaleDB's
[`move_chunk`](/api/latest/hypertable/move_chunk) function. The
`move_chunk` function reorders the data as part of the move, which makes
subsequent queries faster. It also requires lower lock levels, so the chunk
remains available for reads during the move.
</Highlight>

</Procedure>

[moving-data]: /use-timescale/:currentVersion:/user-defined-actions/example-tiered-storage/
