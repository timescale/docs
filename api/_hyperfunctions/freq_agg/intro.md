---
section: hyperfunction
subsection: freq_agg()
---

Get the most common elements of a set and their relative frequency. The
estimation uses the [SpaceSaving][spacingsaving-algorithm] algorithm.

This group of functions contains two aggregate functions, which let you set the
cutoff for keeping track of a value in different ways. [`freq_agg`](#freq_agg)
allows you to specify a minimum frequency, and [`mcv_agg`](#mcv_agg) allows
you to specify the target number of values to keep.

To estimate the absolute number of times a value appears, use [`count_min_sketch`][count_min_sketch].

[count_min_sketch]: /api/:currentVersion:/hyperfunctions/frequency-analysis/count_min_sketch/
[spacingsaving-algorithm]: https://www.cse.ust.hk/~raywong/comp5331/References/EfficientComputationOfFrequentAndTop-kElementsInDataStreams.pdf
