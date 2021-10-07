# Percentile approximation
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
ordered list. Timescale uses approximation algorithms to calculate a
percentile without requiring all of the data. This also makes them more
compatible with continuous aggregates. By default, Timescale Toolkit uses
`uddsketch`, but you can also choose to use `tdigest`. See
the [developer documentation][gh-analytics-algorithms] for more information
about these algorithms.

<highlight type "note">
Technically, a percentile divides a group into 100 equally sized pieces, while a
quantile divides a group into an arbitrary number of pieces. Because we don't
always use exactly 100 buckets, "quantile" is the more technically correct term
in this case. However, we use the word "percentile" because it's a more common
word for this type of function.
</highlight>

For more information about approximate percentiles, read our [blog post][approx-percentile-blog].
