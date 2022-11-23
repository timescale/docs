---
section: hyperfunction
subsection: percentile_agg()
---

Calculate the value at a given percentile, or the percentile rank of a given
value.

`percentile_agg` is the default percentile aggregation function. It uses the
[`uddsketch` algorithm][algorithms] with some sensible defaults. If you want
greater control over the percentile approximation algorithm, see the
[tdigest][tdigest] or [uddsketch][uddsketch] functions.

[algorithms]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/percentile-approx/advanced-agg/
[tdigest]: /api/:currentVersion:/hyperfunctions/percentile-approximation/tdigest/
[uddsketch]: /api/:currentVersion:/hyperfunctions/percentile-approximation/uddsketch/
