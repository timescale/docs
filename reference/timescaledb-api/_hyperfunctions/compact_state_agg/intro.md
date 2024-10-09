---
section: hyperfunction
subsection: compact_state_agg()
---

Given a system or value that switches between discrete states, aggregate the
amount of time spent in each state. For example, you can use the `compact_state_agg`
functions to track how much time a system spends in `error`, `running`, or
`starting` states.

`compact_state_agg` is designed to work with a relatively small number of states. It
might not perform well on datasets where states are mostly distinct between
rows.

If you need to track when each state is entered and exited, use the
[`state_agg`][state_agg] functions. If you need to track the liveness of a
system based on a heartbeat signal, consider using the
[`heartbeat_agg`][heartbeat_agg] functions.

[heartbeat_agg]: /api/:currentVersion:/hyperfunctions/state-tracking/heartbeat_agg/
[state_agg]: /api/:currentVersion:/hyperfunctions/state-tracking/state_agg/
