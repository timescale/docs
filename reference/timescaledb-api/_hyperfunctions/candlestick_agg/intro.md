---
section: hyperfunction
subsection: candlestick_agg()
---

Perform analysis of financial asset data. These specialized hyperfunctions make
it easier to write financial analysis queries that involve candlestick data.

They help you answer questions such as:

*   What are the opening and closing prices of these stocks?
*   When did the highest price occur for this stock?

This function group uses the [two-step aggregation][two-step-aggregation]
pattern. In addition to the usual aggregate function,
[`candlestick_agg`][candlestick_agg], it also includes the pseudo-aggregate
function `candlestick`. `candlestick_agg` produces a candlestick aggregate from
raw tick data, which can then be used with the accessor and rollup functions in
this group. `candlestick` takes pre-aggregated data and transforms it into the
same format that `candlestick_agg` produces. This allows you to use the
accessors and rollups with existing candlestick data.

[candlestick_agg]: #candlestick_agg
[two-step-aggregation]: #two-step-aggregation
