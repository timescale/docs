# Hyperloglog
Hyperloglog is used to find the cardinality of very large datasets. If you want
to find the number of unique values, or cardinality, in a dataset, the time it
takes to process this query is proportional to how large the dataset is. So if
you wanted to find the cardinality of a dataset that contained only 20 entries,
the calculation would be very fast. Finding the cardinality of a dataset that
contains 20,000 or 20 million entries, however, can take a significant amount of
time and compute resources.

Hyperloglog does not calculate the exact cardinality of a dataset, but rather
estimates the number of unique values. It does this by converting the original
data into a hash of random numbers that represents the cardinality of the
dataset. This is not a perfect calculation of the cardinality, but it is usually
within a margin of error of 2%.

The benefit of hyperloglog on time-series data, is that it can continue to
calculate the approximate cardinality of a dataset as it changes over time, by
adding an entry to the hyperloglog hash as new data is retrieved, rather than
recalculating the result for the entire dataset every time it is needed. This
makes it an ideal candidate for using with continuous aggregates.

## Run a hyperloglog query
In this procedure, we are using an example table called `response_times` that contains information about how long a server takes to respond to API calls.

### Procedure: Running a hyperloglog query
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
