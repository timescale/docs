---
section: hyperfunction
subsection: min_n()
---

Get the N smallest values from a column.

The `min_n()` functions give the same results as the regular SQL query `SELECT
... ORDER BY ... LIMIT n`. But unlike the SQL query, they can be composed and
combined like other aggregate hyperfunctions.

To get the N largest values, use [`max_n()`][max_n]. To get the N smallest
values with accompanying data, use [`min_n_by()`][min_n_by].

[max_n]: /api/:currentVersion:/hyperfunctions/minimum-and-maximum/max_n/
[min_n_by]: /api/:currentVersion:/hyperfunctions/minimum-and-maximum/min_n_by/
