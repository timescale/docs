---
title: Try the key Timescale features
excerpt: Improve database performance with hypertables, time bucketing, compression and continuous aggregates.
products: [cloud]
content_group: Getting started
---

import HASetup from 'versionContent/_partials/_high-availability-setup.mdx';
import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Try the key Timescale features

$CLOUD_LONG scales PostgreSQL to ingest and query vast amounts of live data. $CLOUD_LONG 
provides a range of features and optimizations that supercharge your queries while keeping the 
costs down. For example: 
* The Hypercore row-columnar engine makes queries up to 350x faster, ingests 44% faster, and reduces storage by 90%.
* Tiered storage seamlessly moves your data from high performance storage for frequently accessed data to low cost bottomless storage for rarely accessed data. 

The following figure shows how $CLOUD_LONG optimizes your data for superfast real-time analytics and reduced
costs:

![Main features and tiered data](https://assets.timescale.com/docs/images/timescalecloud-service-architecture.png )

This page shows you how to rapidly implement the features in $CLOUD_LONG that enable you to 
ingest and query data faster while keeping the costs low. 

## Prerequisites

<IntegrationPrereqs />

## Optimize time-series data in hypertables

Time-series data represents how a system, process, or behavior changes over time. Hypertables are PostgreSQL tables 
that help you improve insert and query performance by automatically partitioning your data by time. Each hypertable 
is made up of child tables called chunks. Each chunk is assigned a range of time, and only
contains data from that range. You can also tune hypertables to increase performance
even more. 

![Main features and tiered data](https://assets.timescale.com/docs/images/hypertable-structure.png )

Hypertables exist alongside regular PostgreSQL tables.
You use regular PostgreSQL tables for relational data, and interact with hypertables
and regular PostgreSQL tables in the same way. 

This section shows you how to create regular tables and hypertables, and import
relational and time-series data from external files.

<Procedure>

1.  **Import some time-series data into your hypertable**

    1. Unzip <Tag type="download">[crypto_sample.zip](https://assets.timescale.com/docs/downloads/candlestick/crypto_sample.zip)</Tag> to a `<local folder>`.

       This test dataset contains second-by-second trade data for the most-traded crypto-assets
       and a regular table of asset symbols and company names.  

       To import up to 100GB of data directly from your current PostgreSQL-based database, 
       [migrate with downtime][migrate-with-downtime] using native PostgreSQL tooling. To seamlessly import 100GB-10TB+ 
       of data, use the [live migration][migrate-live] tooling supplied by $COMPANY. To add data from non-PostgreSQL
       data sources, see [Import and ingest data][data-ingest].

    1. Upload data from the CSVs to your $SERVICE_SHORT:
    
       <Tabs label="Upload data to ">

       <Tab title="Timescale Console">
       
          The $CONSOLE data upload creates the tables for you from the data you are uploading:
          1. In [$CONSOLE][portal-ops-mode], select the service to add data to, then click `Actions` > `Upload CSV`.
          1. Drag `<local folder>/tutorial_sample_tick.csv` to `Upload .CSV` and change `New table name` to `crypto_ticks`.
          1. Enable `hypertable partition` for the `time` column and click `Upload CSV`.
       
              The upload wizard creates a hypertable containing the data from the CSV file.
          1. When the data is uploaded, close `Upload .CSV`.
       
              If you want to  have a quick look at your data, press `Run` .
          1. Repeat the process with `<local folder>/tutorial_sample_assets.csv` and rename to `crypto_assets`.
       
              There is no time-series data in this table, so you don't see the  `hypertable partition` option.

       </Tab>
        
       <Tab title="psql">

       1. In Terminal, navigate to `<local folder>` and connect to your $SERVICE_SHORT.
          ```bash
          psql -d "postgres://<username>:<password>@<host>:<port>/<database-name>"
          ```
          You use your [connection details][connection-info] to fill in this PostgreSQL connection string.
      
       2. Create tables for the data to import:
      
          - For the time-series data:
             1. In your sql client, create a normal PostgreSQL table:
      
                ```sql
                CREATE TABLE crypto_ticks (
                  "time" TIMESTAMPTZ,
                  symbol TEXT,
                  price DOUBLE PRECISION,
                  day_volume NUMERIC
                );
                ```
             1.  Convert `crypto_ticks` to a hypertable:
                ```sql
                SELECT create_hypertable('crypto_ticks', by_range('time'));
                ```
                To more fully understand how hypertables work, and how to optimize them for performance by
                tuning chunk intervals and enabling chunk skipping, see [the hypertables documentation][hypertables-section].

          - For the relational data:
      
             In your sql client, create a normal PostgreSQL table:
             ```sql
             CREATE TABLE crypto_assets (
              symbol TEXT NOT NULL,
              name TEXT NOT NULL
             );
            ```

       3. Upload the dataset to your $SERVICE_SHORT:
       
          ```sql
          \COPY crypto_ticks from './tutorial_sample_tick.csv' DELIMITER ',' CSV HEADER;
          ```

          ```sql
          \COPY crypto_assets from './tutorial_sample_assets.csv' DELIMITER ',' CSV HEADER;
          ```
        
       </Tab>
        
       </Tabs>
   
    To more fully understand how hypertables work, and how to optimize them for performance by
    tuning chunk intervals and enabling chunk skipping, see [the hypertables documentation][hypertables-section].

1.  **Have a quick look at your data**  

    You query hypertables in exactly the same way as you would a relational PostgreSQL table.
    Use one of the following SQL editors to run a query and see the data you uploaded:
    - **Data mode**:  write queries, visualize data, and share your results in [$CONSOLE][portal-data-mode] for all your $SERVICE_LONGs.
    - **SQL editor**: write, fix, and organize SQL faster and more accurately in [$CONSOLE][portal-ops-mode] for a $SERVICE_LONG.
    - **psql**: easily run queries on your $SERVICE_LONGs or self-hosted TimescaleDB deployment from Terminal.

    <TryItOutCodeBlock queryId="getting-started-crypto-srt-orderby" />

</Procedure>

## Write fast and efficient analytical queries

Aggregation is a way of combing data to get insights from it. Average, sum, and count are all 
examples of simple aggregates. However, with large amounts of data, aggregation slows things down, quickly.
Continuous aggregates are a kind of hypertable that is refreshed automatically in 
the background as new data is added, or old data is modified. Changes to your dataset are tracked, 
and the hypertable behind the continuous aggregate is automatically updated in the background.

![Reduced data calls with Continuous Aggregates](https://assets.timescale.com/docs/images/continuous-aggregate.png )

You create continuous aggregates on uncompressed data in high-performance storage. They continue to work 
on [data in the columnstore][test-drive-enable-compression]
and [rarely accessed data in tiered storage][test-drive-tiered-storage]. You can even
create [continuous aggregates on top of your continuous aggregates][hierarchical-caggs].

You use time buckets to create a continuous aggregate. Time buckets aggregate data in hypertables by time 
interval. For example, a 5-minute, 1-hour, or 3-day bucket. The data grouped in a time bucket uses a single 
timestamp. Continuous aggregates minimize the number of records that you need to look up to perform your 
query.

This section shows you how to run fast analytical queries using time buckets and continuous aggregates in
$CONSOLE. You can also do this using psql. 

<Tabs label="Upload data to ">

<Tab title="SQL Editor">

<Procedure>

1. **In [$CONSOLE][portal-ops-mode], select the service you uploaded data to, then click `SQL Editor`**

1.  **Create a continuous aggregate**

    For a continuous aggregate, data grouped using a time bucket is stored in a
    PostgreSQL `MATERIALIZED VIEW` in a hypertable. `timescaledb.continuous` ensures that this data
    is always up to date.
    In your SQL editor, use the following code to create a continuous aggregate on the real-time data in
    the `crypto_ticks` table:

    ```sql
    CREATE MATERIALIZED VIEW assets_candlestick_daily
    WITH (timescaledb.continuous) AS
    SELECT
      time_bucket('1 day', "time") AS day,
      symbol,
      max(price) AS high,
      first(price, time) AS open,
      last(price, time) AS close,
      min(price) AS low
    FROM crypto_ticks srt
    GROUP BY day, symbol;
    ```

    This continuous aggregate creates the [candlestick chart][charts] data you use to visualize
    the price change of an asset.

1. **Create a policy to refresh the view every hour**

   ```sql
   SELECT add_continuous_aggregate_policy('assets_candlestick_daily',
   start_offset => INTERVAL '3 weeks',
   end_offset => INTERVAL '24 hours',
   schedule_interval => INTERVAL '3 hours');
   ```

1.  **Have a quick look at your data**

    You query continuous aggregates exactly the same way as your other tables. To query the `assets_candlestick_daily`
    continuous aggregate for all assets:

    <TryItOutCodeBlock queryId="getting-started-crypto-cagg" />


</Procedure>

</Tab>

<Tab title="Continuous aggregate wizard">

<Procedure>

1. **In [$CONSOLE][portal-ops-mode], select the service you uploaded data to**.
1. **Click `Operations` > `Continuous aggregates`, select `crypto_ticks`, then click `Create a Continuous Aggregate`**.
   ![Continuous aggregate wizard](https://assets.timescale.com/docs/images/continuous-aggregate-wizard.png )
1. **Create a view called `assets_candlestick_daily` on the `time` column with an interval of `1 day`, then click `Next step`**.
1. **Update the view SQL with the following functions, then click `Run`**
   ```sql
   CREATE MATERIALIZED VIEW assets_candlestick_daily
   WITH (timescaledb.continuous) AS
   SELECT 
     time_bucket('1 day', "time") AS bucket,
     symbol,
     max(price) AS high,
     first(price, time) AS open,
     last(price, time) AS close,
     min(price) AS low
   FROM "public"."crypto_ticks" srt
   GROUP BY bucket, symbol;
    ```
1. **When the view is created, click `Next step`**
1. **Define a refresh policy with the following values:**
   - `How far back do you want to materialize?`: `3 weeks`
   - `What recent data to exclude?`: `24 hours`
   - `How often do you want the job to run?`: `3 hours`
1. **Click `Next step`, then click `Run`**

$CLOUD_LONG creates the continuous aggregate and displays the aggregate ID in $CONSOLE. Click `DONE` to close the wizard.

</Procedure>

</Tab>

</Tabs>       

To see the change in terms of query time and data returned between a regular query and
a continuous aggregate, run the query part of the continuous aggregate
( `SELECT ...GROUP BY day, symbol;` ) and compare the results.


## Enhance query performance for analytics

Hypercore is the $TIMESCALE_DB hybrid row-columnar storage engine, designed specifically for real-time analytics and 
powered by time-series data. The advantage of Hypercore is its ability to seamlessly switch between row-oriented and 
column-oriented storage. This flexibility enables Timescale Cloud to deliver the best of both worlds, solving the key 
challenges in real-time analytics.

![Move from rowstore and columstore in hypercore](https://assets.timescale.com/docs/images/hypercore.png )

When you convert chunks from the rowstore to the columnstore, multiple records are grouped into a single row.
The columns of this row hold an array-like structure that stores all the data. Because a single row takes up less disk 
space, you can reduce your chunk size by more than 90%, and can also speed up your queries. This saves on storage costs, 
and keeps your queries operating at lightning speed.

Best practice is to compress data that is no longer needed for highest performance queries, but is still accessed 
regularly. For example, last week's market data.

<Procedure>

1. **Enable Hypercore on a hypertable**

   Create a [job][job] that automatically moves chunks in a hypertable to the columnstore at a specific time interval.

   ```sql
   ALTER TABLE crypto_ticks SET (
      timescaledb.enable_columnstore = true, 
      timescaledb.segmentby = 'symbol');
   ```
   You [segmentby][alter-table-arguments] to speed up queries.   


1. **Add a policy to convert chunks to the columnstore at a specific time interval**

   For example, yesterday's data:
   ``` sql
   CALL add_columnstore_policy('crypto_ticks', after => INTERVAL '1d');
   ```
   See [add_columnstore_policy][add_columnstore_policy].
 
1. **View your data space saving**

   When you convert data to the columnstore, as well as being optimized for analytics, it is compressed by more than 
   90%. This saves on storage costs and keeps your queries operating at lightning speed. To see the amount of space 
   saved:
   ``` sql
   SELECT
     pg_size_pretty(before_compression_total_bytes) as before,
     pg_size_pretty(after_compression_total_bytes) as after
   FROM hypertable_compression_stats('crypto_ticks');
   ```
   You see something like:

   | Before | After   |
   |--------|---------|
   | 32 MB  | 3808 KB |


</Procedure>


## Slash storage charges 

In the previous sections, you used continuous aggregates to make fast analytical queries, and 
compression to reduce storage costs on frequently accessed data. To reduce storage costs even more, 
you create tiering policies to move rarely accessed data to the object store. The object store is 
low-cost bottomless data storage built on Amazon S3. However, no matter the tier, you can 
[query your data when you need][querying-tiered-data]. $CLOUD_LONG seamlessly accesses the correct storage 
tier and generates the response.

![Tiered storage](https://assets.timescale.com/docs/images/tiered-storage.png )

Data tiering is available in the [scale and enterprise][pricing-plans] pricing plans for $CLOUD_LONG. 

To set up data tiering: 

<Procedure>

1. **Enable data tiering**

   1. In [$CONSOLE][portal-ops-mode], select the service to modify.

       You see the `Overview` section.

   1. Scroll down, then click `Enable tiered storage`.

      ![Enable tiered storage](https://assets.timescale.com/docs/images/console-enable-tiered-storage.png)

      When tiered storage is enabled, you see the amount of data in the tiered object storage.

1. **Set the time interval when data is tiered**

    In $CONSOLE, click `SQL Editor`, then enable data tiering on a hypertable with the following query:
     ```sql
     SELECT add_tiering_policy('assets_candlestick_daily', INTERVAL '3 weeks');   
     ```

1. **Query tiered data**

    You enable reads from tiered data for each query, for a session or for all future 
    sessions. To run a single query on tiered data:

    1. Enable reads on tiered data:
      ```sql
      set timescaledb.enable_tiered_reads = true
      ```
    1. Query the data:
      ```sql 
      SELECT * FROM crypto_ticks srt LIMIT 10
      ```
    1. Disable reads on tiered data:
      ```sql  
      set timescaledb.enable_tiered_reads = false;
      ```
    For more information, see [Querying tiered data][querying-tiered-data].    

</Procedure>

## Reduce the risk of downtime and data loss

By default, all $SERVICE_LONGs have rapid recovery enabled. However, if your app has very low tolerance 
for downtime, $CLOUD_LONG offers High Availability (HA) replicas. HA replicas are exact, up-to-date copies 
of your database hosted in multiple AWS availability zones (AZ) within the same region as your primary node.
HA replicas automatically take over operations if the original primary data node becomes unavailable. 
The primary node streams its write-ahead log (WAL) to the replicas to minimize the chances of 
data loss during failover.

![Move from rowstore and columstore in hypercore](https://assets.timescale.com/docs/images/ha-read-replica.png )

High availability is available in the [scale and enterprise][pricing-plans] pricing plans for $CLOUD_LONG. 

<HASetup />

For more information, see [High availability][high-availability].

What next? See the [use case tutorials][tutorials], interact with the data in your $SERVICE_LONG using
[your favorite programming language][connect-with-code], integrate your $SERVICE_LONG with a range of
[third-party tools][integrations], plain old [Use Timescale][use-timescale], or dive into [the API][use-the-api].

[tutorials]: /tutorials/:currentVersion:/
[connect-with-code]: /quick-start/:currentVersion:/
[integrations]: /use-timescale/:currentVersion:/integrations/
[use-the-api]: /api/:currentVersion:/
[use-timescale]: /use-timescale/:currentVersion:/
[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
[create-a-service]: /getting-started/:currentVersion:/services/
[deploy-self-hosted]: /self-hosted/:currentVersion:/install/
[connect-to-your-service]: /getting-started/:currentVersion:/run-queries-from-console/
[portal-ops-mode]: https://console.cloud.timescale.com/dashboard/services
[portal-data-mode]: https://console.cloud.timescale.com/dashboard/services?popsql
[migrate-with-downtime]: /migrate/:currentVersion:/pg-dump-and-restore/
[migrate-live]: /migrate/:currentVersion:/live-migration/
[data-ingest]: /use-timescale/:currentVersion:/ingest-data/
[hypertables-section]: /use-timescale/:currentVersion:/hypertables/
[test-drive-enable-compression]: /getting-started/:currentVersion:/try-key-features-timescale-products/#enhance-query-performance-for-analytics
[test-drive-tiered-storage]: /getting-started/:currentVersion:/try-key-features-timescale-products/#slash-storage-charges
[data-tiering]: /use-timescale/:currentVersion:/data-tiering/
[compression]: /use-timescale/:currentVersion:/compression/
[hierarchical-caggs]: /use-timescale/:currentVersion:/continuous-aggregates/hierarchical-continuous-aggregates/
[charts]: https://www.investopedia.com/terms/c/candlestick.asp
[hierarchical-storage]: https://en.wikipedia.org/wiki/Hierarchical_storage_management
[querying-tiered-data]: /use-timescale/:currentVersion:/data-tiering/querying-tiered-data/
[data-tiering]: /use-timescale/:currentVersion:/data-tiering/
[pricing-plans]: /about/:currentVersion:/pricing-and-account-management
[querying-tiered-data]: /use-timescale/:currentVersion:/data-tiering/querying-tiered-data/
[high-availability]: /use-timescale/:currentVersion:/ha-replicas/high-availability/
[sign-up]: https://console.cloud.timescale.com/signup
[job]: /api/:currentVersion:/actions/add_job/
[alter-table-arguments]: /api/:currentVersion:/hypercore/alter_table/#arguments
[add_columnstore_policy]: /api/:currentVersion:/hypercore/add_columnstore_policy/
