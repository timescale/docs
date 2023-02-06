---
section: hyperfunction
subsection: counter_agg()
---

Analyze data whose values are designed to monotonically increase, and where any
decreases are treated as resets. The `counter_agg` functions simplify this task,
which can be difficult to do in pure SQL.

If it's valid for your reading to decrease, use [`gauge_agg`][gauge_agg]
instead.

[gauge_agg]: /api/:currentVersion:/hyperfunctions/counters-and-gauges/gauge_agg/
