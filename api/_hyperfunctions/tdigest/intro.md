---
section: hyperfunction
subsection: tdigest()
---

Calculate the value at a given percentile, or the percentile rank of a given
value.

`tdigest` is one of two advanced percentile approximation aggregates provided in
TimescaleDB Toolkit. It is a space-efficient aggregation, and it provides more
accurate estimates at extreme quantiles than traditional methods.

`tdigest` is somewhat dependent on input order. If `tdigest` is run on the same
data arranged in different order, the results should be nearly equal, but they
are unlikely to be exact.

The other advanced percentile approximation aggregate is
[`uddsketch`][uddsketch], which produces stable estimates within a guaranteed
relative error. If you aren't sure which to use, try the default percentile
estimation method, [`percentile_agg`][percentile_agg]. It uses the `uddsketch`
algorithm with some sensible defaults.

For more information about percentile approximation algorithms, see the
[algorithms overview][algorithms].

[algorithms]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/percentile-approx/advanced-agg/
[percentile_agg]: /api/:currentVersion:/hyperfunctions/percentile-approximation/percentile_agg/
[uddsketch]: /api/:currentVersion:/hyperfunctions/percentile-approximation/uddsketch/
