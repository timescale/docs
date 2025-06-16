---
title: Integrate Supabase with Tiger Cloud
excerpt: Supabase is an open source Firebase alternative. Integrate Supabase with Tiger Cloud
products: [cloud, self_hosted]
keywords: [integrate]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";
import OldCreateHypertable from "versionContent/_partials/_old-api-create-hypertable.mdx";

# Integrate Supabase with $CLOUD_LONG

[Supabase][supabase] is an open source Firebase alternative. This page shows how to run real-time analytical queries 
against a $SERVICE_LONG through Supabase using a foreign data wrapper (fdw) to bring aggregated data from your 
$SERVICE_LONG.

## Prerequisites

<IntegrationPrereqs />

- Create a [Supabase project][supabase-new-project]

## Set up your $SERVICE_LONG

To set up a $SERVICE_LONG optimized for analytics to receive data from Supabase:

<Procedure>

1. **Optimize time-series data in hypertables**

   Time-series data represents how a system, process, or behavior changes over time. [Hypertables][hypertables-section]
   are PostgreSQL tables that help you improve insert and query performance by automatically partitioning your data by
   time.

   1. [Connect to your $SERVICE_LONG][connect] and create a table that will point to a Supabase database:
   
      ```sql
      CREATE TABLE signs (
          time timestamptz NOT NULL DEFAULT now(), 
          origin_time timestamptz NOT NULL, 
          name TEXT
      ) WITH (
        tsdb.hypertable,
        tsdb.partition_column='time'
      );
      ```
     <OldCreateHypertable />   

1. **Optimize cooling data for analytics**

   Hypercore is the hybrid row-columnar storage engine in $TIMESCALE_DB, designed specifically for real-time analytics 
   and powered by time-series data. The advantage of hypercore is its ability to seamlessly switch between row-oriented 
   and column-oriented storage. This flexibility enables $TIMESCALE_DB to deliver the best of both worlds, solving the
   key challenges in real-time analytics.

   ```sql
   ALTER TABLE signs SET (
     timescaledb.enable_columnstore = true, 
     timescaledb.segmentby = 'name'); 
   ```

1. **Create optimized analytical queries**

   Continuous aggregates are designed to make queries on very large datasets run
   faster. Continuous aggregates in $CLOUD_LONG use PostgreSQL [materialized views][postgres-materialized-views] to 
   continuously, and incrementally refresh a query in the background, so that when you run the query,
   only the data that has changed needs to be computed, not the entire dataset.

   1. Create a continuous aggregate pointing to the Supabase database.
   
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

   1. Setup a delay stats comparing `origin_time` to `time`.

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

   1. Setup a view to recieve the data from Supabase.

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

1. **Add refresh policies for your analytical queries**

   You use `start_offset` and `end_offset` to define the time range that the continuous aggregate will cover. Assuming
   that the data is being inserted without any delay, set the `start_offset` to `5 minutes` and the `end_offset` to
   `1 minute`. This means that the continuous aggregate is refreshed every minute, and the refresh covers the last 5
   minutes. 
   You set `schedule_interval` to `INTERVAL '1 minute'` so the continuous aggregate refreshes on your $SERVICE_LONG
   every minute. The data is accessed from Supabase, and the continuous aggregate is refreshed every minute in
   the other side.

   ```sql
   SELECT add_continuous_aggregate_policy('signs_per_minute',
    start_offset => INTERVAL '5 minutes',
    end_offset => INTERVAL '1 minute', 
    schedule_interval => INTERVAL '1 minute');
   ```
   Do the same thing for data inserted with a delay:
   ```sql
   SELECT add_continuous_aggregate_policy('_signs_per_minute_delay',
    start_offset => INTERVAL '5 minutes', 
    end_offset => INTERVAL '1 minute', 
    schedule_interval => INTERVAL '1 minute');
   ```

</Procedure>


## Set up a Supabase database 

To set up a Supabase database that injects data into your $SERVICE_LONG:

<Procedure>

1. **Connect a foreign server in Supabase to your $SERVICE_LONG**

   1. Connect to your Supabase project using Supabase dashboard or psql.
   1. Enable the `postgres_fdw` extension.
   
      ```sql
      CREATE EXTENSION postgres_fdw;
      ```
   1. Create a foreign server that points to your $SERVICE_LONG.

      Update the following command with your [connection details][connection-info], then run it 
      in the Supabase database:

      ```sql
      CREATE SERVER timescale
      FOREIGN DATA WRAPPER postgres_fdw
      OPTIONS (
          host '<value of host>',
          port '<value of port>',
          dbname '<value of dbname>',
          sslmode 'require',
          extensions 'timescaledb'
      );
      ```

1. **Create the user mapping for the foreign server**

   Update the following command with your [connection details][connection-info], the run it
   in the Supabase database:

   ```sql
   CREATE USER MAPPING FOR CURRENT_USER 
   SERVER timescale 
   OPTIONS (
      user '<value of user>', 
      password '<value of password>'
   ); 
   ```
   
1. **Create a foreign table that points to a table in your $SERVICE_LONG.**

   This query introduced the following columns:
   - `time`: with a default value of `now()`. This is because the `time` column is used by $CLOUD_LONG to optimize data
      in the columnstore.
   - `origin_time`: store the original timestamp of the data.
   
   Using both columns, you understand the delay between Supabase (`origin_time`) and the time the data is
   inserted into your $SERVICE_LONG (`time`).
   
   ```sql
   CREATE FOREIGN TABLE signs (
     TIME timestamptz NOT NULL DEFAULT now(),
     origin_time timestamptz NOT NULL,
     NAME TEXT) 
   SERVER timescale OPTIONS (
     schema_name 'public',
     table_name 'signs'
   );
   ```

1. **Create a foreign table in Supabase**

   1. Create a foreign table that matches the  `signs_per_minute` view in your $SERVICE_LONG. It represents a top level 
      view of the data.
   
      ```sql
      CREATE FOREIGN TABLE signs_per_minute (
       ts timestamptz, 
       name text, 
       total int
      ) 
      SERVER timescale OPTIONS (schema_name 'public', table_name 'signs_per_minute');
      ```

   1. Create a foreign table that matches the  `signs_per_minute_delay` view in your $SERVICE_LONG.
   
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

</Procedure>

## Test the integration 

To inject data into your $SERVICE_LONG from a Supabase database using a foreign table: 

<Procedure>

1. **Insert data into your Supabase database**

   Connect to Supabase and run the following query:

   ```sql
   INSERT INTO signs (origin_time, name) VALUES (now(), 'test')
   ```

1. **Check the data in your $SERVICE_LONG**

   [Connect to your $SERVICE_LONG][connect] and run the following query:

   ```sql
   SELECT * from signs;
   ```
   You see something like:

   | origin_time | time | name |
   |-------------|------|------|
   | 2025-02-27 16:30:04.682391+00 | 2025-02-27 16:30:04.682391+00 | test |

</Procedure>

You have successfully integrated Supabase with your $SERVICE_LONG.  

[supabase]: https://supabase.com/
[supabase-new-project]: https://supabase.com/dashboard/new
[hypertables-section]: /use-timescale/:currentVersion:/hypertables/
[connect]: /getting-started/:currentVersion:/run-queries-from-console/
[hypercore]: /use-timescale/:currentVersion:/hypercore/
[postgres-materialized-views]: https://www.postgresql.org/docs/current/rules-materializedviews.html
[connection-info]: /integrations/:currentVersion:/find-connection-details/
