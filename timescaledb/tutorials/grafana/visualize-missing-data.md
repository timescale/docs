# Tutorial: How to visualize and aggregate missing time-series data in Grafana

>:TOPLIST:
> ### Contents
> - [Introduction](#introduction)
> - [Prerequisites](#prereqs)
> - [Step 0 - Load your time-series data into TimescaleDB and simulate 
missing data (optional)](#step0)
> - [Step 1 - Plot the dataset and confirm missing data](#step1)
> - [Step 2 - Interpolate (fill in) the missing data](#step2)
> - [Step 3 - Aggregate across a larger time window](#step3)
> - [Next Steps](#next-steps)

### Introduction [](introduction)
Sometimes there are gaps in our time-series data: because systems
are offline, or devices lose power, etc. This causes problems when you 
want to aggregate data across a large time window, for example,
computing the average temperature over the past 6 hours by 30 minute
time intervals or analyzing today’s CPU utilization by 15 minute
intervals. Gaps in data can also have other negative consequences,
e.g., breaking applications downstream.

In this tutorial, you’ll see how to use [Grafana][grafana-external]
(an open-source visualization tool) and TimescaleDB for
handling missing time-series data (using the TimescaleDB/PostgreSQL data
source natively available in Grafana).

### Prerequisites [](prereqs)
To complete this tutorial, you will need a cursory knowledge of the Structured Query 
Language (SQL). The tutorial will walk you through each SQL command, but it will be 
helpful if you've seen SQL before.

You will also need:

* Time-series dataset with missing data (Note: in case you don’t have
one handy, we include an optional step for creating one below.)

* A working [installation of TimescaleDB][install-timescale]. Once your installation 
is complete, we can proceed to ingesting or creating sample data and finishing the tutorial.

* Grafana dashboard connected to your TimescaleDB instance ([setup
instructions][get-grafana])

### Step 0 - Load your time-series data into TimescaleDB and simulate missing data (optional) [](step0)

*(Please skip this step if you already have TimescaleDB loaded with your
time-series data.)*

For this tutorial, we are going to load our TimescaleDB instance with
simulated IoT sensor data (available in our [How to explore TimescaleDB
using simulated IoT sensor data tutorial][tutorial-simulate-iot]).

This dataset simulates four sensors that each collect temperature and CPU data, in a [hypertable][docs-hypertable] structured like this:

```sql
CREATE TABLE sensor_data (
  time TIMESTAMPTZ NOT NULL,
  sensor_id INTEGER,
  temperature DOUBLE PRECISION,
  cpu DOUBLE PRECISION,
  FOREIGN KEY (sensor_id) REFERENCES sensors (id)
);
```

To simulate missing data, let’s delete all data our sensors collected between 1 hour and 2 hours ago:

```
DELETE FROM sensor_data WHERE sensor_id = 1 and time > now() - INTERVAL '2 hour' and time < now() - INTERVAL '1 hour';
```

### Step 1 - Plot the dataset and confirm missing data [](step1)

*(For this and the following steps, we’ll use the IoT dataset from Step
0, but the steps are the same if you use your own - real or simulated -
dataset).*

To confirm we’re missing data values, let’s create a simple graph that
calculates the average temperature readings from `sensor_1` over the past
6 hours (using [`time_bucket`][docs-timebucket]).

```sql
SELECT
  time_bucket('5 minutes', "time") as time,
  AVG(temperature) AS sensor_1
FROM sensor_data
WHERE
  $__timeFilter("time") AND 
  sensor_id = 1
GROUP BY time_bucket('5 minutes', time)
ORDER BY 1
```

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-tutorial-missing-data-grafana/missing-data.png" alt="Grafana Screenshot: Missing Data"/>

There is missing data from 17:05 to 18:10, as we can see by the lack of
data points (flat line) during that time period.

### Step 2 - Interpolate (fill in) the missing data [](step2)

For interpolating the missing data, we use
[`time_bucket_gapfill`][docs-timebucket-gapfill],
combined with [`LOCF`][docs-LOCF] (“Last Observation Carried Forward”).
This takes the last reading before the missing data began and plots it
(the last recorded value) at regular time intervals until new data is
received:

```sql
SELECT
  time_bucket_gapfill('5 minutes', "time") as time,
  LOCF(AVG(temperature)) AS sensor_1
FROM sensor_data
WHERE
  $__timeFilter("time") AND 
  sensor_id = 1
GROUP BY time_bucket_gapfill('5 minutes', "time")
ORDER BY 1
```

LOCF is a handy interpolation technique when you have missing data, but
no additional context to determine what the missing data values might
have been.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-tutorial-missing-data-grafana/locf.png" alt="Grafana Screenshot: Interpolating using LOCF"/>

As you can see, the graph now plots data points at regular intervals for the times where we have missing data.

### Step 3 - Aggregate across a larger time window [](step3)
Now, we return to our original problem: wanting to aggregate data across a large time window with missing data. 

Here we use our interpolated data and compute the average temperature by 30 minute windows over the past 6 hours. 

```sql
SELECT
  time_bucket_gapfill('30 minutes', "time") as time,
  LOCF(AVG(temperature)) AS sensor_1
FROM sensor_data
WHERE
  $__timeFilter("time") AND 
  sensor_id = 1
GROUP BY time_bucket_gapfill('30 minutes', "time")
ORDER BY 1
```

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-tutorial-missing-data-grafana/aggregate.png" alt="Grafana Screenshot: Aggregating across our interpolated data"/>

Let’s compare this to what the aggregate would have looked like had we
not interpolated the missing data, by adding a new series to the graph:

```sql
SELECT
  time_bucket('30 minutes', "time") as time,
  AVG(temperature) AS sensor_1
FROM sensor_data
WHERE
  $__timeFilter("time") AND 
  sensor_id = 1
GROUP BY time_bucket('30 minutes', time)
ORDER BY 1
```

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-tutorial-missing-data-grafana/aggregate_2.png" alt="Grafana Screenshot: Aggregating across our interpolated data vs. missing data"/>

(Note that the interpolated average is now in ORANGE, while the average
with missing data is GREEN.)

As you can see above, the GREEN plot is missing a data point at 17:30,
giving us little understanding of what happened during that time period,
and risking breaking applications downstream. In contrast, the ORANGE
plot uses our interpolated data to create a datapoint for that time
period.

### Next steps [](next-steps)

This is just one way to use TimescaleDB with Grafana to solve data
problems and ensure that your applications, systems, and operations
don’t  suffer any negative consequences (e.g., downtime, misbehaving
applications, or a degregraded customer experience). For more ways on
how to use TimescaleDB, check out our other [tutorials][tutorials]
(which range from beginner to advanced).

[grafana-external]: https://grafana.com/
[install-timescale]: /getting-started/installation
[get-grafana]: /tutorials/tutorial-grafana
[tutorial-simulate-iot]: /tutorials/tutorial-howto-simulate-iot-sensor-data
[docs-hypertable]: /using-timescaledb/hypertables
[docs-timebucket]: /api#time_bucket
[docs-timebucket-gapfill]: /api#time_bucket_gapfill
[docs-LOCF]: /api#locf
[tutorials]: /tutorials