---
section: hyperfunction
subsection: ohlc()
---

Perform analysis of financial asset data. These specialized hyperfunctions make
it easier to write financial analysis queries that involve open, high, low,
and closing prices.

They help you answer questions such as:

*   What are the opening and closing prices of these stocks?
*   When did the highest price occur for this stock?

<highlight type="deprecation">
The
[`candlestick_agg`](/api/latest/hyperfunctions/financial-analysis/candlestick_agg/)
functions provide a better API for financial analysis that allows you to include
trading volume data. `ohlc` is deprecated in favor of these functions.
</highlight>
