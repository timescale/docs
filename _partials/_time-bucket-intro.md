The [`time_bucket`][time_bucket] function allows you to aggregate data into
buckets of time, for example: 5 minutes, 1 hour, or 3 days. It's similar to
PostgreSQL's [`date_bin`][date_bin] function, but it gives you more
flexibility in bucket size and start time.

Time bucketing is essential to working with time-series data. You can use it to
roll up data for analysis or downsampling. For example, you can calculate
5-minute averages for a sensor reading over the last day. You can perform these
rollups as needed, or pre-calculate them in [continuous aggregates][caggs].

Time bucketing groups data into time intervals. With `time_bucket`, the interval
length can be any number of microseconds, milliseconds, seconds, minutes, hours,
days, weeks, months, years, or centuries.

The `time_bucket` function is usually used in combination with `GROUP BY` to
aggregate data. For example, you can calculate the average, maximum, minimum, or
sum of values within a bucket.

<img class="main-content__illustration"
    src="https://assets.timescale.com/docs/images/getting-started/time-bucket.webp"
    alt="Diagram showing time-bucket aggregating data into daily buckets, and calculating the daily sum of a value"
/>
