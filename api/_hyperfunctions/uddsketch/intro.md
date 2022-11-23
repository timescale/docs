---
section: hyperfunction
subsection: uddsketch()
---

Calculate the value at a given percentile, or the percentile rank of a given
value.

`uddsketch` is one of two advanced percentile approximation aggregates provided
in TimescaleDB Toolkit. It produces stable estimates within a guaranteed
relative error.

The other advanced percentile approximation aggregate is [`tdigest`][tdigest],
which is more accurate at extreme quantiles, but is somewhat dependent on input
order. If you aren't sure which to use, try the default percentile estimation
method, [`percentile_agg`][percentile_agg]. It uses the `uddsketch` algorithm
with some sensible defaults.

For more information about percentile approximation algorithms, see the
[algorithms overview][algorithms].

[algorithms]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/percentile-approx/advanced-agg/
[percentile_agg]: /api/:currentVersion:/hyperfunctions/percentile-approximation/percentile_agg/
[tdigest]: /api/:currentVersion:/hyperfunctions/percentile-approximation/tdigest/
