# Schedule backfill
Regularly backfill data into a compressed hypertable. For this action, you
create a procedure that:
*   Decompresses compressed chunks
*   Inserts batched data from a staging table into the decompressed chunks
*   Recompresses the chunks

You can then schedule the procedure to occur at regular intervals.

<highlight type="note">
This action requires the
[`decompress_backfill`](https://github.com/timescale/timescaledb-extras/blob/master/backfill.sql)
function from the TimescaleDB extras repository.
</highlight>

Create the procedure:
```sql
CREATE OR REPLACE PROCEDURE backfill_on_schedule (job_id int, config jsonb)
LANGUAGE PLPGSQL
AS $$
DECLARE
  source_table regclass;
  destination_table regclass;
BEGIN
  SELECT jsonb_object_field_text (config, 'staging_table')::text INTO STRICT source_table;
  SELECT jsonb_object_field_text (config, 'destination_hypertable')::text INTO STRICT destination_table;

  IF source_table IS NULL THEN
    RAISE EXCEPTION 'Config must provide the source table';
  END IF;

  CALL decompress_backfill(staging_table=>source_table, destination_hypertable=>destination_table);
END
$$;
```

Schedule the backfilling job to occur every 10 days. The example uses a
hypertable named `event_data`. The data to be backfilled is stored in an
intermediate table named `backfill_event_data`.
```sql
SELECT add_job(
  ‘backfill_on_schedule’,
  ‘10 days’,
  ’{“staging_table”:“backfill_event_data”, “destination_hypertable”:“event_data”}’,
  NOW()
);
```
