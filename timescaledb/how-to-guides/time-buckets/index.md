# Time buckets in TimescaleDB
In TimescaleDB, you can work with time buckets using the
[`time_bucket`][time_bucket] function. This function allows you to group data
into buckets of time, for example: 5 minutes, 1 hour, or 3 days.

It's similar to PostgreSQL's [`date_trunc`][date_trunc] function, but it gives
you more flexibility in bucket size and start time.

Time bucketing is essential to working with time series. You can use it to roll
up data for analysis or downsampling. For example, you can calculate five-minute
averages for a sensor reading over the last day. You can perform these rollups
as needed or pre-calculate them in [continuous aggregates][caggs].

## How time bucketing works
Time bucketing groups data into time intervals. With `time_bucket`, the interval
length can be any number of microseconds, milliseconds, seconds, minutes, hours,
days, or weeks.

`time_bucket` is usually used in combination with `GROUP BY` to aggregate data.
For example, you can calculate the average, maximum, or minimum value within a
bucket.

<!-- insert time bucket and data diagram -->

<highlight type="note"> 
`time_bucket` doesn't support months, years, and timezones. The experimental
function `time_bucket_ng` adds support for these intervals and parameters. To
learn more, see the sections on [timezones](#timezones) and
[`time_bucket_ng`][time_bucket_ng].
</highlight>

### Origin
Bucket start and end times are calculated based on an origin time. For a
week-based bucket, `time_bucket` needs some way to determine when to start
counting weeks. For a day-based bucket, it needs some way to determine when to
start counting days, and so on.

It uses the `origin` date and time. The default origin for `time_bucket` is
January 3, 2000. Counting from the origin, the first possible start date for a
two-week time bucket is January 3, 2000. The next possible start date is two
weeks from then, on January 17, 2000, and so on.

For example, say that your data's earliest timestamp is April 24, 2020. If you
bucket by an interval of two weeks, the first bucket doesn't start on April 24,
which is a Friday. It doesn't start on April 20, which is the immediately
preceding Monday. It starts on April 13, because you can get to April 13, 2020,
by counting in two-week increments from January 3, 2000.

<!-- TODO: insert time bucket origin diagram -->

#### Choice of origin
Since TimescaleDB 1.0, the default origin for `time_bucket` is January 3, 2020.
That date is a Monday, which allows week-based buckets to begin on Monday by
default. This behavior is compliant with the ISO standard for Monday as the
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
at a time that you can get to by counting in increments from `00:00:00` on
January 3, 2000.

If you use `TIMESTAMPTZ`, by default, bucket start times are aligned with
`00:00:00+00`, or in other words, `00:00:00` UTC time. To get buckets aligned to
local time, cast the `TIMESTAMP` to `TIMESTAMPTZ` before passing it to
`time_bucket`.

<!-- QUESTION: What about integer time values? -->

<highlight type="note">
Casting `TIMESTAMP` to `TIMESTAMPTZ` works outside of continuous aggregates. For
example, you can use it in a stand-alone `SELECT` statement to perform a
one-time calculation. It does not work within continuous aggregates. To learn 
more, see the section on [time in continuous aggregates](/timescaledb/latest/how-to-guides/continuous-aggregates/time/).
</highlight>

## Experimental function: time_bucket_ng
The experimental function [`time_bucket_ng`][time_bucket_ng] adds new features,
including support for months, years, and timezones.

<highlight type="warning">
Experimental features could have bugs! They might not be backwards compatible,
and could be removed in future releases. When this function is no longer experimental,
you will need to delete and rebuild any continuous aggregate that uses it.
Use experimental features at your own risk and we do not recommend to use
any experimental feature in a production environment.
</highlight>

### Months and years
In addition to the time units supported by `time_bucket`, `time_bucket_ng` also
supports months and years. For example, you can bucket data into three-month or
five-year intervals.

### Origin
By default, `time_bucket_ng` uses Saturday, January 1, 2000 for its origin. This
is different from `time_bucket`. Because `time_bucket_ng` supports months and
years, January 1 provides a more natural starting date for counting intervals.

Unlike `time_bucket`, `time_bucket_ng` doesn't support dates before the origin.
In other words, by default, you cannot use `time_bucket_ng` with data from
before the year 2000. If you need to go farther back in time, you can change the
origin by setting the [`origin` parameter][origin].

<!-- QUESTION: Limitations of going back in time? -->

### Timezones
`time_bucket_ng` adds support for timezones. By setting the `timezone`
parameter, you can align bucket start times to local time, even if the time
values are in `TIMESTAMPTZ` form. That means you can start daily buckets at
midnight local time rather than UTC time.

## Time_bucket vs time_bucket_ng
There are several differences between `time_bucket` and `time_bucket_ng`:

|Feature|`time_bucket`|`time_bucket_ng`|
|-|-|-|
|Bucket by microseconds, milliseconds, seconds, hours, minutes, days, and weeks|✅|✅|
|Bucket by months and years|❌|✅|
|Origin|January 3, 2000|January 1, 2000|
|Bucket dates before the origin|✅|❌ Work around this by changing the origin.|
