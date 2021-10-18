# Counter aggregation
This section contains functions related to counter aggregation. Counter
aggregation functions are used to continue accumulating data while ignoring any
interruptions or resets. For more information about counter aggregation
functions, see the [hyperfunctions documentation][hyperfunctions-counter-agg].

Some hyperfunctions are included in the default TimescaleDB product. For
additional hyperfunctions, you need to install the
[Timescale Toolkit][install-toolkit] PostgreSQL extension.

|Hyperfunction family|Types|API Calls|Included by default|Toolkit required|
|-|-|-|-|-|
|Counter aggregation|Counter aggregates|`counter_agg`|❌|✅|
|||`rollup`|❌|✅|
|||`corr`|✅|❌|
|||`counter_zero_time`|✅|❌|
|||`delta`|✅|❌|
|||`extrapolated_delta`|✅|❌|
|||`extrapolated_rate`|✅|❌|
|||`idelta`|✅|❌|
|||`intercept`|✅|❌|
|||`irate`|✅|❌|
|||`num_changes`|✅|❌|
|||`num_elements`|✅|❌|
|||`num_resets`|✅|❌|
|||`rate`|✅|❌|
|||`slope`|✅|❌|
|||`time_delta`|✅|❌|
|||`with_bounds`|❌|✅|


[hyperfunctions-counter-agg]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/counter-aggregation/
