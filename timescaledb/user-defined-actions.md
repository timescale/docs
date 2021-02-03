# User-Defined Actions

User-defined actions allow you to run functions and procedures implemented in a
language of your choice on a schedule within TimescaleDB. This allows
automatic periodic tasks that are not covered by existing policies and
even enhancing existing policies with additional functionality.

### Creating Procedures for Actions [](create)

The signature for actions is `(job_id INT, config JSONB)`. It can either
be implemented as [function][postgres-createfunction] or
[procedure][postgres-createprocedure].
The content of the config JSONB is completely up to the job and may
also be NULL if no parameters are required.

Template for a procedure.

```sql
CREATE OR REPLACE PROCEDURE user_defined_action(job_id int, config jsonb) LANGUAGE PLPGSQL AS
$$
BEGIN
	RAISE NOTICE 'Executing job % with config %', job_id, config;
END
$$;
```

### Registering Actions [](register)

In order to register your action for execution within TimescaleDB's
job scheduler, you next need to [`add_job`][api-add_job] with the name of your action
as well as the schedule on which it is run.

When registered, the action's `job_id` and `config` are stored in the
TimescaleDB catalog. The `config` JSONB can be modified with [`alter_job`][api-alter_job].
`job_id` and `config` will be passed as arguments when the procedure is
executed as background process or when expressly called with [`run_job`][api-run_job].

Register the created job with the automation framework. `add_job` returns the job_id
which can be used to execute the job manually with `run_job`:

```sql
SELECT add_job('user_defined_action','1h', config => '{"hypertable":"metr"}');
```

To get a list of all currently registered jobs you can query 
[`timescaledb_information.jobs`][api-timescaledb_information-jobs]:

```sql
SELECT * FROM timescaledb_information.jobs;
```

### Testing and Debugging Jobs [](testing)

Any background worker job can be run in foreground when executed with [`run_job`][api-run_job]. 
This can be useful to debug problems when combined with increased log level.

Since `run_job` is implemented as stored procedure it cannot be executed
inside a SELECT query but has to be executed with [CALL][postgres-call].

Set log level shown to client to `DEBUG1` and run the job with the job id 1000:

```sql
SET client_min_messages TO DEBUG1;
CALL run_job(1000);
```

### Altering and Dropping Actions [](alter-delete)

You can alter the config or scheduling parameters with [`alter_job`][api-alter_job].

Replace the entire JSON config for job with id 1000 with the specified JSON:

```sql
SELECT alter_job(1000, config => '{"hypertable":"metrics"}');
```

Disable automatic scheduling of the job with id 1000. The job can still be run manually
with `run_job`:

```sql
SELECT alter_job(1000, scheduled => false);
```

Reenable automatic scheduling of the job with id 1000:

```sql
SELECT alter_job(1000, scheduled => true);
```

Delete the job with id 1000 from the automation framework with [`delete_job`][api-delete_job]:

```sql
SELECT delete_job(1000);
```


## Examples [](examples)

The following section provides a number of examples of user-defined actions
that you can specify and subsequently schedule as part of TimescaleDB's
automation framework.

### Generic Retention [](generic-retention)

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

### Downsample and Compress [](downsample-compress)

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

[api-add_job]: /api#add_job
[api-alter_job]: /api#alter_job
[api-delete_job]: /api#delete_job
[api-run_job]: /api#run_job
[api-move_chunk]: /api#move_chunk
[api-timescaledb_information-jobs]: /api#timescaledb_information-jobs
[postgres-call]: https://www.postgresql.org/docs/current/sql-call.html
[postgres-createfunction]: https://www.postgresql.org/docs/current/sql-createfunction.html
[postgres-createprocedure]: https://www.postgresql.org/docs/current/sql-createprocedure.html
