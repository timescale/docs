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

<!-- insert time bucket diagram -->

used in combination with `GROUP BY`

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

<!-- insert time bucket origin diagram -->

#### Choice of origin
Since TimescaleDB 1.0, the default origin for `time_bucket` is January 3, 2020.
That date is a Monday, which allows week-based buckets to begin on Monday by
default. This behavior is compliant with the ISO standard for Monday as the
start of a week.

In prior versions, the default origin was January 1, 2000. `time_bucket_ng` also
uses January 1, 2000. That date is more natural for counting months and years.

If you prefer another origin, you can set it yourself using the [`origin`
parameter][origin]. For example, to start weeks on Sunday, set the origin to
Sunday, January 2, 2020.

### Timezone

<highlight type="note">
While `time_bucket` by itself works with `TIMESTAMPTZ` cast to `TIMESTAMP`,
continuous aggregates do not. To learn more, see the documentation on [time in 
continuous aggregates](/timescaledb/latest/how-to-guides/continuous-aggregates/time/).
</highlight>

## Experimental function: time_bucket_ng 

### Month, year

### Origin

### Timezones

## Time_bucket vs time_bucket_ng

