# Time-weighted average functions
Time weighted averages are commonly used in cases where a time series is not 
evenly sampled, so a traditional average will give misleading results. Consider 
a voltage sensor that sends readings once every 5 minutes or whenever the value 
changes by more than 1 V from the previous reading. If the results are generally 
stable, but with some quick moving transients, a simple average over all of the 
points will tend to over-weight the transients instead of the stable readings. 
A time weighted average weights each value by the duration over which it occurred 
based on the points around it and produces correct results for unevenly spaced series.

TimescaleDB Toolkit's time weighted average is implemented as an aggregate which 
weights each value either using a last observation carried forward (LOCF) 
approach or a linear interpolation approach.

As with other Toolkit functions that support two-step aggregations, the 
[`time_weight`](/hyperfunctions/time-weighted-averages/time_weight/) function produces a summary output (`TimeWeightSummary`) which 
is intended to be consumed by either the [`average`](/hyperfunctions/time-weighted-averages/average/) or [`rollup`](/hyperfunctions/time-weighted-averages/rollup-timeweight/) function
Additionally, the output of [`time_weight`](/hyperfunctions/time-weighted-averages/time_weight/)can be stored in a Continuous 
Aggregate and re-aggregated or analyzed later. 
