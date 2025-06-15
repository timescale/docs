---
title: Time-weighted average
excerpt: A time-weighted average in TimescaleDB is an aggregate that weights each value using LOCF or interpolation. Construct and run a sample time-weighted average query
products: [cloud, mst, self_hosted]
keywords: [hyperfunctions, Toolkit, time-weighted]
---

# Time-weighted average

Time weighted average in $TIMESCALE_DB is implemented as an aggregate that
weights each value using last observation carried forward (LOCF), or linear
interpolation. The aggregate is not parallelizable, but it is supported with
[continuous aggregation][caggs].

## Run a time-weighted average query

In this procedure, we are using an example table called `freezer_temps` that
contains data about internal freezer temperatures.

<Procedure>

### Running a time-weighted average query

1.  At the `psql`prompt, find the average and the time-weighted average of
    the data:

    ```sql
    SELECT freezer_id,
      avg(temperature),
     average(time_weight('Linear', ts, temperature)) as time_weighted_average
    FROM freezer_temps
    GROUP BY freezer_id;
    ```

1.  To determine if the freezer has been out of temperature range for more
    than 15 minutes at a time, use a time-weighted average in a window function:

    ```sql
    SELECT *,
    average(
            time_weight('Linear', ts, temperature) OVER (PARTITION BY freezer_id ORDER BY ts RANGE  '15 minutes'::interval PRECEDING )
           ) as rolling_twa
    FROM freezer_temps
    ORDER BY freezer_id, ts;
    ```

</Procedure>

For more information about time-weighted average API calls, see the
[hyperfunction API documentation][hyperfunctions-api-timeweight].

[caggs]: /use-timescale/:currentVersion:/continuous-aggregates
[hyperfunctions-api-timeweight]: /api/:currentVersion:/hyperfunctions/time-weighted-calculations/time_weight/
