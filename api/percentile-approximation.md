# Percentile approximation  <tag type="toolkit">Toolkit</tag>
This section contains functions related to percentile approximation.
Approximation algorithms are used to calculate a percentile without requiring
all of the data. For more information about percentile approximation functions,
see the [hyperfunctions documentation][hyperfunctions-percentile-approx].

Some hyperfunctions are included in the default TimescaleDB product. For
additional hyperfunctions, you need to install the
[Timescale Toolkit][install-toolkit] PostgreSQL extension.

|Hyperfunction family|Types|API Calls|Included by default|Toolkit required|
|-|-|-|-|-|
|Percentile approximation|Approximate percentile|`percentile_agg`|❌|✅|
|||`approx_percentile`|❌|✅|
|||`approx_percentile_rank`|❌|✅|
|||`rollup`|❌|✅|
|||`max_val`|✅|❌|
|||`mean`|✅|❌|
|||`error`|✅|❌|
|||`min_val`|✅|❌|
|||`num_vals`|✅|❌|


[hyperfunctions-percentile-approx]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/percentile-approx/
