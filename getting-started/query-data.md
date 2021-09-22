# 5. Query your data

With TimescaleDB, there's no need to learn a custom query language. **TimescaleDB
supports full SQL**. This means you can put your SQL knowledge to good use and
use the rich ecosystem of PostgreSQL tools you know and live.

For example, here's how to find the average temperature for each city in the past 2 years:

```sql
--------------------------------
-- Average temperature per city
-- in past 2 years
--------------------------------
SELECT city_name, avg(temp_c)
FROM weather_metrics
WHERE time > now() - INTERVAL '2 years'
GROUP BY city_name;
```

And here's how to find the total snowfall for each city in the past 5 years:

```sql
--------------------------------
-- Total snowfall per city
-- in past 5 years
--------------------------------
SELECT city_name, sum(snow_1h_mm)
FROM weather_metrics
WHERE time > now() - INTERVAL '5 years'
GROUP BY city_name;
```


<highlight type="tip">
Fun fact: TimescaleDB adds important enhancements to the PostgreSQL query planner
that improve query reusability for INTERVAL predicates, something PostgreSQL does
not have.
</highlight>

## Advanced SQL functions for time-series data

Timescale has many custom-built SQL functions to help you perform time-series
analysis in fewer lines of code.

Examples of these functions include:

* [`time_bucket()`] - used for analyzing data over arbitrary time intervals
* [`first()`] - used for finding the earliest value based on a time within an aggregate group
* [`last()`] - used for finding the latest value based on time within an aggregate group
* [`time_bucket_gapfill()`] - used to analyze data over arbitrary time intervals and fill any gaps in the data
* [`locf()`] - used to fill gaps in data by carrying the last observed value forward
* [`interpolate()`] - used fill gaps by linearly interpolating the missing values between known data points

Let's take a closer look at time_bucket.

### time_bucket()

Here's an example of how to use [`time_bucket()`] to find the average temperature per 15 day period, for each city, in the past 6 months:

```sql
-----------------------------------
-- time_bucket
-- Average temp per 15 day period
-- for past 6 months, per city
-----------------------------------
SELECT time_bucket('15 days', time) as "bucket"
   ,city_name, avg(temp_c)
   FROM weather_metrics
   WHERE time > now() - (6* INTERVAL '1 month')
   GROUP BY bucket, city_name
   ORDER BY bucket DESC;
```

With time_bucket, you can monitor, analyze and visualize time-series data in the time intervals that matter most for your use-case (e.g 10 seconds, 15 minutes, 6 hours - whatever your time period of interest happens to be). This is because time_bucket enables you to segment data into arbitrary time intervals. Such intervals are often required when analyzing time-series data, but can sometimes be unwieldy depending on the constraints of the database, query language or all in one tool that you use.

For readers familiar with PostgreSQL, you can think of time_bucket as a more powerful version of the PostgreSQL date_trunc function. Time_bucket allows for arbitrary time intervals, rather than the standard day, minute, hour provided by date_trunc.

Time_bucket is just one of many TimescaleDB custom-built SQL functions to help you perform more insightful time-series analysis in fewer lines of code. Another powerful function for time-series analysis is time_bucket_gapfill.

### time_bucket_gapfill()

Another common problem in time-series analysis is dealing with imperfect datasets.
Some time-series analyses or visualizations want to display records for each
selected time period, even if no data was recorded during that period. This is
commonly termed "gap filling", and may involve performing such operations as
recording a "0" for any missing data, interpolating missing values, or carrying
the last observed value forward until new data is recorded.

Timescale provides [`time_bucket_gapfill()`],
[`locf()`], and [`interpolate()`] to help perform analysis on data with gaps,

In our sample dataset, we have days where there is no rain or snow for a particular
city. However, we might still want to perform an analysis or graph a trend line
about rain or snow for a particular time period.

For example, here's a query which calculates the total snowfall for each city in
30 day time periods for the past year:

```sql
-- non gapfill query
SELECT time_bucket('30 days', time) as bucket,
   city_name, sum(snow_1h_mm) as sum
   FROM weather_metrics
   WHERE time > now() - INTERVAL '1 year' AND time < now()
   GROUP BY bucket, city_name
   ORDER BY bucket DESC;
```

Notice that the results only include time_periods for when cities have snowfall,
rather than the specific time period of our analysis, which is one year.

To generate data for all the time buckets in our analysis period, we can use
time_bucket_gapfill instead:

```sql
-----------------------------------------
-- time_bucket_gapfill
-- total snow fall per city
-- in 30 day buckets for past 1 year
-----------------------------------------
SELECT time_bucket_gapfill('30 days', time) as bucket,
   city_name, sum(snow_1h_mm) as sum
   FROM weather_metrics
   WHERE time > now() - INTERVAL '1 year' AND time < now()
   GROUP BY bucket, city_name
   ORDER BY bucket DESC;
```

TimescaleDB SQL functions like time_bucket and time_bucket_gapfill are helpful
for historical analysis of your data and creating visuals with specific time-periods.

Now that you're equipped with the basics of time_bucket, let's learn about Continuous
Aggregates in the next section.



[`time_bucket()`]: /api/:currentVersion:/hyperfunctions/time_bucket
[`time_bucket_gapfill()`]: /api/:currentVersion:/hyperfunctions/gapfilling-interpolation/time_bucket_gapfill
[`last()`]: /api/:currentVersion:/hyperfunctions/last
[`first()`]: /api/:currentVersion:/hyperfunctions/first
[`locf()`]: /api/:currentVersion:/hyperfunctions/gapfilling-interpolation/locf
[`interpolate()`]: /api/:currentVersion:/hyperfunctions/gapfilling-interpolation/interpolate
