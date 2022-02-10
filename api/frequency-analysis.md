# Frequency Analysis
This section includes functions used to measure how often particular values
occur.  These can be broken further into State Aggregate APIs, which are used
to measure the time spent in a relatively small number of states, and 
Frequency Aggregate APIs, which are used to find the most common elements out
of a set of vastly more varied values.

Some hyperfunctions are included in the default TimescaleDB product. For
additional hyperfunctions, you need to install the
[Timescale Toolkit][install-toolkit] PostgreSQL extension.

|Hyperfunction family|Types|API Calls|Included by default|Toolkit required|
|-|-|-|-|-|
|Frequency|FrequencyAggregate|[`freq_agg`](hyperfunctions/frequency-analysis/freq_agg/)|❌|✅|
|Frequency||[`values`](hyperfunctions/frequency-analysis/values-freq_agg/)|❌|✅|
|Frequency||[`topn`](hyperfunctions/frequency-analysis/topn/)|❌|✅|
|Frequency|StateAgg|[`state_agg`](hyperfunctions/frequency-analysis/state_agg/)|❌|✅|
|Frequency||[`duration_in`](hyperfunctions/frequency-analysis/duration_in/)|❌|✅|

[install-toolkit]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/install-toolkit
