---
title: Energy consumption data tutorial - query the data
excerpt: Energy consumption data
products: [cloud, mst, self_hosted]
keywords: [tutorials, query]
tags: [tutorials, beginner]
layout_components: [next_prev_large]
content_group: Analyze energy consumption data
---

# Query the data

When you have your dataset loaded, you can start constructing some queries to
discover what your data tells you.
This tutorial uses [Timescale hyperfunctions][about-hyperfunctions] to construct
queries that are not possible in standard PostgreSQL.

In this section, you learn how to construct queries, to answer these questions:

*   [Energy consumption by hour of day](#what-is-the-energy-consumption-by-the-hour-of-the-day)
*   [Energy consumption by weekday](#what-is-the-energy-consumption-by-the-day-of-the-week).
*   [Energy consumption by month](#what-is-the-energy-consumption-on-a-monthly-basis).

## What is the energy consumption by the hour of the day?

When you have your database set up for energy consumption data, you can
construct a query to find the median and the maximum consumption of energy on an
hourly basis in a typical day.

<Procedure>

### Finding how many kilowatts of energy is consumed on an hourly basis

1.  Connect to the Timescale database that contains the energy consumption dataset.
1.  At the psql prompt, use the Timescale Toolkit functionality to get calculate
    the fiftieth percentile or the median. Then calculate the maximum energy
    consumed using the standard PostgreSQL max function:

    ```sql
    WITH per_hour AS (
    SELECT
    time,
    value
    FROM kwh_hour_by_hour
    WHERE "time" at time zone 'Europe/Berlin' > date_trunc('month', time) - interval '1 year'
    ORDER BY 1
    ), hourly AS (
     SELECT
          extract(HOUR FROM time) * interval '1 hour' as hour,
          value
     FROM per_hour
    )
    SELECT
        hour,
        approx_percentile(0.50, percentile_agg(value)) as median,
        max(value) as maximum
    FROM hourly
    GROUP BY 1
    ORDER BY 1;
    ```

1.  The data you get back looks a bit like this:

    ```sql
          hour   |       median       | maximum
        ----------+--------------------+---------
         00:00:00 | 0.5998949812512439 |     0.6
         01:00:00 | 0.5998949812512439 |     0.6
         02:00:00 | 0.5998949812512439 |     0.6
         03:00:00 | 1.6015944383271534 |     1.9
         04:00:00 | 2.5986701108275327 |     2.7
         05:00:00 | 1.4007385207185301 |     3.4
         06:00:00 | 0.5998949812512439 |     2.7
         07:00:00 | 0.6997720645753496 |     0.8
         08:00:00 | 0.6997720645753496 |     0.8
         09:00:00 | 0.6997720645753496 |     0.8
         10:00:00 | 0.9003240409125329 |     1.1
         11:00:00 | 0.8001143897618259 |     0.9
    ```

</Procedure>

## What is the energy consumption by the day of the week?

You can also check how energy consumption varies between weekends and weekdays.

<Procedure>

### Finding energy consumption during the weekdays

1.  Connect to the Timescale database that contains the energy consumption dataset.
1.  At the psql prompt, use this query to find difference in consumption during
    the weekdays and the weekends:

    ```sql
    WITH per_day AS (
     SELECT
       time,
       value
     FROM kwh_day_by_day
     WHERE "time" at time zone 'Europe/Berlin' > date_trunc('month', time) - interval '1 year'
     ORDER BY 1
    ), daily AS (
        SELECT
           to_char(time, 'Dy') as day,
           value
        FROM per_day
    ), percentile AS (
        SELECT
            day,
            approx_percentile(0.50, percentile_agg(value)) as value
        FROM daily
        GROUP BY 1
        ORDER BY 1
    )
    SELECT
        d.day,
        d.ordinal,
        pd.value
    FROM unnest(array['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']) WITH ORDINALITY AS d(day, ordinal)
    LEFT JOIN percentile pd ON lower(pd.day) = lower(d.day);

    ```

1.  The data you get back looks a bit like this:

    ```sql
        day | ordinal |       value
    -----+---------+--------------------
     Mon |       2 |  23.08078714975423
     Sun |       1 | 19.511430831944395
     Tue |       3 | 25.003118897837307
     Wed |       4 |   8.09300571759772
     Sat |       7 |
     Fri |       6 |
     Thu |       5 |
    ```

</Procedure>

## What is the energy consumption on a monthly basis?

You may also want to check the energy consumption that occurs on a monthly basis.

<Procedure>

### Finding energy consumption for each month of the year

1.  Connect to the Timescale database that contains the energy consumption
    dataset.
1.  At the psql prompt, use this query to find consumption for each month of the
    year:

    ```sql
     WITH per_day AS (
     SELECT
       time,
       value
     FROM kwh_day_by_day
     WHERE "time" > now() - interval '1 year'
     ORDER BY 1
    ), per_month AS (
       SELECT
          to_char(time, 'Mon') as month,
           sum(value) as value
       FROM per_day
      GROUP BY 1
    )
    SELECT
       m.month,
       m.ordinal,
       pd.value
    FROM unnest(array['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']) WITH ORDINALITY AS m(month, ordinal)
    LEFT JOIN per_month pd ON lower(pd.month) = lower(m.month)
    ORDER BY ordinal;
    ```

1.  The data you get back looks a bit like this:

    ```sql
        month | ordinal |       value
        -------+---------+-------------------
        Jan   |       1 |
        Feb   |       2 |
        Mar   |       3 |
        Apr   |       4 |
        May   |       5 | 75.69999999999999
        Jun   |       6 |
        Jul   |       7 |
        Aug   |       8 |
        Sep   |       9 |
        Oct   |      10 |
        Nov   |      11 |
        Dec   |      12 |
    ```

1.  <Optional /> To visualize this in Grafana, create a new panel, and select
    the `Bar Chart` visualization. Select the energy consumption dataset as your
    data source, and type the query from the previous step. In the `Format as`
    section, select `Table`.

1.  <Optional /> Select a color scheme so that different consumptions are shown
    in different colors. In the options panel, under `Standard options`, change
    the `Color scheme` to a useful `by value` range.

    <img
    class="main-content__illustration"
    src="https://s3.amazonaws.com/assets.timescale.com/docs/images/grafana-energy.webp"
    width={1375} height={944}
    alt="Visualizing energy consumptions in Grafana"
    />

</Procedure>

[about-hyperfunctions]: https://docs.timescale.com/use-timescale/latest/hyperfunctions/about-hyperfunctions/
