# Gapfilling and interpolation
Most time-series data analysis techniques aggregate data into fixed time
intervals, which smooths the data and makes it easier to interpret and analyze.
When you write queries for this type of reporting, you need an efficient way to
aggregate raw observations, which are often noisy and irregular, in to fixed
time intervals. TimescaleDB does this using time bucketing, which gives a clear
picture of the important data trends using a concise, declarative SQL query.

Sorting data into time buckets works well in most cases, but problems can arise
if there are gaps in the data. This can happen if you have irregular sampling
intervals, or you have experienced an outage of some sort. You can use a
gapfilling function to create additional rows of data in any gaps, ensuring that
the returned rows are in chronological order, and contiguous.

If you have a time bucket that has no data at all, the average returned from the
time bucket is NULL, which could cause problems if you are looking for averages
in your data. To avoid this problem, you can use last value carried forward
(locf), which takes the last known value and uses it for the missing data.

You can also use linear interpolation to fill gaps in your data. This takes the
last known value, and the next known value, and assumes there is a straight line
between them.
