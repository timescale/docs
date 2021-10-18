# Approximate count distincts
This section includes functions related to approximating distinct counts.
Approximate count distincts are used to find the number of unique values, or
cardinality, in a large dataset. For more information about approximate count
distinct functions, see the
[hyperfunctions documentation][hyperfunctions-approx-count-distincts].

Some hyperfunctions are included in the default TimescaleDB product. For
additional hyperfunctions, you need to install the
[Timescale Toolkit][install-toolkit] PostgreSQL extension.

|Hyperfunction family|Types|API Calls|Included by default|Toolkit required|
|-|-|-|-|-|
|Approximate count distincts|Hyperloglog|[`hyperloglog`](hyperfunctions/approx_count_distincts/hyperloglog/)|❌|✅|
|||[`rollup`](hyperfunctions/approx_count_distincts/rollup-hyperloglog/)|❌|✅|
|||[`distinct_count`](hyperfunctions/approx_count_distincts/distinct_count/)|❌|✅|
|||[`stderror`](hyperfunctions/approx_count_distincts/stderror/)|❌|✅|

[hyperfunctions-approx-count-distincts]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/approx-count-distincts/
[install-toolkit]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/install-toolkit
