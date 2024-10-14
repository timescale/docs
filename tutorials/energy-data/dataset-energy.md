---
title: Energy time-series data tutorial - set up dataset
excerpt: Set up a dataset so you can query time-series data
products: [cloud, mst, self_hosted]
keywords: [tutorials, create, dataset]
tags: [tutorials, beginner]
layout_components: [next_prev_large]
content_group: Analyze energy consumption data
---

import CreateAndConnect from "versionContent/_partials/_cloud-create-connect-tutorials.mdx";
import CreateHypertableEnergy from "versionContent/_partials/_create-hypertable-energy.mdx";
import AddDataEnergy from "versionContent/_partials/_add-data-energy.mdx";
import GrafanaConnect from "versionContent/_partials/_grafana-connect.mdx";
import CreateCaggs from "versionContent/_partials/_caggs-intro.mdx";

# Set up the database

This tutorial uses the energy consumption data for over a year in a
hypertable named `metrics`.

<Collapsible heading="Create a $SERVICE_LONG and connect to your $SERVICE_SHORT" defaultExpanded={false}>

<CreateAndConnect/>

</Collapsible>

<Collapsible heading="The dataset" defaultExpanded={false}>

This tutorial uses the energy consumption data for over a year in a typical
household. You can use this data to analyze the energy consumption pattern.

<CreateHypertableEnergy />

<AddDataEnergy />

</Collapsible>

<Collapsible heading="Downsampling the data" defaultExpanded={false}>

<CreateCaggs />

## Create $CAGGs

<Procedure>

### Creating $CAGGs for energy consumption by day and hour

1.  Create a $CAGG `kwh_day_by_day` for energy consumption on a
    day-to-day basis:

    ```sql
    CREATE MATERIALIZED VIEW kwh_day_by_day(time, value)
        with (timescaledb.continuous) as
    SELECT time_bucket('1 day', created, 'Europe/Berlin') AS "time",
            round((last(value, created) - first(value, created)) * 100.) / 100. AS value
    FROM metrics
    WHERE type_id = 5
    GROUP BY 1;
    ```

1.  Add a refresh policy to keep the $CAGG up-to-date:

     ```sql
     SELECT add_continuous_aggregate_policy('kwh_day_by_day',
        start_offset => NULL,
        end_offset => INTERVAL '1 hour',
        schedule_interval => INTERVAL '1 hour');
     ```

1.  Create a $CAGG `kwh_hour_by_hour` for energy consumption on
    an hourly basis:

    ```sql
    CREATE MATERIALIZED VIEW kwh_hour_by_hour(time, value)
      with (timescaledb.continuous) as
    SELECT time_bucket('01:00:00', metrics.created, 'Europe/Berlin') AS "time",
           round((last(value, created) - first(value, created)) * 100.) / 100. AS value
    FROM metrics
    WHERE type_id = 5
    GROUP BY 1;
    ```

1.  Add a refresh policy to keep the $CAGG up-to-date:

     ```sql
     SELECT add_continuous_aggregate_policy('kwh_hour_by_hour',
        start_offset => NULL,
        end_offset => INTERVAL '1 hour',
        schedule_interval => INTERVAL '1 hour');
     ```

1.  You can confirm that the $CAGGs were created:

    ```sql
    SELECT view_name, format('%I.%I', materialization_hypertable_schema,materialization_hypertable_name) AS materialization_hypertable
    FROM timescaledb_information.continuous_aggregates;
    ```

    You should see this:

    ```sql
     view_name     |            materialization_hypertable
    ------------------+--------------------------------------------------
     kwh_day_by_day   | _timescaledb_internal._materialized_hypertable_2
     kwh_hour_by_hour | _timescaledb_internal._materialized_hypertable_3

    ```

</Procedure>

</Collapsible>

<Collapsible heading="Connect to Grafana" defaultExpanded={false}>

The queries in this tutorial are suitable for visualizing in Grafana. If you
want to visualize the results of your queries, connect your Grafana account to
the energy consumption dataset.

<GrafanaConnect />

</Collapsible>
