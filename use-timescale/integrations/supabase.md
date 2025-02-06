# Integrating Supabase with Timescale

Bridge between Supabase and TimescaleDB.

Real-time analytics backend for Supabase. Running real-time analytical queries against Timescale through Supabase using a foreign data wrapper (fdw). This use-case hosts Supabase and uses a foreign data wrapper (fdw) to bring aggregated data from Timescale.

## Setup

1. Create your supabase project.

https://supabase.com/dashboard/new

2. Create a new postgres database.

Create environment variables:

```bash
export SUPABASE_USER=...
export SUPABASE_HOST=...
export SUPABASE_PORT=...
export SUPABASE_DB=postgres
export SUPABASE_PASS=...
export SUPABASE_URL=postgresql://${SUPABASE_USER}:${SUPABASE_PASS}@${SUPABASE_HOST}:${SUPABASE_PORT}/${SUPABASE_DB}
```


3. Setup the TimescaleDB instance

Create the variables:

```bash
export TIMESCALE_USER=tsdbadmin
export TIMESCALE_HOST=...
export TIMESCALE_PORT=...
export TIMESCALE_DB=tsdb
export TIMESCALE_PASS=...
export TIMESCALE_URL=postgresql://${TIMESCALE_USER}:${TIMESCALE_PASS}@${TIMESCALE_HOST}:${TIMESCALE_PORT}/${TIMESCALE_DB}?sslmode=require
```

Now, with the variables in place, we'll configure the the foreign data wrapper (fdw) on Supabase.


## Create the foreign server in supabase.

On the supabase database, we create a foreign server that points to the timescale database.

```sql
CREATE SERVER timescale
FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (
    host '$TIMESCALE_HOST',
    port '$TIMESCALE_PORT',
    dbname '$TIMESCALE_DB',
    sslmode 'require',
    extensions 'timescaledb'
);
```

Use the command line to bind the environment variables to the script.

```bash
psql $SUPABASE_URL -c "CREATE SERVER timescale FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host '$TIMESCALE_HOST', port '$TIMESCALE_PORT', dbname '$TIMESCALE_DB', sslmode 'require', extensions 'timescaledb')"
```

## Create the user mapping for the foreign server.

On the supabase database, we create a user mapping that maps the current user to the timescale database.

```sql
CREATE USER MAPPING FOR CURRENT_USER SERVER timescale OPTIONS (user '$TIMESCALE_USER', password '$TIMESCALE_PASS'); ```

Note that the [run_full_example.sh](./run_full_example.sh) script uses the environment variables to set the server host and also the user and password. You can also set the user and password directly in the script.

```bash
psql -c "CREATE USER MAPPING FOR CURRENT_USER SERVER timescale OPTIONS (user '$TIMESCALE_USER', password '$TIMESCALE_PASS')" $SUPABASE_URL
```

## Create a table to test the foreign data wrapper.

On the supabase database, we create a foreign table that points to the timescale database.

```sql
CREATE FOREIGN TABLE signs (time timestamptz NOT NULL DEFAULT now(), origin_time timestamptz NOT NULL, name TEXT) SERVER timescale OPTIONS (schema_name 'public' , table_name 'signs');
```

Note that we introduced the `time` column with a default value of `now()`. This is because the `time` column is being used by Timescale to compress the data. We also added the `origin_time` column to the table to store the original timestamp of the data.
With both columns, we can also understand the delay between supabase (the origin_time) and the time the data is being inserted into the timescale database (the time column).

## Create a hypertable in TimescaleDB.

TimescaleDB is a time-series extension for Postgres. It's also offered as a hosted service by Timescale.

On the Timescale database, we create a hypertable that is pointing to the supabase database.

```sql
CREATE TABLE signs (
    time timestamptz NOT NULL DEFAULT now(), 
    origin_time timestamptz NOT NULL, 
    name TEXT
);
```

Timescale also allows to compress the data by the `name` column.

```sql
SELECT create_hypertable('signs', by_range('time')); 
ALTER TABLE signs SET (timescaledb.compress, timescaledb.compress_segmentby = 'name'); 
```

## Setup continuous aggregates.

On the Timescale database, we create a continuous aggregate that is pointing to the supabase database.

```sql
CREATE MATERIALIZED VIEW IF NOT EXISTS signs_per_minute
WITH (timescaledb.continuous)
AS
SELECT time_bucket('1 minute', time) as ts,
 name, 
 count(*) as total 
FROM signs 
GROUP BY 1, 2 
WITH NO DATA;
```

Let's setup a delay stats comparing the origin_time to the time.

```sql
CREATE MATERIALIZED VIEW IF NOT EXISTS _signs_per_minute_delay
WITH (timescaledb.continuous)
AS
SELECT time_bucket('1 minute', time) as ts, 
stats_agg(extract(epoch from origin_time - time)::float8) as delay_agg, 
candlestick_agg(time, extract(epoch from origin_time - time)::float8, 1) as delay_candlestick 
FROM signs GROUP BY 1 
WITH NO DATA;
```

Let's also setup a view to access the data from Supabase.

```sql
CREATE VIEW signs_per_minute_delay
AS
  SELECT ts, 
  average(delay_agg) as avg_delay, 
  stddev(delay_agg) as stddev_delay, 
  open(delay_candlestick) as open, 
  high(delay_candlestick) as high, 
  low(delay_candlestick) as low, 
  close(delay_candlestick) as close 
FROM _signs_per_minute_delay
```

## Create a foreign table in Supabase.

On the supabase database, we create a foreign table that points to each view in the timescale database. It should be representing the top level view of the data.

For the `signs_per_minute`:

```sql
CREATE FOREIGN TABLE signs_per_minute (
    ts timestamptz, 
    name text, 
    total int
) SERVER timescale OPTIONS (schema_name 'public', table_name 'signs_per_minute');
```

In the case of the `signs_per_minute_delay` view, we are creating a foreign table that points to the view.

```sql
CREATE FOREIGN TABLE signs_per_minute_delay (
    ts timestamptz, 
    avg_delay float8, 
    stddev_delay float8, 
    open float8, 
    high float8, 
    low float8, 
    close float8
) SERVER timescale OPTIONS (schema_name 'public', table_name 'signs_per_minute_delay');
```

In the Timescale database, add refresh policies to the continuous aggregates.


```sql
SELECT add_continuous_aggregate_policy('signs_per_minute',
 start_offset => INTERVAL '5 minutes',
 end_offset => INTERVAL '1 minute', 
 schedule_interval => INTERVAL '1 minute');
SELECT add_continuous_aggregate_policy('_signs_per_minute_delay',
 start_offset => INTERVAL '5 minutes', 
 end_offset => INTERVAL '1 minute', 
 schedule_interval => INTERVAL '1 minute');
```

The `start_offset` and `end_offset` are used to define the time range that the continuous aggregate will cover. Believing that the data is being inserted without any delay, we set the `start_offset` to `5 minutes` and the `end_offset` to `1 minute`. This means that the continuous aggregate will be refreshed every minute, covering the last 5 minutes.

Note that the `schedule_interval` is set to `INTERVAL '1 minute'`, so the continuous aggregate will be refreshed every minute. It will run only on the Timescale database. The data is being accessed from Supabase, and the continuous aggregate is being refreshed every minute in the other side.

## Insert data

Now, we can insert data on the foreign table to see the magical backfill to the hypertable.

```bash
psql $SUPABASE_URL -c "INSERT INTO signs (origin_time, name) VALUES (now(), 'test')"
```

Note that the `now()` is the origin_time and the `time` is the current timestamp in the default of timescaledb server. It will allow us to measure the delay between the origin_time and the time.


