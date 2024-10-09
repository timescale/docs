---
title: Counter and gauge aggregation
excerpt: Perform statistical analysis of counters and gauges
keywords: [counters, gauges, hyperfunctions, Toolkit]
---

# Counter and gauge aggregation

This section contains functions related to counter and gauge aggregation.
Counter aggregation functions are used to accumulate monotonically increasing data
by treating any decrements as resets. Gauge aggregates are similar, but are used to
track data which can decrease as well as increase. For more information about counter
aggregation functions, see the
[hyperfunctions documentation][hyperfunctions-counter-agg].

Some hyperfunctions are included in the default TimescaleDB product. For
additional hyperfunctions, you need to install the
[Timescale Toolkit][install-toolkit] PostgreSQL extension.

<HyperfunctionTable
    hyperfunctionFamily='metric aggregation'
    includeExperimental
    sortByType
/>

<Highlight type="important">
All accessors can be used with `CounterSummary`, and all but `num_resets`
with `GaugeSummary`.
</Highlight>

[hyperfunctions-counter-agg]: /use-timescale/:currentVersion:/hyperfunctions/counter-aggregation/
[install-toolkit]: /self-hosted/:currentVersion:/tooling/install-toolkit/
