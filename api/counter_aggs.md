# Counter and gauge aggregation
This section contains functions related to counter and gauge aggregation.
Counter aggregation functions are used to accumulate monotonically increasing data 
by treating any decrements as resets. Gauge aggregates are similar, but are used to
track data which can decrease as well as increase. For more information about counter
aggregation functions, see the
[hyperfunctions documentation][hyperfunctions-counter-agg].

Some hyperfunctions are included in the default TimescaleDB product. For
additional hyperfunctions, you need to install the
[Timescale Toolkit][install-toolkit] PostgreSQL extension.

|Hyperfunction family|Types|API Calls|Included by default|Toolkit required|
|-|-|-|-|-|
|Counter and gauge aggregation|Counter aggregate|[`counter_agg`](/hyperfunctions/counter_aggs/counter_agg_point/)|❌|✅|
||Gauge aggregate|[`gauge_agg`](/hyperfunctions/counter_aggs/gauge_agg/)|❌|✅|
||Rollup|[`rollup`](/hyperfunctions/counter_aggs/rollup-counter/)|❌|✅|
||Accessor|[`corr`](/hyperfunctions/counter_aggs/corr-stats/)|❌|✅|
|||[`counter_zero_time`](/hyperfunctions/counter_aggs/counter_zero_time/)|❌|✅|
|||[`delta`](/hyperfunctions/counter_aggs/delta/)|❌|✅|
|||[`extrapolated_delta`](/hyperfunctions/counter_aggs/extrapolated_delta/)|❌|✅|
|||[`extrapolated_rate`](/hyperfunctions/counter_aggs/extrapolated_rate/)|❌|✅|
|||[`idelta_left`/`idelta_right`](/hyperfunctions/counter_aggs/idelta/)|❌|✅|
|||[`intercept`](/hyperfunctions/counter_aggs/intercept-counter/)|❌|✅|
|||[`irate_left`/`irate_right`](/hyperfunctions/counter_aggs/irate/)|❌|✅|
|||[`num_changes`](/hyperfunctions/counter_aggs/num_changes/)|❌|✅|
|||[`num_elements`](/hyperfunctions/counter_aggs/num_elements/)|❌|✅|
|||[`num_resets`](/hyperfunctions/counter_aggs/num_resets/)|❌|✅|
|||[`rate`](/hyperfunctions/counter_aggs/rate/)|❌|✅|
|||[`slope`](/hyperfunctions/counter_aggs/slope-counter/)|❌|✅|
|||[`time_delta`](/hyperfunctions/counter_aggs/time_delta/)|❌|✅|
||Mutator|[`with_bounds`](/hyperfunctions/counter_aggs/with_bounds/)|❌|✅|

<highlight type="important">
All accessors can be used with `CounterSummary`. The accessors `delta`,
`idelta_left`, and `idelta_right` can be used with `GaugeSummary`.
`GaugeSummary` will eventually support all the accessors, with the exception
of `num_resets`.
</highlight>


[hyperfunctions-counter-agg]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/counter-aggregation/
[install-toolkit]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/install-toolkit
