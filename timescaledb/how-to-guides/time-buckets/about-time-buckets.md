import Experimental from 'versionContent/_partials/_experimental.mdx';

# About time buckets
The [`time_bucket`][time_bucket] function allows you to aggregate data into
buckets of time, for example: 5 minutes, 1 hour, or 3 days. It's similar to
PostgreSQL's [`date_trunc`][date_trunc] function, but it gives you more
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
days, or weeks.

`time_bucket` is usually used in combination with `GROUP BY` to aggregate data.
For example, you can calculate the average, maximum, minimum, or sum of values
within a bucket.

<img class="main-content__illustration"
    src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/time-bucket.jpg"
    alt="Diagram showing time-bucket aggregating data into daily buckets, and calculating the daily sum of a value"
/>

<highlight type="note"> 
`time_bucket` doesn't support months, years, or timezones. The experimental
function `time_bucket_ng` adds support for these intervals and parameters. To
learn more, see the section on
[`time_bucket_ng`](#experimental-function-time-bucket-ng).
</highlight>

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

The default origin for `time_bucket` is January 3, 2000. For integer time
values, the default origin is 0.

For example, say that your data's earliest timestamp is April 24, 2020. If you
bucket by an interval of two weeks, the first bucket doesn't start on April 24,
which is a Friday. It doesn't start on April 20, which is the immediately
preceding Monday. It starts on April 13, because you can get to April 13, 2020,
by counting in two-week increments from January 3, 2000.

#### Choice of origin
In TimescaleDB 1.0 and above, the default origin for `time_bucket` is January 3,
2000. That date is a Monday, which allows week-based buckets to begin on Monday
by default. This behavior is compliant with the ISO standard for Monday as the
start of a week.

In prior versions, the default origin was January 1, 2000. `time_bucket_ng` also
uses January 1, 2000. That date is more natural for counting months and years.

If you prefer another origin, you can set it yourself using the [`origin`
parameter][origin]. For example, to start weeks on Sunday, set the origin to
Sunday, January 2, 2000.

### Timezones
The origin time depends on the data type of your time values.

If you use `TIMESTAMP`, by default, bucket start times are aligned with
`00:00:00`. Daily and weekly buckets start at `00:00:00`. Shorter buckets start
at a time that you can get to by counting in bucket increments from `00:00:00`
on January 3, 2000.

If you use `TIMESTAMPTZ`, by default, bucket start times are aligned with
`00:00:00 UTC`. To get buckets aligned to local time, cast the `TIMESTAMPTZ` to
`TIMESTAMP` before passing it to `time_bucket`.

<highlight type="note">
Casting `TIMESTAMPTZ` to `TIMESTAMP` works outside of continuous aggregates. For
example, you can use it in a stand-alone `SELECT` statement to perform a
one-time calculation. It does not work within continuous aggregates. To learn 
more, see the section on [time in continuous aggregates](/timescaledb/latest/how-to-guides/continuous-aggregates/time/).
</highlight>

### Time_bucket in continuous aggregates
Time buckets are commonly used to create [continuous aggregates][caggs].
Continuous aggregates add some limitations to what you can do with
`time_bucket`.

Continuous aggregates don't allow functions that depend on a local timezone
setting. That is, you cannot cast `TIMESTAMPTZ` to `TIMESTAMP` within a
continuous aggregate definition. To learn more and find a workaround, see the
section on [time in continuous aggregates][time-cagg].

Continuous aggregates also don't allow named parameters.

## Experimental function: time_bucket_ng
The experimental function [`time_bucket_ng`][time_bucket_ng] adds new features,
including support for months, years, and timezones.

<Experimental />

### Months and years
In addition to the time units supported by `time_bucket`, `time_bucket_ng` also
supports months and years. For example, you can bucket data into 3-month or
5-year intervals.

### Origin
By default, `time_bucket_ng` uses Saturday, January 1, 2000 for its origin. This
differs from `time_bucket`. Because `time_bucket_ng` supports months and years,
January 1 provides a more natural starting date for counting intervals.

Unlike `time_bucket`, `time_bucket_ng` doesn't support dates before the origin.
In other words, by default, you cannot use `time_bucket_ng` with data from
before the year 2000. If you need to go farther back in time, you can change the
origin by setting the [`origin` parameter][origin-ng].

### Timezones
`time_bucket_ng` adds support for timezones. By setting the `timezone`
parameter, you can align bucket start times to local time, even if the time
values are in `TIMESTAMPTZ` form. That means you can start daily buckets at
midnight local time rather than UTC time.

### Time_bucket_ng in continuous aggregates
Time buckets are commonly used to create [continuous aggregates][caggs].
Continuous aggregates add some limitations to what you can do with
`time_bucket_ng`. For example, continuous aggregates don't allow named
parameters.

Here are the `time_bucket_ng` features supported by continuous aggregates:

|Feature|Available in continuous aggregate|TimescaleDB version|
|-|-|-|
|Buckets by seconds, minutes, hours, days, and weeks|✅|2.4.0 and later|
|Buckets by months and years|✅|2.6.0 and later|
|Timezones|✅|2.6.0 and later|
|Custom origin|✅|2.7.0 and later|

## Time_bucket compared to time_bucket_ng
There are several differences between `time_bucket` and `time_bucket_ng`:

|Feature|`time_bucket`|`time_bucket_ng`|
|-|-|-|
|Bucket by microseconds, milliseconds, seconds, hours, minutes, days, and weeks|✅|✅|
|Bucket by months and years|❌|✅|
|Bucket `TIMESTAMPTZ` values according to local time using the `timezone` parameter|❌|✅|
|Origin|January 3, 2000|January 1, 2000|
|Bucket dates before the origin|✅|❌ Work around this by changing the origin.|

[caggs]: /timescaledb/:currentVersion:/how-to-guides/continuous-aggregates/
[date_trunc]: https://www.postgresql.org/docs/current/functions-datetime.html#FUNCTIONS-DATETIME-TRUNC
[time_bucket]: /api/:currentVersion:/hyperfunctions/time_bucket/
[time_bucket_ng]: /api/:currentVersion:/hyperfunctions/time_bucket_ng/
[time-cagg]: /timescaledb/:currentVersion:/how-to-guides/continuous-aggregates/time/
[origin]: /api/:currentVersion:/hyperfunctions/time_bucket/#optional-arguments-for-interval-time-inputs
[origin-ng]: /api/:currentVersion:/hyperfunctions/time_bucket_ng/#optional-arguments
[use-time-buckets]: /timescaledb/:currentVersion:/how-to-guides/time-buckets/use-time-buckets/
