# Downsample
This section includes functions used to downsample data.  Downsampling
is used to replace a set of values with a much smaller set that is highly
representative of the original data.  This is particularly useful for
graphing applications.

Some hyperfunctions are included in the default TimescaleDB product. For
additional hyperfunctions, you need to install the
[Timescale Toolkit][install-toolkit] PostgreSQL extension.

|Hyperfunction family|Types|API Calls|Included by default|Toolkit required|
|-|-|-|-|-|
|Downsample|ASAP|[`asap_smooth`](hyperfunctions/downsample/asap/)|❌|✅|
|Downsample|LTTB|[`lttb`](hyperfunctions/downsample/lttb/)|❌|✅|

[install-toolkit]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/install-toolkit
