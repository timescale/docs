---
title: Percentile approximation advanced aggregation methods
excerpt: Use approximation algorithms to quickly estimate percentiles
products: [cloud, mst, self_hosted]
keywords: [hyperfunctions, Toolkit, percentiles, uddsketch, tdigest]
---

# Percentile approximation advanced aggregation methods

Timescale uses approximation algorithms to calculate a percentile without
requiring all of the data. This also makes them more compatible with continuous
aggregates. By default, TimescaleDB uses `uddsketch`, but you can also choose to
use `tdigest`. This section describes the different methods, and helps you to
decide which one you should use.

`uddsketch` is the default algorithm. It uses exponentially sized buckets to
guarantee the approximation falls within a known error range, relative to the
true discrete percentile. This algorithm offers the ability to tune the size and
maximum error target of the sketch.

`tdigest` buckets data more aggressively toward the center of the quantile
range, giving it greater accuracy at the tails of the range, around 0.001 or
0.995.

## Choose the right algorithm

Each algorithm has different features, which can make one better than another
depending on your use case. Here are some of the differences to consider when
choosing an algorithm:

Before you begin, it is important to understand that the formal definition for
a percentile is imprecise, and there are different methods for determining what
the true percentile actually is. In PostgreSQL, given a target percentile `p`,
[`percentile_disc`][pg-percentile] returns the smallest element of a set, so
that `p` percent of the set is less than that element. However,
[`percentile_cont`][pg-percentile] returns an interpolated value between the two
nearest matches for `p`. In practice, the difference between these methods is
very small but, if it matters to your use case, keep in mind that `tdigest`
approximates the continuous percentile, while `uddsketch` provides an estimate
of the discrete value.

Think about the types of percentiles you're most interested in. `tdigest` is
optimized for more accurate estimates at the extremes, and less accurate
estimates near the median. If your workflow involves estimating ninety-ninth
percentiles, then choose `tdigest`. If you're more concerned about getting
highly accurate median estimates, choose `uddsketch`.

The algorithms differ in the way they estimate data. `uddsketch` has a stable
bucketing function, so it always returns the same percentile estimate for
the same underlying data, regardless of how it is ordered or re-aggregated. On
the other hand,  `tdigest` builds up incremental buckets based on the average of
nearby points, which can result in some subtle differences in estimates based on
the same data unless the order and batching of the aggregation is strictly
controlled, which is sometimes difficult to do in PostgreSQL. If stable
estimates are important to you, choose `uddsketch`.

Calculating precise error bars for `tdigest` can be difficult, especially when
merging multiple sub-digests into a larger one. This can occur through summary
aggregation, or parallelization of the normal point aggregate. If you need to
tightly characterize your errors, choose `uddsketch`. However, because
`uddsketch` uses exponential bucketing to provide a guaranteed relative error,
it can cause some wildly varying absolute errors if the dataset covers a large
range. For example, if the data is evenly distributed over the range `[1,100]`,
estimates at the high end of the percentile range have about 100 times the
absolute error of those at the low end of the range. This gets much more extreme
if the data range is `[0,100]`. If having a stable absolute error is important to
your use case, choose `tdigest`.

While both algorithms are likely to get smaller and faster with future
optimizations, `uddsketch` generally requires a smaller memory footprint than
`tdigest`, and a correspondingly smaller disk footprint for any continuous
aggregates. Regardless of the algorithm you choose, the best way to improve the
accuracy of your percentile estimates is to increase the number of buckets,
which is simpler to do with `uddsketch`. If your use case does not get a clear
benefit from using `tdigest`, the default `uddsketch` is your best choice.

For some more technical details and usage examples of the different algorithms,
see the developer documentation for [uddsketch][gh-uddsketch] and
[tdigest][gh-tdigest].

[pg-percentile]: https://www.postgresql.org/docs/current/functions-aggregate.html#FUNCTIONS-ORDEREDSET-TABLE
[gh-tdigest]: https://github.com/timescale/timescaledb-toolkit/blob/main/docs/tdigest.md
[gh-uddsketch]: https://github.com/timescale/timescaledb-toolkit/blob/main/docs/uddsketch.md
