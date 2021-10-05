# Approximate percentiles
In general, percentiles are useful for understanding the distribution of data.
The 50th percentile is the point at which half of your data is greater and half
is lesser. The 10th percentile is the point at which 90% of the data is greater,
and 10% is lesser. The 99th percentile is the point at which 1% is greater, and
99% is lesser.

The 50th percentile, or median, is often a more useful measure than the average,
especially when your data contains outliers. Outliers can dramatically change
the average, but do not affect the median as much. For example, if you have
three rooms in your house and two of them are 40℉ (4℃) and one is 130℉ (54℃),
the fact that the average room is 70℉ (21℃) doesn't matter much. However, the
50th percentile temperature is 40℉ (4℃), and tells you that at least half your
rooms are at refrigerator temperatures (also, you should probably get your
heating checked!)

Percentiles are sometimes used less frequently because they can use more CPU and
memory to calculate than an average or another aggregate measure. This is
because an exact computation of the percentile needs the full dataset as an
ordered list. Timescale Toolkit uses approximation algorithms to calculate a
percentile without requiring all of the data. This also makes them more
compatible with continuous aggregates. By default, Timescale Toolkit uses
`uddsketch`, but you can also choose to use `tdigest`. See
the [Toolkit documentation][gh-analytics-algorithms] for more information
about these algorithms.

<highlight type="tip">
Technically, a percentile divides a group into 100 equally sized pieces, while a
quantile divides a group into an arbitrary number of pieces. Because we don't
always use exactly 100 buckets, "quantile" is the more technically correct term
in this case. However, we use the word "percentile" because it's a more common
word for this type of function.
</highlight>

## Run an approximate percentage query
In this procedure, we are using an example table called `response_times` that contains information about how long a server takes to respond to API calls.

### Procedure: Running an approximate percentage query
1.  At the `psql` prompt, create a continuous aggregate that computes the daily aggregates:
    ```sql
    CREATE MATERIALIZED VIEW response_times_daily
    WITH (timescaledb.continuous)
    AS SELECT
      time_bucket('1 day'::interval, ts) as bucket,
      percentile_agg(response_time_ms)
    FROM response_times
    GROUP BY 1;
    ```
1.  Re-aggregate the aggregate to get the last 30 days, and look for the 95th percentile:
    ```sql
    SELECT approx_percentile(0.95, percentile_agg(percentile_agg)) as threshold
    FROM response_times_daily
    WHERE bucket >= time_bucket('1 day'::interval, now() - '30 days'::interval);
    ```
1.  You can also create an alert:
    ```sql
    WITH t as (SELECT approx_percentile(0.95, percentile_agg(percentile_agg)) as threshold
    FROM response_times_daily
    WHERE bucket >= time_bucket('1 day'::interval, now() - '30 days'::interval))

    SELECT count(*)
    FROM response_times
    WHERE ts > now()- '1 minute'::interval
    AND response_time_ms > (SELECT threshold FROM t);
    ```


[gh-analytics-algorithms]: https://github.com/timescale/timescale-analytics/blob/main/docs/percentile_approximation.md#advanced-usage
