---
title: Advanced percentile aggregation
excerpt: Choose an approximation algorithm for calculating percentiles
keywords: [percentiles, aggregate, hyperfunctions, Toolkit]
tags: [approximate]
---

# Advanced percentile aggregation <tag type="toolkit">Toolkit</tag>

Timescale uses approximation algorithms to calculate a percentile without
requiring all of the data. This also makes them more compatible with continuous
aggregates. By default, Timescale Toolkit uses `uddsketch`, but you can also
choose to use `tdigest`. For more information about the different algorithms, see the [hyperfunction documentation][hyperfunction-advanced-agg].

[hyperfunction-advanced-agg]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/percentile-approx/advanced-agg/
