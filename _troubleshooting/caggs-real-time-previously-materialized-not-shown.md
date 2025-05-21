---
title: Updates to previously materialized regions aren't shown in real-time aggregates
section: troubleshooting
products: [cloud, mst, self_hosted]
topics: [continuous aggregates]
apis:
  - [continuous aggregates, add_continuous_aggregate_policy()]
  - [continuous aggregates, add_policies()]
  - [continuous aggregates, alter_policies()]
  - [continuous aggregates, CREATE MATERIALIZED VIEW (Continuous Aggregate)]
  - [continuous aggregates, refresh_continuous_aggregate()]
keywords: [continuous aggregates, real-time aggregates]
tags: [continuous aggregates, real-time aggregates, materialized views]
---

import CaggsRealTimeHistoricalDataRefreshes from 'versionContent/_partials/_caggs-real-time-historical-data-refreshes.mdx';
import OldCreateHypertable from "versionContent/_partials/_old-api-create-hypertable.mdx";


<CaggsRealTimeHistoricalDataRefreshes />

The following example shows how this works:

<Procedure>

1. Create the $HYPERTABLE:

   ```sql
   CREATE TABLE conditions(
     day DATE NOT NULL,
     city text NOT NULL,
     temperature INT NOT NULL
   WITH (
      tsdb.hypertable,
      tsdb.partition_column='day',
      tsdb.chunk_interval='1 day'
   );
   ```
   
   <OldCreateHypertable />

1. Add data to your $HYPERTABLE:

   ```sql
   INSERT INTO conditions (day, city, temperature) VALUES
     ('2021-06-14', 'Moscow', 26),
     ('2021-06-15', 'Moscow', 22),
     ('2021-06-16', 'Moscow', 24),
     ('2021-06-17', 'Moscow', 24),
     ('2021-06-18', 'Moscow', 27),
     ('2021-06-19', 'Moscow', 28),
     ('2021-06-20', 'Moscow', 30),
     ('2021-06-21', 'Moscow', 31),
     ('2021-06-22', 'Moscow', 34),
     ('2021-06-23', 'Moscow', 34),
     ('2021-06-24', 'Moscow', 34),
     ('2021-06-25', 'Moscow', 32),
     ('2021-06-26', 'Moscow', 32),
     ('2021-06-27', 'Moscow', 31);
   ```

1. Create a $CAGG but do not materialize any data: 

   1. Create the $CAGG:
      ```sql
      CREATE MATERIALIZED VIEW conditions_summary
      WITH (timescaledb.continuous) AS
      SELECT city,
         time_bucket('7 days', day) AS bucket,
         MIN(temperature),
         MAX(temperature)
      FROM conditions
      GROUP BY city, bucket
      WITH NO DATA;
      ```

   1. Check your data: 
      ```sql
       SELECT * FROM conditions_summary ORDER BY bucket;
      ```
      The query on the $CAGG fetches data directly from the $HYPERTABLE:

      |  city  |   bucket   | min | max|
      |--------|------------|-----|-----|
      |Moscow | 2021-06-14 |  22 |  30 |
      | Moscow | 2021-06-21 |  31 |  34|

1. Materialize data into the $CAGG:

   1. Add a refresh policy:
      ```sql
      CALL refresh_continuous_aggregate('conditions_summary', '2021-06-14', '2021-06-21');
      ```

   1. Check your data:
      ```sql
      SELECT * FROM conditions_summary ORDER BY bucket;
      ```
      The select query returns the same data, as expected, but this time the data is
      fetched from the underlying materialized table

      |  city  |   bucket   | min | max|
      |--------|------------|-----|-----|
      |Moscow | 2021-06-14 |  22 |  30|
      | Moscow | 2021-06-21 |  31 |  34|


1. Update the data in the previously materialized bucket:

   1. Update the data in your $HYPERTABLE:
      ```sql
      UPDATE conditions
      SET temperature = 35
      WHERE day = '2021-06-14' and city = 'Moscow';
      ```

   1. Check your data:
      ```sql
      SELECT * FROM conditions_summary ORDER BY bucket;
      ```
      The updated data is not yet visible when you query the continuous aggregate. This
      is because these changes have not been materialized. (Similarly, any
      INSERTs or DELETEs would also not be visible).

      |city  |   bucket   | min | max|
      |--------|------------|-----|-----|
      |Moscow | 2021-06-14 |  22 |  30|
      |Moscow | 2021-06-21 |  31 |  34|


1. Refresh the data again to update the previously materialized region:

   1. Refresh the data:
      ```sql
      CALL refresh_continuous_aggregate('conditions_summary', '2021-06-14', '2021-06-21');
      ```

1. Check your data:
      ```sql
      SELECT * FROM conditions_summary ORDER BY bucket;
      ```
      You see something like:

      |city  |   bucket   | min | max
      |--------|------------|-----|-----|
      | Moscow | 2021-06-14 |  22 |  35|
      |Moscow | 2021-06-21 |  31 |  34|

</Procedure>
