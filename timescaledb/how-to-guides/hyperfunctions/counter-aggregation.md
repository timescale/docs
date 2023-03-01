---
title: Counter aggregation
excerpt: Work with counter and gauge data
products: [cloud, mst, self_hosted]
keywords: [hyperfunctions, Toolkit, gauges, counters]
---

# Counter aggregation

When you are monitoring application performance, there are two main types of
metrics that you can collect: gauges, and counters. Gauges fluctuate up and
down, like temperature or speed, while counters always increase, like the total
number of miles travelled in a vehicle.

Counter data usually resets to zero if there is an interruption. Counter
aggregation functions are used to continue accumulating data, while ignoring any
interruptions or resets.

For more information about counter aggregation API calls, see the
[hyperfunction API documentation][hyperfunctions-api-counter-agg].

[hyperfunctions-api-counter-agg]: /api/:currentVersion:/hyperfunctions/counter_aggs/
