import CreateHypertablePolicyNote from "versionContent/_partials/_create-hypertable-columnstore-policy-note.mdx";
import HypertableIntro from "versionContent/_partials/_tutorials_hypertable_intro.mdx";

<HypertableIntro />

<Procedure>

1.  **Import time-series data into a $HYPERTABLE**

    1. Unzip <Tag type="download">[nyc_data.tar.gz](https://assets.timescale.com/docs/downloads/nyc_data.tar.gz)</Tag> to a `<local folder>`.
       
       This test dataset contains historical data from New York's yellow taxi network.

       To import up to 100GB of data directly from your current $PG-based database,
       [migrate with downtime][migrate-with-downtime] using native $PG tooling. To seamlessly import 100GB-10TB+
       of data, use the [live migration][migrate-live] tooling supplied by $COMPANY. To add data from non-$PG
       data sources, see [Import and ingest data][data-ingest].

    1. In Terminal, navigate to `<local folder>` and update the following string with [your connection details][connection-info] 
      to connect to your $SERVICE_SHORT.
       
       ```bash
       psql -d "postgres://<username>:<password>@<host>:<port>/<database-name>?sslmode=require"
       ```

    1. Create an optimized $HYPERTABLE for your time-series data:

          1. Create a [$HYPERTABLE][hypertables-section] with [$HYPERCORE][hypercore] enabled by default for your
             time-series data using [CREATE TABLE][hypertable-create-table]. For [efficient queries][secondary-indexes]
             on data in the columnstore, remember to `segmentby` the column you will use most often to filter your data.

             In your sql client, run the following command:

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
             ) WITH (
               tsdb.hypertable,
               tsdb.create_default_indexes=false,
               tsdb.segmentby='vendor_id',
               tsdb.orderby='pickup_datetime DESC'
             );
             ```
             <CreateHypertablePolicyNote />
   
         1.  Add another dimension to partition your $HYPERTABLE more efficiently:
             ```sql
             SELECT add_dimension('rides', by_hash('payment_type', 2));
             ```

         1.  Create an index to support efficient queries by vendor, rate code, and passenger count:
             ```sql
             CREATE INDEX ON rides (vendor_id, pickup_datetime DESC);
             CREATE INDEX ON rides (rate_code, pickup_datetime DESC);
             CREATE INDEX ON rides (passenger_count, pickup_datetime DESC);
             ```           

    1. Create $PG tables for relational data:

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

1.  **Have a quick look at your data**

    You query $HYPERTABLEs in exactly the same way as you would a relational $PG table.
    Use one of the following SQL editors to run a query and see the data you uploaded:
       - **$DATA_MODE_CAP**:  write queries, visualize data, and share your results in [$CONSOLE][portal-data-mode] for all your $SERVICE_LONGs.
       - **SQL editor**: write, fix, and organize SQL faster and more accurately in [$CONSOLE][portal-ops-mode] for a $SERVICE_LONG.
       - **psql**: easily run queries on your $SERVICE_LONGs or $SELF_LONG deployment from Terminal.

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
[portal-data-mode]: https://console.cloud.timescale.com/dashboard/data-view?popsql
[connection-info]: /integrations/:currentVersion:/find-connection-details/
[migrate-with-downtime]: /migrate/:currentVersion:/pg-dump-and-restore/
[migrate-live]: /migrate/:currentVersion:/live-migration/
[data-ingest]: /use-timescale/:currentVersion:/ingest-data/
[hypertable-create-table]: /api/:currentVersion:/hypertable/create_table/
[hypercore]: /use-timescale/:currentVersion:/hypercore/
[hypertables-section]: /use-timescale/:currentVersion:/hypertables/
[hypertable-create-table]: /api/:currentVersion:/hypertable/create_table/
[hypercore]: /use-timescale/:currentVersion:/hypercore/
[secondary-indexes]: /use-timescale/:currentVersion:/hypercore/secondary-indexes/
