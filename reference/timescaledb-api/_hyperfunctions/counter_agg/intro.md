---
section: hyperfunction
subsection: counter_agg()
---

Analyze data whose values are designed to monotonically increase, and where any
decreases are treated as resets. The `counter_agg` functions simplify this task,
which can be difficult to do in pure SQL.

If it's possible for your readings to decrease as well as increase, use [`gauge_agg`][gauge_agg]
instead.

[gauge_agg]: /api/:currentVersion:/hyperfunctions/counters-and-gauges/gauge_agg/
