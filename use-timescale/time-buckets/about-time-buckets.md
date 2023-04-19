---
title: About time buckets
excerpt: Learn how time buckets help you aggregate data by time interval
products: [cloud, mst, self_hosted]
keywords: [time buckets]
---

# About time buckets

The [`time_bucket`][time_bucket] function allows you to aggregate data into
buckets of time, for example: 5 minutes, 1 hour, or 3 days. It's similar to
PostgreSQL's [`date_bin`][date_bin] function, but it gives you more
flexibility in bucket size and start time.

Time bucketing is essential to working with time-series data. You can use it to
roll up data for analysis or downsampling. For example, you can calculate
5-minute averages for a sensor reading over the last day. You can perform these
rollups as needed, or pre-calculate them in [continuous aggregates][caggs].

This section explains how time bucketing works. For examples of the
`time_bucket` function, see the section on
[using time buckets][use-time-buckets].

## How time bucketing works

Time bucketing groups data into time intervals. With `time_bucket`, the interval
length can be any number of microseconds, milliseconds, seconds, minutes, hours,
days, weeks, months, years, or centuries.

The `time_bucket` function is usually used in combination with `GROUP BY` to
aggregate data. For example, you can calculate the average, maximum, minimum, or
sum of values within a bucket.

<img class="main-content__illustration"
    src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/time-bucket.jpg"
    alt="Diagram showing time-bucket aggregating data into daily buckets, and calculating the daily sum of a value"
/>

### Origin

The origin determines when time buckets start and end. By default, a time bucket
doesn't start at the earliest timestamp in your data. There is often a more
logical time. For example, you might collect your first data point at `00:37`,
but you probably want your daily buckets to start at midnight. Similarly, you
might collect your first data point on a Wednesday, but you might want your
weekly buckets calculated from Sunday or Monday.

Instead, time is divided into buckets based on intervals from the origin. The
following diagram shows how, using the example of 2-week buckets. The first
possible start date for a bucket is `origin`. The next possible start date for a
bucket is `origin + bucket interval`. If your first timestamp does not fall
exactly on a possible start date, the immediately preceding start date is used
for the beginning of the bucket.

<img
  src="https://s3.amazonaws.com/assets.timescale.com/docs/images/time-bucket-origin.jpg"
  class="main-content__illustration"
  alt="Diagram showing how time buckets are calculated from the origin"
/>

For example, say that your data's earliest timestamp is April 24, 2020. If you
bucket by an interval of two weeks, the first bucket doesn't start on April 24,
which is a Friday. It also doesn't start on April 20, which is the immediately
preceding Monday. It starts on April 13, because you can get to April 13, 2020,
by counting in two-week increments from January 3, 2000, which is the default
origin in this case.

#### Default origins

For intervals that don't include months or years, the default origin is January
3, 2000. For month, year, or century intervals, the default origin is January 1,
2000. For integer time values, the default origin is 0.

These choices make the time ranges of time buckets more intuitive. Because
January 3, 2000, is a Monday, weekly time buckets start on Monday. This is
compliant with the ISO standard for calculating calendar weeks. Monthly and
yearly time buckets use January 1, 2000, as an origin. This allows them to start
on the first day of the calendar month or year.

If you prefer another origin, you can set it yourself using the [`origin`
parameter][origin]. For example, to start weeks on Sunday, set the origin to
Sunday, January 2, 2000.

### Timezones

The origin time depends on the data type of your time values.

If you use `TIMESTAMP`, by default, bucket start times are aligned with
`00:00:00`. Daily and weekly buckets start at `00:00:00`. Shorter buckets start
at a time that you can get to by counting in bucket increments from `00:00:00`
on the origin date.

If you use `TIMESTAMPTZ`, by default, bucket start times are aligned with
`00:00:00 UTC`. To align time buckets to another timezone, set the `timezone`
parameter.

[caggs]: /use-timescale/:currentVersion:/continuous-aggregates/
[date_bin]: https://www.postgresql.org/docs/current/functions-datetime.html#FUNCTIONS-DATETIME-BIN
[origin]: /api/:currentVersion:/hyperfunctions/time_bucket/#optional-arguments-for-interval-time-inputs
[time_bucket]: /api/:currentVersion:/hyperfunctions/time_bucket/
[use-time-buckets]: /use-timescale/:currentVersion:/time-buckets/use-time-buckets/
