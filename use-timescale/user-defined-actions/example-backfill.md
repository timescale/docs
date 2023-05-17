---
title: Use a user-defined action to schedule regular backfilling
excerpt: Schedule regular backfilling of historical data into a compressed hypertable
products: [cloud, mst, self_hosted]
keywords: [action, backfilling]
---

# Use a user-defined action to schedule regular backfilling

Timescale provides a [stored procedure for backfilling data][backfill] into a
compressed hypertable. To regularly backfill data, you can schedule this stored
procedure to run periodically.

<Highlight type="note">
This action requires the
[`decompress_backfill`](https://github.com/timescale/timescaledb-extras/blob/master/backfill.sql)
function from the TimescaleDB extras repository.
</Highlight>

<Procedure>

## Using a user-defined action to schedule regular backfilling

1.  Create a procedure that calls the `decompress_backfill` procedure. Use the
    procedure to backfill data from a source table into your hypertable.

    ```sql
    CREATE OR REPLACE PROCEDURE backfill_on_schedule (job_id int, config jsonb)
    LANGUAGE PLPGSQL
    AS $$
    DECLARE
      source_table regclass;
      destination_table regclass;
    BEGIN
      SELECT jsonb_object_field_text (
        config, 'staging_table'
      )::text INTO STRICT source_table;
      SELECT jsonb_object_field_text (
        config, 'destination_hypertable'
      )::text INTO STRICT destination_table;

      IF source_table IS NULL THEN
        RAISE EXCEPTION 'Config must provide the source table';
      END IF;

      CALL decompress_backfill(
        staging_table=>source_table,
        destination_hypertable=>destination_table
      );
    END
    $$;
    ```

1.  Register the job to run every 10 days. Set `staging_table` to the name of
    the table that contains your source data. Set `destination_hypertable` to
    the hypertable you want to backfill. Start the first run immediately.

    ```sql
    SELECT add_job(
      ‘backfill_on_schedule’,
      ‘10 days’,
      ’{“staging_table”:“backfill_event_data”, “destination_hypertable”:“event_data”}’,
      NOW()
    );
    ```

</Procedure>

[backfill]: /use-timescale/:currentVersion:/compression/backfill-historical-data/
