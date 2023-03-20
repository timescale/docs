---
section: hyperfunction
subsection: uddsketch()
---

Estimate the value at a given percentile, or the percentile rank of a given
value, using the UddSketch algorithm. This estimation is more memory- and
CPU-efficient than an exact calculation using PostgreSQL's `percentile_cont` and
`percentile_disc` functions.

`uddsketch` is one of two advanced percentile approximation aggregates provided
in TimescaleDB Toolkit. It produces stable estimates within a guaranteed
relative error.

The other advanced percentile approximation aggregate is [`tdigest`][tdigest],
which is more accurate at extreme quantiles, but is somewhat dependent on input
order.

If you aren't sure which aggregate to use, try the default percentile estimation
method, [`percentile_agg`][percentile_agg]. It uses the `uddsketch` algorithm
with some sensible defaults.

For more information about percentile approximation algorithms, see the
[algorithms overview][algorithms].

[algorithms]: /use-timescale/:currentVersion:/hyperfunctions/percentile-approx/advanced-agg/
[percentile_agg]: #percentile_agg
[tdigest]: /api/:currentVersion:/hyperfunctions/percentile-approximation/tdigest/
