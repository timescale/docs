---
title: User-defined actions
excerpt: Set up user-defined actions to run tasks on a schedule
keywords: [actions]
tags: [user-defined actions, background jobs, scheduled jobs]
---

# User-defined actions

User-defined actions allow you to run functions and procedures implemented in a
language of your choice on a schedule within TimescaleDB. This allows
automatic periodic tasks that are not covered by existing policies, or the
ability to enhance existing policies with additional functionality.

User-defined actions have allow free-form configuration through a JSONB object
which allows endless flexibility and reusability.

## Examples [](examples)

The following section provides a number of examples of user-defined actions
that you can specify and subsequently schedule as part of TimescaleDB's
automation framework.

### Generic retention [](generic-retention)

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

### Tiered Storage [](tiered-storage)

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
  WHERE pgts.spcname != destination
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
[`move_chunk`][api-move_chunk]. The `move_chunk` function also requires an
index as input, but performs data re-ordering as part of the move (for faster
subsequent queries) and requires lower lock levels, so the chunk remains available
for reads during the move.

### Downsample and compress [](downsample-compress)

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

### Set up a table and procedure

Set up a simple table and procedure:
```sql
CREATE TABLE IF NOT EXISTS times(time timestamptz);

CREATE OR REPLACE PROCEDURE add_time(job_id int, config jsonb)
LANGUAGE PLPGSQL
AS $$
BEGIN
  INSERT INTO times VALUES (now());  
END
$$;

CALL add_time(null, '{}');

SELECT * from times;
```

Returns:
```sql
|time                         |
|-----------------------------|
|2021-12-27 10:50:28.449 -0600|
```

Register a job to run every 5 seconds and return a `job_id`:
```sql
SELECT add_job('add_time', '5 secs');
```

Returns:
```sql
|add_job|
|-------|
|1000   |
```

Wait for some jobs to run, then view the results:
```sql
SELECT * from times;
```

Returns:
```sql
|time                         |
|-----------------------------|
|2021-12-27 10:50:28.449 -0600|
|2021-12-27 10:50:38.825 -0600|
|2021-12-27 10:50:44.164 -0600|
|2021-12-27 10:50:49.207 -0600|
|...|
```

See running jobs:
```sql
SELECT job_id, total_runs, total_failures, total_successes
FROM timescaledb_information.job_stats;
```

Returns:
```sql
|job_id|total_runs|total_failures|total_successes|
|------|----------|--------------|---------------|
|1000  |9         |0             |9              |
```

Stop or delete the job:
```sql
SELECT delete_job(1000);
```

[api-move_chunk]: /api/:currentVersion:/hypertable/move_chunk
