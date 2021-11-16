# 6. Create a continuous aggregate

## What are continuous aggregates?

**Aggregates** are summaries of raw data for a period of time. Some examples of
aggregates are the average temperature per day, the maximum CPU utilization per
5 minutes, and the number of visitors on a website per day.

Calculating aggregates on time-series data can be computationally intensive given
the large amounts of data which need to be processed in order to calculate and
recalculate aggregates over a time period. Moreover, calculating aggregates
while simultaneously ingesting data can cause a slowdown in ingest rate due to
the computational resources being split between the two resource intensive
processes. Continuous aggregates solve both these problems.

**Continuous aggregates** are automatically refreshed materialized views – so
they massively speed up workloads that need to process large amounts of data.
Unlike in other databases, your views are automatically refreshed in the background
as new data is added, or as old data is modified according to a schedule.

* Continuous aggregates automatically and in the background pre-calculate and
maintain the results from a specified query, and allow you to retrieve the results
as you would any other data.
* The views are automatically refreshed in the background as new data is added,
or as old data is modified according to a schedule.

For Postgres users who may be familiar with views and materialized views, here's
how continuous aggregates differ:

* Unlike a PostgreSQL view a continuous aggregate does not perform the computation when queried
* Unlike a materialized view, it does not need to be refreshed manually, as it
can be refreshed according to a schedule.

Continuous aggregates speed up dashboards and visualizations, summarizing data
sampled at high frequency, and querying downsampled data over long time periods.

## Creating continuous aggregates

Now that you're familiar with what Continuous Aggregates are, let's create our
first continuous aggregate. Creating a continuous aggregate is a two step process:
first we define our view and second, we create a policies which refresh the
continuous aggregate according to a schedule.

We'll use the example of creating a daily aggregation of all weather metrics.

### Step 1: Define view

Here's the SQL query which defines the query of which we want to maintain the
results. In this case, we calculate the daily average for all weather metrics,
as well as the maximum and minimum for temperature.

```sql
-- Continuous aggs
-- define view
CREATE MATERIALIZED VIEW weather_metrics_daily
WITH (timescaledb.continuous)
AS
SELECT
   time_bucket('1 day', time) as bucket,
   city_name,
   avg(temp_c) as avg_temp,
   avg(feels_like_c) as feels_like_temp,
   max(temp_c) as max_temp,
   min(temp_c) as min_temp,
   avg(pressure_hpa) as pressure,
   avg(humidity_percent) as humidity_percent,
   avg(rain_3h_mm) as rain_3h,
   avg(snow_3h_mm) as snow_3h,
   avg(wind_speed_ms) as wind_speed,
   avg(clouds_percent) as clouds
FROM
 weather_metrics
GROUP BY bucket, city_name
WITH NO DATA;
```

Notice how we use our friend `time_bucket` from the previous section to specify that we want to bucket the data by 1 day time periods.

You can create multiple continuous aggregates on the same hypertable, but for simplicity sake we'll just create one for now.

Here's some ideas for other aggregates to create:

* 6 month aggregates for all metrics for a specific city.
* 30 day aggregates for temperature and rainfall for all cities.
* 5 year aggregates for all metrics for certain cities.

<highlight type="tip">
If you ever need to inspect details about a continuous aggregate, such as its configuration or the query used to define it, you can use the following informational view:
</highlight>

```sql
-- See info about continuous aggregates
SELECT * FROM timescaledb_information.continuous_aggregates;
```

### Step 2: Populate the continuous aggregate

Right now we've created the continuous aggregate but it has not materialized any
data. There are two ways to populate a continuous aggregate: via manual refresh
or an automation policy. These methods enable you to refresh materialized data
in your continuous aggregates when its most convenient for you (e.g during low
query load times on your database).

Let's take a look at how to do each one.

#### Manual refresh

You can manually refresh a continuous aggregate by means of a "one-shot refresh".
This is useful for refreshing data for only a specific time-period in the past
or if you want to materialize a lot of data at once on a once-off basis.

The example below refreshes the continuous aggregate `weather_metrics_daily` for
the time period starting 1 January 2010 and ending 1 January 2021:

```sql
-- manual refresh
-- refresh data between 1 Jan 2010 and 2021
CALL refresh_continuous_aggregate('weather_metrics_daily','2010-01-01', '2021-01-01');
```

Querying our continuous aggregate for data older than 1 January 2009 shows that
it is indeed populated with data from the above time frame, as the first row
returned is for 1 January 2010:

```sql
-- Show that manual refresh worked
SELECT * from weather_metrics_daily
WHERE bucket > '2009-01-01'
ORDER BY bucket ASC;
```

#### Automation policies

An **automation policy** can also be used to refresh continuous aggregates according to a schedule.

While many databases have ad-hoc capabilities for managing large amounts of
time-series data, adapting these features to the rhythm of your data lifecycle
often requires custom code and regular development time.

Enter TimescaleDB's built-in background jobs capability, often referred to as
Automation Policies.

Using automation policies for updating continuous aggregates is the first of many
automation policies you'll encounter in TimescaleDB. TimescaleDB also has policies
to automate compression and data retention. You can also create custom policies and
run them according to a schedule with the User Defined Actions feature. Using this
automation feature allows you to "set it and forget it" on administration tasks
so that you can spend time on feature development.

You'll see policies for compression and data retention later in this **Getting started** section.

Let's create a policy which auto-updates the continuous aggregate every two weeks:

```sql
-- create policy
-- refresh the last 6 months of data every 2 weeks
SELECT add_continuous_aggregate_policy('weather_metrics_daily',
  start_offset => INTERVAL '6 months',
  end_offset => INTERVAL '1 hour',
  schedule_interval => INTERVAL '14 days');
```

The policy above runs every 14 days (`schedule_interval`). When it runs, it
materializes data from between 6 months (`start_offset`) and 1 hour (`end_offset`)
of the time it executes, according to the query which defined the continuous
aggregate `weather_metrics_daily`.

Automation policies are useful for continuous aggregates which need to return
data from recent time frames, as they help them stay up to date.

## Querying continuous aggregates

<highlight type="tip">
Continuous Aggregates are actually a special kind of hypertable, so you can
query it, view and modify its chunks just like you would a regular hypertable.
You can also add data retention policies and drop chunks on continuous aggregate
hypertables. The only restrictions at this time is that you cannot apply
compression or continuous aggregation to these hypertables.
</highlight>


When you query a continuous aggregate, the system reads and processes the much
smaller materialized table, which has been refreshed at scheduled intervals. This
makes querying continuous aggregates useful for speeding up dashboards, summarizing
data sampled at high frequency, and querying downsampled data over long time periods.

Moreover, querying continuous aggregates does not slow down INSERT operations,
since data is inserted into a different hypertable than the one underlying the
continuous aggregate.

Let's examine an example of a query which would perform better on our continuous
aggregate (`weather_metrics_daily`) than on our hypertable (`weather_metrics`).
Here's a query which looks at how temperatures in New York have changed over the
past 6 years. It returns the time as well as the daily maximum, minimum
and average temperatures for New York City between 2015 and 2021:

```sql
-- Continuous Aggregate query example
-- Temperature in New York 2015-2021
SELECT bucket, max_temp, avg_temp, min_temp
FROM weather_metrics_daily
WHERE bucket >= '2015-01-01' AND bucket < '2021-01-01'
AND city_name LIKE 'New York'
ORDER BY bucket ASC;
```

Such a query executes quickly as the data for the time period in question is
already populated in the continuous aggregate and aggregated by day. Queries like
this are used in historical analysis, often to plot graphs about how temperature
changes over time.

### Real-time aggregation

By default, continuous aggregates support real-time aggregation, which combines
aggregated data and raw data at query time for the most up to date results. (You
can turn this off if desired, but the majority of developers want this behaviour
by default).

**With real-time aggregation turned off**, continuous aggregates only return
results for data in the time period they have materialized (refreshed). If you
query continuous aggregates for data newer than the last materialized time, it
does not return it or returns stale results.

**With real-time aggregation turned on**, you always receive up-to-date results,
as querying a continuous aggregate returns data that is already materialized
combined with the newest raw data from the hypertable available at query time.

Real-time aggregation gives you the best of both worlds: the performance of continuous
aggregates and the most up to date data for real time queries, without the
performance degradation of querying and aggregating all raw data from scratch.

For example, consider the results of this query, which selects daily aggregates
of all weather metrics for the past two years:

```sql
-- Real-time aggregation
SELECT * from weather_metrics_daily
  WHERE bucket > now() - 2 * INTERVAL '1 year'
  ORDER BY bucket DESC;
```

The first row returned has a time value newer than 1 January 2021, which is the
end date for which we materialized data in our continuous aggregate (done via
manual refresh earlier in this tutorial). Despite not materializing the latest
data via manual refresh or our policy (since the policy created above hasn't yet
run), we still get the latest data thanks to real-time aggregation.

This makes real-time aggregation an ideal fit for many near real-time, monitoring
and analysis use-cases, especially for dashboarding or reporting that requires
the most up to date numbers all the time. It is for this reason that we recommend
keeping the setting on.


## Learn more about continuous aggregates

See how real TimescaleDB users leverage continuous aggregates in the blog posts
[How FlightAware fuels flight prediction models for global travelers with TimescaleDB and Grafana](https://blog.timescale.com/blog/how-flightaware-fuels-flight-prediction-models-with-timescaledb-and-grafana/) and
[How I power a (successful) crypto trading bot with TimescaleDB](https://blog.timescale.com/blog/how-i-power-a-successful-crypto-trading-bot-with-timescaledb/)

Detailed information on continuous aggregates and real-time aggregation can be found
in the [Continuous Aggregates docs](/how-to-guides/continuous-aggregates).
