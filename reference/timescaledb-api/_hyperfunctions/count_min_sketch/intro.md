---
section: hyperfunction
subsection: count_min_sketch()
---

Count the number of times a value appears in a column, using the probabilistic
[`count-min sketch`][count-min-sketch] data structure and its associated
algorithms. For applications where a small error rate is tolerable, this can
result in huge savings in both CPU time and memory, especially for large
datasets.

[count-min-sketch]: http://dimacs.rutgers.edu/~graham/pubs/papers/cm-full.pdf
