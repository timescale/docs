# Time-weighted average functions <tag type="toolkit">Toolkit</tag>
This section contains functions related to time-weighted averages. Time weighted
averages are commonly used in cases where a time series is not evenly sampled,
so a traditional average will give misleading results. For more information
about time-weighted average functions, see the
[hyperfunctions documentation][hyperfunctions-time-weight-average].

Some hyperfunctions are included in the default TimescaleDB product. For
additional hyperfunctions, you need to install the
[Timescale Toolkit][install-toolkit] PostgreSQL extension.

|Hyperfunction family|Types|API Calls|Included by default|Toolkit required|
|-|-|-|-|-|
|Time-weighted averages|Time-weighted averages|[`time_weight`](/hyperfunctions/time-weighted-averages/time_weight/)|❌|✅|
|||[`rollup`](/hyperfunctions/time-weighted-averages/rollup-timeweight/)|❌|✅|
|||[`average`](/hyperfunctions/time-weighted-averages/average/)|❌|✅|

[hyperfunctions-time-weight-average]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/time-weighted-averages/
[install-toolkit]: timescaledb/how-to-guides/:currentVersion:/hyperfunctions/install-toolkit
