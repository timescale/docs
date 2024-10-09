---
section: hyperfunction
subsection: max_n()
---

Get the N largest values from a column.

The `max_n()` functions give the same results as the regular SQL query `SELECT
... ORDER BY ... LIMIT n`. But unlike the SQL query, they can be composed and
combined like other aggregate hyperfunctions.

To get the N smallest values, use [`min_n()`][min_n]. To get the N largest
values with accompanying data, use [`max_n_by()`][max_n_by].

[max_n_by]: /api/:currentVersion:/hyperfunctions/minimum-and-maximum/max_n_by/
[min_n]: /api/:currentVersion:/hyperfunctions/minimum-and-maximum/min_n/
