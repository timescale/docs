---
section: hyperfunction
subsection: min_n_by()
---

Get the N smallest values from a column, with an associated piece of data per
value. For example, you can return an accompanying column, or the full row.

The `min_n_by()` functions give the same results as the regular SQL query
`SELECT ... ORDER BY ... LIMIT n`. But unlike the SQL query, they can be
composed and combined like other aggregate hyperfunctions.

To get the N largest values with accompanying data, use
[`max_n_by()`][max_n_by]. To get the N smallest values without accompanying
data, use [`min_n()`][min_n].

[max_n_by]: /api/:currentVersion:/hyperfunctions/minimum-and-maximum/max_n_by/
[min_n]: /api/:currentVersion:/hyperfunctions/minimum-and-maximum/min_n/
