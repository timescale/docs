# Percentile aggregation methods

[`Approx_percentile()`](/hyperfunctions/percentile-approximation/approx_percentile/) and the other [value-add functions] (/hyperfunctions/percentile-approximation/#accessor-functions) used with percentiles need a 
percentile estimator as an input. The following three aggregation methods provide percentile estimators for further calculations:

[`Percentile_agg()`](/hyperfunctions/percentile-approximation/aggregation-methods/percentile_agg) is
typically the best option for general, fast percentile 
approximation calculations. This is the aggregate function we use in most examples 
throughout the documentation, and we recommend that users start with this before trying the other algorithms. 
However, we provide both 
[`uddsketch()`](/hyperfunctions/percentile-approximation/aggregation-methods/uddsketch/) and 
[`tdigest()`](/hyperfunctions/percentile-approximation/aggregation-methods/tdigest/) if your use case
requires more specific tuning ability that `percentile_agg()` doesn't provide. 

## Advanced Usage 

### Algorithms Basics
While the simple `percentile_agg` interface will be sufficient for many users, we do provide more specific APIs for advanced users who want more control of how their percentile approximation is computed and how much space the intermediate representation uses.  We currently provide implementations of the following percentile approximation algorithms:

- [T-Digest](/hyperfunctions/percentile-approximation/aggregation-methods/tdigest/) – This algorithm buckets data more aggressively toward the center of the quantile range, giving it greater accuracy near the tails (i.e. 0.001 or 0.995).
- [UddSketch](/hyperfunctions/percentile-approximation/aggregation-methods/uddsketch/) – This algorithm uses exponentially sized buckets to guarantee the approximation falls within a known error range, relative to the true discrete percentile.

The `UddSketch` algorithm underlies the `percentile_agg()` interface, it offers tunability for the size and maximum error target of the sketch, while `percentile_agg` uses preset defaults. 

### Choosing the Right Algorithm for Your Use-Case
There are different tradeoffs that each algorithm makes, and different use cases where each will shine.  The doc pages above each link to the research papers fully detailing the algorithms if you want all the details.  However, at a higher level, here are some of the differences to consider when choosing an algorithm:
1) First off, it's interesting to note that the formal definition for a percentile is actually impercise, and there are different methods for determining what the true percentile actually is.  In Postgres, given a target percentile 'p', [`percentile_disc`](https://www.postgresql.org/docs/current/functions-aggregate.html#FUNCTIONS-ORDEREDSET-TABLE) will return the smallest element of a set such that 'p' percent of the set is less than that element, while [`percentile_cont`](https://www.postgresql.org/docs/current/functions-aggregate.html#FUNCTIONS-ORDEREDSET-TABLE) will return an interpolated value between the two nearest matches for 'p'.  The difference here isn't usually that interesting in practice, but if it matters to your use case, then keep in mind that TDigest will approximate the continous percentile while UddSketch provides an estimate of the discrete value.
2) It's also important to consider the types of percentiles you're most interested in.  In particular, TDigest is optimized to trade off more accurate estimates at the extremes with weaker estimates near the median.  If your work flow involves estimating 99th percentiles, this is probably a good trade off.  However if you're more concerned about getting highly accurate median estimates, UddSketch is probably a better fit.
3) UddSketch has a stable bucketing function, so it will always return the same quantile estimate for the same underlying data, regardless of how it is ordered or reaggregated.  TDigest, on the other hand, builds up incremental buckets based on the average of nearby points, which will result in (usually subtle) differences in estimates based on the same data, unless the order and batching of the aggregation is strictly controlled (which can be difficult to do in Postgres).  Therefore, if having stable estimates is important to you, UddSketch will likely be required.
4) Trying to calculate percise error bars for TDigest can be difficult, especially when merging multiple subdigests into a larger one (this can come about either through summary aggregation or just parallelization of the normal point aggregate).  If being able to tightly characterize your error is important, UddSketch will likely be the desired algorithm.
5) That being said, the fact that UddSketch uses exponential bucketing to provide a guaranteed relative error can cause some wildly varying absolute errors if the data set covers a large range.  For instance if the data is evenly distributed over the range [1,100], estimates at the high end of the percentile range would have about 100 times the absolute error of those at the low end of the range.  This gets much more extreme if the data range is [0,100].  If having a stable absolute error is important to your use case, consider TDigest.
6) While both implementation will likely get smaller and/or faster with future optimizations, in general UddSketch will end up with a smaller memory footprint than TDigest, and a correspondingly smaller disk footprint for any continuous aggregates.  This is one of the main reasons that the default `percentile_agg` uses UddSketch, and is a pretty good reason to prefer that algorithm if your use case doesn't clearly benefit from TDigest.  Regardless of the algorithm, the best way to improve the accuracy of your percentile estimates is to increase the number of buckets, and UddSketch gives you more leeway to do so.
