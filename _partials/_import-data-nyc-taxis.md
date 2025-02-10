Time-series data represents how a system, process, or behavior changes over time. [Hypertables][hypertables-section] 
are PostgreSQL tables that help you improve insert and query performance by automatically partition your data by 
time. Each hypertable is made up of child tables called chunks. Each chunk is assigned a range of time, and only
contains data from that range. 

<Procedure>

1.  **Import some time-series data into your hypertable**

   1. Unzip <Tag type="download">[nyc_data.tar.gz](https://assets.timescale.com/docs/downloads/nyc_data.tar.gz)</Tag> to a `<local folder>`.

      This test dataset contains historical data from New York's yellow taxi network.

      To import up to 100GB of data directly from your current PostgreSQL based database,
      [migrate with downtime][migrate-with-downtime] using native PostgreSQL tooling. To seamlessly import 100GB-10TB+
      of data, use the [live migration][migrate-live] tooling supplied by $COMPANY. To add data from non-PostgreSQL
      data sources, see [Import and ingest data][data-ingest].

   1. Upload data from the CSVs to your $SERVICE_SHORT:

      1. In Terminal, navigate to `<local folder>` and connect to your $SERVICE_SHORT.
         ```bash
         psql -d "postgres://<username>:<password>@<host>:<port>/<database-name>"
         ```
         The connection information for a $SERVICE_SHORT is available in the file you downloaded when you created it.

      2. Create tables for the data to import

         - For the time-series data:
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

         - For the relational data:

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

</Procedure>

[hypertables-section]: /use-timescale/:currentVersion:/hypertables/
[portal-ops-mode]: https://console.cloud.timescale.com/dashboard/services
[portal-data-mode]: https://console.cloud.timescale.com/dashboard/services?popsql
