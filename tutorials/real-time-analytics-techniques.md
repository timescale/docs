---
title: Real-time analytics with Timescale Cloud and Grafana
excerpt: Simulate an IOT dataset in your Timescale Cloud service
products: [cloud, mst, self_hosted]
keywords: [IoT, simulate]
---

import ImportPrerequisites from "versionContent/_partials/_migrate_import_prerequisites.mdx";

# Real-time analytics with Timescale Cloud and Grafana




## Prerequisites

<IntegrationPrereqs />

* Install [self-managed Grafana][grafana-self-managed] or sign up for [Grafana Cloud][grafana-cloud].


## Optimize time-series data in hypertables

Time-series data represents how a system, process, or behavior changes over time. Hypertables are PostgreSQL tables
that help you improve insert and query performance by automatically partition your data by time. Each hypertable
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

   1. Unzip <Tag type="download">[nyc_data.tar.gz](https://assets.timescale.com/docs/downloads/nyc_data.tar.gz)</Tag> to a `<local folder>`.

      This test dataset contains historical data from New York's yellow taxi network.

      To import up to 100GB of data directly from your current PostgreSQL based database,
      [migrate with downtime][migrate-with-downtime] using native PostgreSQL tooling. To seamlessly import 100GB-10TB+
      of data, use the [live migration][migrate-live] tooling supplied by $COMPANY. To add data from non-PostgreSQL
      data sources, see [Import and ingest data][data-ingest].

   1. Upload data from the CSVs to your $SERVICE_SHORT:

      <Tabs label="Upload data to ">

      <Tab title="Timescale Console">

      The $CONSOLE data upload creates the tables for you from the data you are uploading:
      1. In [$CONSOLE][portal-ops-mode], select the service to add data to, then click **Actions** > **Upload CSV**.
      1. Drag `<local folder>/tutorial_sample_tick.csv` to `Upload .CSV` and change `New table name`, to `stocks_real_time`.
      1. Enable `hypertable partition` for the `time` column and click `Upload CSV`.
         The upload wizard creates a hypertable containing the data from the CSV file.
      1. When the data is uploaded, close `Upload .CSV`.
         If you want to  have a quick look at your data, press `Run` .
      1. Repeat the process with `<local folder>/tutorial_sample_company.csv` and rename to `company`.
         There is no time-series data in this table, so you don't see the  `hypertable partition` option.

      </Tab>

      <Tab title="psql">

      1. In Terminal, navigate to `<local folder>` and connect to your $SERVICE_SHORT.
         ```bash
         psql -d "postgres://<username>:<password>@<host>:<port>/<database-name>"
         ```
         The connection information for a $SERVICE_SHORT is available in the file you downloaded when you created it.

      2. Create tables for the data to import

         - For the time-series data:
            1. In your sql client, create a normal PostgreSQL table:

               ```sql
               CREATE TABLE stocks_real_time (
                 time TIMESTAMPTZ NOT NULL,
                 symbol TEXT NOT NULL,
                 price DOUBLE PRECISION NULL,
                 day_volume INT NULL
               );
               ```
            1.  Convert `stocks_real_time` to a hypertable:
                ```sql
                SELECT create_hypertable('stocks_real_time', by_range('time'));
                ```
                To more fully understand how hypertables work, and how to optimize them for performance by
                tuning chunk intervals and enabling chunk skipping, see [the hypertables documentation][hypertables-section].

         - For the relational data:

           In your sql client, create a normal PostgreSQL table:
            ```sql
            CREATE TABLE company (
             symbol TEXT NOT NULL,
             name TEXT NOT NULL
            );
           ```

      3. Upload the dataset to your $SERVICE_SHORT
         ```sql
         \COPY stocks_real_time from './tutorial_sample_tick.csv' DELIMITER ',' CSV HEADER;
         \COPY company from './tutorial_sample_company.csv' DELIMITER ',' CSV HEADER;
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

    <TryItOutCodeBlock queryId="getting-started-srt-orderby" />

</Procedure>

## Simulate a dataset
