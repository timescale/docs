---
title: Analytics on transport and geospatial data
excerpt: Simulate and analyze a transport dataset in your Tiger Cloud service
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

[grafana-cloud]: https://grafana.com/get/
[grafana-docs]: https://grafana.com/docs/
[grafana-self-managed]: https://grafana.com/get/?tab=self-managed
[use-time-buckets]: /use-timescale/:currentVersion:/time-buckets/use-time-buckets/
