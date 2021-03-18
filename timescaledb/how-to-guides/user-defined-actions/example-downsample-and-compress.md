## Downsample and Compress [](downsample-compress)

Action that downsamples and compresses chunks on hypertable `metrics`
older than a certain age. The example query computes a simple `avg` over
hourly data for downsampling, but this query can be arbitrarily complex.

```sql
CREATE OR REPLACE PROCEDURE downsample_compress (job_id int, config jsonb)
LANGUAGE PLPGSQL
AS $$
DECLARE
  lag interval;
  chunk REGCLASS;
  tmp_name name;
BEGIN
  SELECT jsonb_object_field_text (config, 'lag')::interval INTO STRICT lag;

  IF lag IS NULL THEN
    RAISE EXCEPTION 'Config must have lag';
  END IF;

  FOR chunk IN
    SELECT show.oid
    FROM show_chunks('metrics', older_than => lag) SHOW (oid)
      INNER JOIN pg_class pgc ON pgc.oid = show.oid
      INNER JOIN pg_namespace pgns ON pgc.relnamespace = pgns.oid
      INNER JOIN timescaledb_information.chunks chunk ON chunk.chunk_name = pgc.relname
        AND chunk.chunk_schema = pgns.nspname
    WHERE chunk.is_compressed::bool = FALSE
  LOOP
    RAISE NOTICE 'Processing chunk: %', chunk::text;

    -- build name for temp table
    SELECT '_tmp' || relname
    FROM pg_class
    WHERE oid = chunk INTO STRICT tmp_name;

    -- copy downsampled chunk data into temp table
    EXECUTE format($sql$ CREATE UNLOGGED TABLE %I AS
      SELECT time_bucket('1h', time), device_id, avg(value) FROM %s GROUP BY 1, 2;
    $sql$, tmp_name, chunk);

    -- clear original chunk
    EXECUTE format('TRUNCATE %s;', chunk);

    -- copy downsampled data back into chunk
    EXECUTE format('INSERT INTO %s(time, device_id, value) SELECT * FROM %I;', chunk, tmp_name);

    -- drop temp table
    EXECUTE format('DROP TABLE %I;', tmp_name);

    PERFORM compress_chunk (chunk);

    COMMIT;
  END LOOP;
END
$$;
```

Register job to run daily downsampling and compressing chunks older than
12 months.

```sql
SELECT add_job('downsample_compress','1d', config => '{"lag":"12 month"}');
```