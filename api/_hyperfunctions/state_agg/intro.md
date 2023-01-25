---
section: hyperfunction
subsection: state_agg()
---

Given a system or value that switches between discrete states, aggregate the
amount of time spent in each state. For example, you can use the `state_agg`
functions to track how much time a system spends in `error`, `running`, or
`starting` states.

`state_agg` is designed to work with a relatively small number of states. It
might not perform well on datasets where states are mostly distinct between
rows.

If you need to track when each state is entered and exited, use the
[`timeline_agg`][timeline_agg] functions. If you need to track the liveness of a
system based on a heartbeat signal, consider using the
[`heartbeat_agg`][heartbeat_agg] functions.

[heartbeat_agg]: /api/:currentVersion:/hyperfunctions/state-tracking/heartbeat_agg/
[timeline_agg]: /api/:currentVersion:/hyperfunctions/state-tracking/timeline_agg/
