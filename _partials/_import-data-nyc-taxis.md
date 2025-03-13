Time-series data represents how a system, process, or behavior changes over time. [Hypertables][hypertables-section] 
are PostgreSQL tables that help you improve insert and query performance by automatically partitioning your data by 
time, speeding up queries for real-time analytics and other challenging workloads. Each hypertable is made up of child 
tables called chunks. Each chunk is assigned a range of time, and only contains data from that range. 

<Procedure>

1.  **Import time-series data into a hypertable**

    1. Unzip <Tag type="download">[nyc_data.tar.gz](https://assets.timescale.com/docs/downloads/nyc_data.tar.gz)</Tag> to a `<local folder>`.
       
       This test dataset contains historical data from New York's yellow taxi network.

       To import up to 100GB of data directly from your current PostgreSQL based database,
       [migrate with downtime][migrate-with-downtime] using native PostgreSQL tooling. To seamlessly import 100GB-10TB+
       of data, use the [live migration][migrate-live] tooling supplied by $COMPANY. To add data from non-PostgreSQL
       data sources, see [Import and ingest data][data-ingest].

    1. In Terminal, navigate to `<local folder>` and update the following string with [your connection details][connection-info] 
      to connect to your $SERVICE_SHORT.
       
       ```bash
       psql -d "postgres://<username>:<password>@<host>:<port>/<database-name>?sslmode=require"
       ```

    1. Create tables to import time-series data:

          1. In your sql client, create a normal PostgreSQL table:

             ```sql
             CREATE TABLE "rides"(
               vendor_id TEXT,
               pickup_datetime TIMESTAMP WITHOUT TIME ZONE NOT NULL,
               dropoff_datetime TIMESTAMP WITHOUT TIME ZONE NOT NULL,
               passenger_count NUMERIC,
               trip_distance NUMERIC,
               pickup_longitude  NUMERIC,
               pickup_latitude   NUMERIC,
               rate_code         INTEGER,
               dropoff_longitude NUMERIC,
               dropoff_latitude  NUMERIC,
               payment_type INTEGER,
               fare_amount NUMERIC,
               extra NUMERIC,
               mta_tax NUMERIC,
               tip_amount NUMERIC,
               tolls_amount NUMERIC,
               improvement_surcharge NUMERIC,
               total_amount NUMERIC
             );
             ```

         1.  Convert `rides` to a hypertable and partitioned on time:
             ```sql
             SELECT create_hypertable('rides', by_range('pickup_datetime'), create_default_indexes=>FALSE);
             SELECT add_dimension('rides', by_hash('payment_type', 2));
             ```
             To more fully understand how hypertables work, and how to optimize them for performance by
             tuning chunk intervals and enabling chunk skipping, see [the hypertables documentation][hypertables-section].

         1.  Create an index to support efficient queries by vendor, rate code, and passenger count:
             ```sql
             CREATE INDEX ON rides (vendor_id, pickup_datetime DESC);
             CREATE INDEX ON rides (rate_code, pickup_datetime DESC);
             CREATE INDEX ON rides (passenger_count, pickup_datetime DESC);
             ```           

    1. Create tables for relational data:

         1.  Add a table to store the payment types data:
               
             ```sql
             CREATE TABLE IF NOT EXISTS "payment_types"(
               payment_type INTEGER,
               description TEXT
             );
             INSERT INTO payment_types(payment_type, description) VALUES
               (1, 'credit card'),
               (2, 'cash'),
               (3, 'no charge'),
               (4, 'dispute'),
               (5, 'unknown'),
               (6, 'voided trip');
             ```
      
         1.  Add a table to store the rates data:
      
             ```sql
             CREATE TABLE IF NOT EXISTS "rates"(
              rate_code   INTEGER,
              description TEXT
             );
             INSERT INTO rates(rate_code, description) VALUES
              (1, 'standard rate'),
              (2, 'JFK'),
              (3, 'Newark'),
              (4, 'Nassau or Westchester'),
              (5, 'negotiated fare'),
              (6, 'group ride');
             ```

      1. Upload the dataset to your $SERVICE_SHORT
         ```sql
         \COPY rides FROM nyc_data_rides.csv CSV;
         ```
      To more fully understand how hypertables work, and how to optimize them for performance by
      tuning chunk intervals and enabling chunk skipping, see [the hypertables documentation][hypertables-section].

1.  **Have a quick look at your data**

    You query hypertables in exactly the same way as you would a relational PostgreSQL table.
    Use one of the following SQL editors to run a query and see the data you uploaded:
       - **Data mode**:  write queries, visualize data, and share your results in [$CONSOLE][portal-data-mode] for all your $SERVICE_LONGs.
       - **SQL editor**: write, fix, and organize SQL faster and more accurately in [$CONSOLE][portal-ops-mode] for a $SERVICE_LONG.
       - **psql**: easily run queries on your $SERVICE_LONGs or self-hosted TimescaleDB deployment from Terminal.

    For example:
    - Display the number of rides for each fare type:
       ```sql
       SELECT rate_code, COUNT(vendor_id) AS num_trips
       FROM rides
       WHERE pickup_datetime < '2016-01-08'
       GROUP BY rate_code
       ORDER BY rate_code;
       ```
       This simple query runs in 3 seconds. You see something like:

       | rate_code | num_trips	|
       |-----------------|-----------|
       |1 |   2266401|
       |2 |     54832|
       |3 |      4126|
       |4 |       967|
       |5 |      7193|
       |6 |        17|
       |99 |        42|

    - To select all rides taken in the first week of January 2016, and return the total number of trips taken for each rate code:  
       ```sql
       SELECT rates.description, COUNT(vendor_id) AS num_trips
       FROM rides
       JOIN rates ON rides.rate_code = rates.rate_code
       WHERE pickup_datetime < '2016-01-08'
       GROUP BY rates.description
       ORDER BY LOWER(rates.description);
       ```
       On this large amount of data, this analytical query on data in the rowstore takes about 59 seconds. You see something like:
    
       | description	| num_trips	|
       |-----------------|-----------|    
       | group ride | 	17 |
       | JFK	 | 54832 |
       | Nassau or Westchester | 	967 |
       | negotiated fare | 	7193 |
       | Newark | 	4126 |
       | standard rate | 	2266401 |


</Procedure>

[hypertables-section]: /use-timescale/:currentVersion:/hypertables/
[portal-ops-mode]: https://console.cloud.timescale.com/dashboard/services
[portal-data-mode]: https://console.cloud.timescale.com/dashboard/services?popsql
[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
[migrate-with-downtime]: /migrate/:currentVersion:/pg-dump-and-restore/
[migrate-live]: /migrate/:currentVersion:/live-migration/
[data-ingest]: /use-timescale/:currentVersion:/ingest-data/

