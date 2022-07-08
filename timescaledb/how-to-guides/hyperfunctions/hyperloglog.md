# Hyperloglog
Hyperloglog is typically used to find the cardinality of very large datasets. If you want
to find the number of unique values, or cardinality, in a dataset, the time it
takes to process this query is proportional to how large the dataset is. So if
you wanted to find the cardinality of a dataset that contained only 20 entries,
the calculation would be very fast. Finding the cardinality of a dataset that
contains 20 million entries, however, can take a significant amount of
time and compute resources.

Hyperloglog does not calculate the exact cardinality of a dataset, but rather
estimates the number of unique values. It does this by converting the original
data into a hash of random numbers that represents the cardinality of the
dataset. This is not a perfect calculation of the cardinality, but it is usually
within a margin of error of 2%.

The benefit of hyperloglog on time-series data is that it can continue to
calculate the approximate cardinality of a dataset as it changes over time. It
does this by adding an entry to the hyperloglog hash as new data is retrieved,
rather than recalculating the result for the entire dataset every time it is
needed. This makes it an ideal candidate for using with continuous aggregates.

For more information about approximate count distinct API calls, see the
[hyperfunction API documentation][hyperfunctions-api-approx-count-distincts].


[hyperfunctions-api-approx-count-distincts]: /api/:currentVersion:/hyperfunctions/approx_count_distincts/
