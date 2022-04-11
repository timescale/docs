# Frequency analysis
This section includes functions used to measure how often particular values
occur. These are broken further into state aggregate APIs, which measure the
time spent in a relatively small number of states, and frequency aggregate APIs,
which find the most common elements out of a set of vastly more varied values.

Some hyperfunctions are included in the default TimescaleDB product. For
additional hyperfunctions, you need to install the
[Timescale Toolkit][install-toolkit] PostgreSQL extension.

|Hyperfunction family|Types|API Calls|Included by default|Toolkit required|
|-|-|-|-|-|
|Frequency|SpaceSavingAggregate|[`freq_agg`](/hyperfunctions/frequency-analysis/freq_agg/)|❌|✅|
|Frequency|SpaceSavingAggregate|[`topn_agg`](/hyperfunctions/frequency-analysis/topn_agg/)|❌|✅|
|Frequency|SpaceSavingAggregate|[`into_values`](/hyperfunctions/frequency-analysis/into_values-freq_agg/)|❌|✅|
|Frequency|SpaceSavingAggregate|[`topn`](/hyperfunctions/frequency-analysis/topn/)|❌|✅|
|Frequency|SpaceSavingAggregate|[`min_frequency`](/hyperfunctions/frequency-analysis/min_frequency-max_frequency/)|❌|✅|
|Frequency|SpaceSavingAggregate|[`max_frequency`](/hyperfunctions/frequency-analysis/min_frequency-max_frequency/)|❌|✅|
|Frequency|StateAgg|[`state_agg`](/hyperfunctions/frequency-analysis/state_agg/)|❌|✅|
|Frequency|StateAgg|[`duration_in`](/hyperfunctions/frequency-analysis/duration_in/)|❌|✅|
|Frequency|StateAgg|[`into_values`](/hyperfunctions/frequency-analysis/into_vals-state-agg/)|❌|✅|

[install-toolkit]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/install-toolkit
