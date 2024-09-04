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

<Highlight type="note">
On the Timescale cloud platform, use the [Tiered Storage](https://docs.timescale.com/use-timescale/latest/data-tiering/)
offering which handles this by providing a [tiering policy API](https://docs.timescale.com/use-timescale/latest/data-tiering/creating-data-tiering-policy/)
to move data to low-cost object storage backed by Amazon S3.

</Highlight>

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
       destination_tablespace name;
       index_destination_tablespace name;
       reorder_index REGCLASS;
       chunk REGCLASS;
       tmp_name name;
    BEGIN
       SELECT jsonb_object_field_text (config, 'hypertable')::regclass INTO STRICT ht;
       SELECT jsonb_object_field_text (config, 'lag')::interval INTO STRICT lag;
       SELECT jsonb_object_field_text (config, 'destination_tablespace') INTO STRICT destination_tablespace;
       SELECT jsonb_object_field_text (config, 'index_destination_tablespace') INTO STRICT index_destination_tablespace;
       SELECT jsonb_object_field_text (config, 'reorder_index') INTO STRICT reorder_index;

     IF ht IS NULL OR lag IS NULL OR destination_tablespace IS NULL THEN
       RAISE EXCEPTION 'Config must have hypertable, lag and destination_tablespace';
     END IF;

     IF index_destination_tablespace IS NULL THEN
       index_destination_tablespace := destination_tablespace;
     END IF;

     FOR chunk IN
        SELECT c.oid
        FROM pg_class AS c
          LEFT JOIN pg_tablespace AS t ON (c.reltablespace = t.oid)
          JOIN pg_namespace AS n ON (c.relnamespace = n.oid)
          JOIN (SELECT * FROM show_chunks(ht, older_than => lag) SHOW (oid)) AS chunks ON (chunks.oid::text = n.nspname || '.' || c.relname)
        WHERE t.spcname != destination_tablespace OR t.spcname IS NULL
     LOOP
       RAISE NOTICE 'Moving chunk: %', chunk::text;
       PERFORM move_chunk(
           chunk => chunk,
           destination_tablespace => destination_tablespace,
           index_destination_tablespace => index_destination_tablespace,
           reorder_index => reorder_index
       );
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
      config => '{"hypertable":"metrics","lag":"12 month","destination_tablespace":"old_chunks"}'
    );
    ```

</Procedure>

[moving-data]: /use-timescale/:currentVersion:/user-defined-actions/example-tiered-storage/
