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
|Percentile approximation|Approximate percentile|[`percentile_agg`](/hyperfunctions/percentile-approximation/percentile_agg/)|❌|✅|
|||[`approx_percentile`](/hyperfunctions/percentile-approximation/approx_percentile/)|❌|✅|
|||[`approx_percentile_rank`](/hyperfunctions/percentile-approximation/approx_percentile_rank/)|❌|✅|
|||[`rollup`](/hyperfunctions/percentile-approximation/rollup-percentile/)|❌|✅|
|||[`max_val`](/hyperfunctions/percentile-approximation/max_val/)|✅|❌|
|||[`mean`](/hyperfunctions/percentile-approximation/mean/)|✅|❌|
|||[`error`](/hyperfunctions/percentile-approximation/error/)|✅|❌|
|||[`min_val`](/hyperfunctions/percentile-approximation/min_val/)|✅|❌|
|||[`num_vals`](/hyperfunctions/percentile-approximation/num_vals/)|✅|❌|
||Advanced aggregation methods|[`uddsketch`](/hyperfunctions/percentile-approximation/percentile-aggregation-methods/uddsketch/)|❌|✅|
|||[`tdigest`](/hyperfunctions/percentile-approximation/percentile-aggregation-methods/tdigest/)|❌|✅|


[hyperfunctions-percentile-approx]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/percentile-approx/
[install-toolkit]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/install-toolkit
