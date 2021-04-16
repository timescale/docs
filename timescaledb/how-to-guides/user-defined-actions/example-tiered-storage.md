# Tiered Storage

Action that moves chunks older than a certain time to a different tablespace.

```sql
CREATE OR REPLACE PROCEDURE move_chunks (job_id int, config jsonb)
LANGUAGE PLPGSQL
AS $$
DECLARE
  ht REGCLASS;
  lag interval;
  destination name;
  chunk REGCLASS;
  tmp_name name;
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
  WHERE pgts.spcname != destination;
  LOOP
    RAISE NOTICE 'Moving chunk: %', chunk::text;
    EXECUTE format('ALTER TABLE %s SET TABLESPACE %I;', chunk, destination);
  END LOOP;
END
$$;
```

Register job to run daily moving chunks older than 12 months on hypertable
metrics to tablespace old_chunks.

```sql
SELECT add_job('move_chunks','1d', config => '{"hypertable":"metrics","lag":"12 month","tablespace":"old_chunks"}');
```

The above action uses the simpler `ALTER TABLE ... SET TABLESPACE` for moving
a chunk, but it could alternatively be written in terms of TimescaleDB's
[`move_chunk`][api-move_chunk].  The `move_chunk` function also requires an
index as input, but performs data re-ordering as part of the move (for faster
subsequent queries) and requires lower lock levels, so the chunk remains available
for reads during the move.


[api-move_chunk]: /api-reference/:currentVersion:/hypertables/move_chunk
