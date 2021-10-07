# Approximate percentiles
Timescale uses approximation algorithms to calculate a percentile without
requiring all of the data. This also makes them more compatible with continuous
aggregates. By default, Timescale Toolkit uses `uddsketch`, but you can also
choose to use `tdigest`. See the
[developer documentation][gh-analytics-algorithms] for more information about these
algorithms.

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
[approx-percentile-blog]: https://blog.timescale.com/blog/how-percentile-approximation-works-and-why-its-more-useful-than-averages/
