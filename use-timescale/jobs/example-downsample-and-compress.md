---
title: Use a job to downsample and compress chunks
excerpt: Downsample and compress your hypertable chunks by combining a continuous aggregate refresh policy with compression. Not quite what you need? Create a custom job
products: [cloud, mst, self_hosted]
keywords: [jobs, compression, downsample]
---

# Use a $JOB to downsample and compress $CHUNKs

Timescale lets you downsample and compress $CHUNKs by combining a
[$CAGG refresh policy][cagg-refresh] with a
[compression policy][compression].

If you want to implement features not supported by those policies, you can write
a $JOB to downsample and compress $CHUNKs instead. The following
example downsamples raw data to an average over hourly data. This is an
illustrative example, which can be done more simply with a $CAGG
policy. But you can make the query arbitrarily complex.

<Procedure>

1.  Create a procedure that first queries the $CHUNKs of a $HYPERTABLE to
    determine if they are older than the `lag` parameter. The $HYPERTABLE in this
    example is named `metrics`. If the $CHUNK is not already compressed,
    downsample it by taking the average of the raw data. Then compress it. A
    temporary table is used to store the data while calculating the average.

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

1.  Register the $JOB to run daily. In the `config`, set `lag` to 12 months
    to drop $CHUNKs containing data older than 12 months.

    ```sql
    SELECT add_job('downsample_compress','1d', config => '{"lag":"12 month"}');
    ```

</Procedure>

[cagg-refresh]: /use-timescale/:currentVersion:/continuous-aggregates/create-a-continuous-aggregate/
[compression]: /use-timescale/:currentVersion:/compression/
