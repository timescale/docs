---
title: Analytics on transport and geospatial data
excerpt: Simulate and analyze a transport dataset in your Timescale Cloud service
products: [cloud, mst, self_hosted]
keywords: [IoT, simulate]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";
import GrafanaConnect from "versionContent/_partials/_grafana-connect.mdx";
import ImportData from "versionContent/_partials/_import-data-nyc-taxis.mdx";
import GeolocationAnalytics from "versionContent/_partials/_use-case-transport-geolocation.mdx";

# Analytics on transport and geospatial data

Real-time analytics refers to the process of collecting, analyzing, and interpreting data instantly as it 
is generated. This approach enables you track and monitor activity, and make decisions based on real-time 
insights on data stored in a $SERVICE_LONG. 

![Real-time analytics geolocation](https://assets.timescale.com/docs/images/use-case-rta-grafana-heatmap.png)

This page shows you how to integrate [Grafana][grafana-docs] with a $SERVICE_LONG and make insights based on visualization 
of data optimized for size and speed in the columnstore.

## Prerequisites

<IntegrationPrereqs />

* Install and run [self-managed Grafana][grafana-self-managed], or sign up for [Grafana Cloud][grafana-cloud].

## Optimize time-series data in hypertables

<ImportData />

## Optimize your data for real-time analytics

[Hypercore][hypercore] is the $COMPANY hybrid row-columnar storage engine used by hypertables. Hypertables partition your data in
chunks. Chunks stored in the rowstore use a row-oriented data format optimized for high-speed inserts and updates.
Chunks stored in the columnstore use a columnar data format optimized for analytics. You ingest `hot` data into the
rowstore. As data cools and becomes more suited for analytics, $CLOUD_LONG automatically converts these chunks of data
to the columnstore. You define the moment when data is converted using a columnstore policy.

When $CLOUD_LONG converts a chunk to the columnstore, TimescaleDB automatically creates a different schema for your
data. $TIMESCALE_DB creates and uses custom indexes to incorporate the `segmentby` and `orderby` parameters when
you write to and read from the columstore.

To increase the speed of your analytical queries by a factor of 10 and reduce storage costs by up to 90%, convert data 
to the columnstore:

<Procedure>

1. **Connect to your $SERVICE_LONG**

   In [$CONSOLE][services-portal] open an [SQL editor][in-console-editors]. The in-Console editors display the query speed.
   You can also connect to your service using [psql][connect-using-psql].

1. **Enable columnstore on a hypertable**

   Create a [job][job] that automatically moves chunks in a hypertable to the columnstore at a specific time interval.
   By default, your table is `orderedby` the time column. For efficient queries on columnstore data, remember to
   `segmentby` the column you will use most often to filter your data:

   ```sql
   ALTER TABLE rides SET (
     timescaledb.enable_columnstore = true,
     timescaledb.segmentby = 'vendor_id',
     timescaledb.orderby = 'pickup_datetime DESC'
   );
   ```

1. **Add a policy to convert chunks to the columnstore at a specific time interval**

   For example, convert data older than 8 days old to the columstore:
   ``` sql
   CALL add_columnstore_policy('rides', INTERVAL '8 days');
   ```
   See [add_columnstore_policy][add_columnstore_policy].

1. **View your data space saving**
  
   When you convert data to the columnstore, as well as being optimized for analytics, it is compressed by more than 90%. 
   This saves on storage costs and keeps your queries operating at lightning speed. To see the amount of space saved:
   ```sql
   SELECT 
        pg_size_pretty(before_compression_total_bytes) as before,
        pg_size_pretty(after_compression_total_bytes) as after
   FROM hypertable_compression_stats('rides');
   ```
   You see something like:

   | before  | after  |  
   |--|--|
   |2818 MB | 673 MB |

1. **Faster analytical queries on data in the columnstore**

   Now run the analytical query again:
   ```sql
   SELECT rates.description, COUNT(vendor_id) AS num_trips
   FROM rides
   JOIN rates ON rides.rate_code = rates.rate_code
   WHERE pickup_datetime < '2016-01-08'
   GROUP BY rates.description
   ORDER BY LOWER(rates.description);
   ```
   On this large amount of data, this analytical query on data in the columnstore takes about 6 seconds.

</Procedure>

Just to hit this one home, by converting cooling data to the columnstore, you have increased the speed of your analytical 
queries by a factor of 10, and reduced storage by up to 90%.
   

<GrafanaConnect />

## Monitor performance over time

A Grafana dashboard represents a view into the performance of a system, and each dashboard consists of one or
more panels, which represent information about a specific metric related to that system.

To visually monitor the volume of taxi rides over time:

<Procedure>

1. **Create the dashboard**

   1. On the `Dashboards` page, click `New` and select `New dashboard`.

   1. Click `Add visualization`.
   1. Select the data source that connects to your $SERVICE_LONG.
       The `Time series` visualization is chosen by default.
      ![Grafana create dashboard](https://assets.timescale.com/docs/images/use-case-rta-grafana-timescale-configure-dashboard.png)
   1. In the `Queries` section, select `Code`, then select `Time series` in `Format`. 
   1. Select the data range for your visualization:
      the data set is from 2016. Click the date range above the panel and set:
      - From: ```2016-01-01 01:00:00```
      - To: ```2016-01-30 01:00:00```

1. **Combine $TIMESCALE_DB and Grafana functionality to analyze your data**

   Combine a $TIMESCALE_DB [time_bucket][use-time-buckets], with the Grafana `$__timefilter()` function to set the
   `pickup_datetime` column as the filtering range for your visualizations.
   ```sql
   SELECT
     time_bucket('1 day', pickup_datetime) AS "time",
     COUNT(*)
   FROM rides
   WHERE $__timeFilter(pickup_datetime)
   GROUP BY time
   ORDER BY time;
   ```
   This query groups the results by day and orders them by time.

   ![Grafana real-time analytics](https://assets.timescale.com/docs/images/use-case-rta-grafana-timescale-final-dashboard.png)

1. **Click `Save dashboard`**


</Procedure>

## Optimize revenue potential 

Having all this data is great but how do you use it? Monitoring data is useful to check what 
has happened, but how can you analyse this information to your advantage? This section explains 
how to create a visualization that shows how you can maximize potential revenue.

<GeolocationAnalytics />

You have integrated Grafana with a $SERVICE_LONG and made insights based on visualization of
your data.

[grafana-docs]: https://grafana.com/docs/
[grafana-self-managed]: https://grafana.com/get/?tab=self-managed
[grafana-cloud]: https://grafana.com/get/
[use-time-buckets]: /use-timescale/:currentVersion:/time-buckets/use-time-buckets/
[job]: /api/:currentVersion:/actions/add_job/
[alter_table_hypercore]: /api/:currentVersion:/hypercore/alter_table/
[compression_continuous-aggregate]: /api/:currentVersion:/hypercore/alter_materialized_view/
[convert_to_rowstore]: /api/:currentVersion:/hypercore/convert_to_rowstore/
[convert_to_columnstore]: /api/:currentVersion:/hypercore/convert_to_columnstore/
[informational-views]: /api/:currentVersion:/informational-views/jobs/
[add_columnstore_policy]: /api/:currentVersion:/hypercore/add_columnstore_policy/
[hypercore_workflow]: /api/:currentVersion:/hypercore/#hypercore-workflow
[alter_job]: /api/:currentVersion:/actions/alter_job/
[remove_columnstore_policy]: /api/:currentVersion:/hypercore/remove_columnstore_policy/
[in-console-editors]: /getting-started/:currentVersion:/run-queries-from-console/
[services-portal]: https://console.cloud.timescale.com/dashboard/services
[connect-using-psql]: /integrations/:currentVersion:/psql#connect-to-your-service
[insert]: /use-timescale/:currentVersion:/write-data/insert/
[hypercore]: /use-timescale/:currentVersion:/hypercore/
