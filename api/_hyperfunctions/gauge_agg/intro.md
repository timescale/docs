---
section: hyperfunction
subsection: gauge_agg()
---

Analyze data coming from gauges. Unlike counters, gauges can decrease as well as
increase.

If your value can only increase, use [`counter_agg`][hyperfunctions-api-counter-agg] instead to
appropriately account for resets.

[hyperfunctions-api-counter-agg]: /api/:currentVersion:/hyperfunctions/counters-and-gauges/counter_agg/
