# Time bucket gapfill
Sorting data into time buckets works well in most cases, but problems can arise
if there are gaps in the data. This can happen if you have irregular sampling
intervals, or you have experienced an outage of some sort. If you have a time
bucket that has no data at all, the average returned from the time bucket is
NULL, which could cause problems. You can use a gapfilling function to create
additional rows of data in any gaps, ensuring that the returned rows are in
chronological order, and contiguous. The time bucket gapfill function creates a
contiguous set of time buckets but does not fill the rows with data. You can
create data for the new rows using another function, such as locf or
interpolate.

For more information about gapfilling and interpolation API calls, see the
[hyperfunction API documentation][hyperfunctions-api-gapfilling].


[hyperfunctions-api-gapfilling]: /api/:currentVersion:/hyperfunctions/gapfilling-interpolation/
