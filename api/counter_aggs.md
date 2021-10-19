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
|Counter aggregation|Counter aggregates|[`counter_agg`](/hyperfunctions/counter_aggs/counter_agg_point/)|❌|✅|
|||[`rollup`](/hyperfunctions/counter_aggs/rollup-counter/)|❌|✅|
|Counter aggregation|Counter Agg Accessors|[`corr`](/hyperfunctions/counter_aggs/corr/)|✅|❌|
|||[`counter_zero_time`](/hyperfunctions/counter_aggs/counter_zero_time/)|✅|❌|
|||[`delta`](/hyperfunctions/counter_aggs/delta/)|✅|❌|
|||[`extrapolated_delta`](/hyperfunctions/counter_aggs/extrapolated_delta/)|✅|❌|
|||[`extrapolated_rate`](/hyperfunctions/counter_aggs/extrapolated_rate/)|✅|❌|
|||[`idelta_left` / `idelta_right`](/hyperfunctions/counter_aggs/idelta/)|✅|❌|
|||[`intercept`](/hyperfunctions/counter_aggs/intercept/)|✅|❌|
|||[`irate_left` / `irate_right`](/hyperfunctions/counter_aggs/irate/)|✅|❌|
|||[`num_changes`](/hyperfunctions/counter_aggs/num_changes/)|✅|❌|
|||[`num_elements`](/hyperfunctions/counter_aggs/num_elements/)|✅|❌|
|||[`num_resets`](/hyperfunctions/counter_aggs/num_resets/)|✅|❌|
|||[`rate`](/hyperfunctions/counter_aggs/rate/)|✅|❌|
|||[`slope`](/hyperfunctions/counter_aggs/slope/)|✅|❌|
|||[`time_delta`](/hyperfunctions/counter_aggs/time_delta/)|✅|❌|
|Counter aggregation|Counter Agg Mutators|[`with_bounds`](/hyperfunctions/counter_aggs/with_bounds/)|❌|✅|


[hyperfunctions-counter-agg]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/counter-aggregation/
[install-toolkit]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/install-toolkit
