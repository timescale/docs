---
section: hyperfunction
subsection: hyperloglog()
---

Estimate the number of distinct values in a dataset. This is also known as
cardinality estimation. For large datasets and datasets with high cardinality
(many distinct values), this can be much more efficient in both CPU and memory
than an exact count using `count(DISTINCT)`.

The estimation uses the [`hyperloglog++`][hyperloglog] algorithm. If you aren't
sure what parameters to set for the `hyperloglog`, try using the
[`approx_count_distinct`][approx_count_distinct] aggregate, which sets some
reasonable default values.

[approx_count_distinct]: #approx_count_distinct
[hyperloglog]: https://en.wikipedia.org/wiki/HyperLogLog
