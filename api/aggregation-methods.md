# Aggregation methods

All functions that provide value when looking at percentiles first needs a 
percentile aggregate dataset to work with. These three aggregation methods
provide that dataset.

Of the three, [`percentile_agg()`](/hyperfunctions/percentile-approximation/aggregation-methods/percentile_agg)
(which returns a UddSketch) is typically the best option for general, fast percentile 
approximation calculations. This is the aggregate function we use in most examples 
throughout the documentation. However, we provide both 
[`uddsketch()`](/hyperfunctions/percentile-approximation/aggregation-methods/uddsketch/) and 
[`tdigest()`](/hyperfunctions/percentile-approximation/aggregation-methods/tdigest/) if your use case
requires more specific tuning ability that `percentile_agg()` doesn't provide.