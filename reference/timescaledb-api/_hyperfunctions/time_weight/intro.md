---
section: hyperfunction
subsection: time_weight()
---

Calculate time-weighted summary statistics, such as averages (means) and
integrals. Time weighting is used when data is unevenly sampled over time. In
that case, a straight average gives misleading results, as it biases towards
more frequently sampled values.

For example, a sensor might silently spend long periods of time in a steady
state, and send data only when a significant change occurs. The regular mean
counts the steady-state reading as only a single point, whereas a time-weighted
mean accounts for the long period of time spent in the steady state. In essence,
the time-weighted mean takes an integral over time, then divides by the elapsed
time.
