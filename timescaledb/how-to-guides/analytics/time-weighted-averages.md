# Time-weighted averages
Time weighted averages are used in cases where a time series is not evenly
sampled. Time series data points are often evenly spaced, for example every 30
seconds, or every hour. But sometimes data points are recorded irregularly, for
example if a value has a large change, or changes quickly. Computing an average
on data that is not evenly sampled is not always useful.

For example, if you have a lot of ice cream in freezers, you need to make sure
the ice cream stays within a 0-10℉ (-20 to -12℃) temperature range. The
temperature in the freezer can vary if folks are opening and closing the door,
but the ice cream will only have a problem if the temperature is out of range
for a long time. You can set your sensors in the freezer to sample every five
minutes while the temperature is in range, and every 30 seconds while the
temperature is out of range. If the results are generally stable, but with some
quick moving transients, an average of all the data points weights the transient
values too highly. A time weighted average weights each value by the duration
over which it occurred based on the points around it, producing much more
accurate results.

Timescale Analytics' time weighted average is implemented as an aggregate that
weights each value using last observation carried forward (LOCF), or linear
interpolation. The aggregate is not parallelizable, but it is supported with
[continuous aggregation][caggs]. See the Analytics documentation for more
information about [interpolation methods][gh-interpolation],
and [parallelism and ordering][gh-parallelism].


## Run a time-weighted average query
In this procedure, we are using an example table called `freezer_temps` that contains data about internal freezer temperatures.

### Procedure: Running a time-weighted average query
1.  At the `psql`prompt, find the average and the time-weighted average of the data:
    ```sql
    SELECT freezer_id,
      avg(temperature),
	    average(time_weight('Linear', ts, temperature)) as time_weighted_average
    FROM freezer_temps
    GROUP BY freezer_id;
    ```
1.  To determine if the freezer has been out of temperature range for more than 15 minutes at a time, use a time-weighted average in a window function:
    ```sql
    SELECT *,
    average(
	           time_weight('Linear', ts, temperature) OVER (PARTITION BY freezer_id ORDER BY ts RANGE  '15 minutes'::interval PRECEDING )
	          ) as rolling_twa
    FROM freezer_temps
    ORDER BY freezer_id, ts;
    ```


[caggs]: /how-to-guides/continuous-aggregates
[gh-interpolation]: https://github.com/timescale/timescale-analytics/blob/main/docs/time_weighted_average.md#interpolation-methods-details
[gh-parallelism]: https://github.com/timescale/timescale-analytics/blob/main/docs/time_weighted_average.md#notes-on-parallelism-and-ordering
