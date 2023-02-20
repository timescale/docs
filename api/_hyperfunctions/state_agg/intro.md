---
section: hyperfunction
subsection: state_agg()
---

Given a system or value that switches between discrete states, track transitions
between the states. For example, you can use `state_agg` to create a state
of state transitions, or to calculate the durations of states. `state_agg`
extends the capabilities of [`compact_state_agg`][compact_state_agg].

`state_agg` is designed to work with a relatively small number of states. It
might not perform well on datasets where states are mostly distinct between
rows.

Because `state_agg` tracks more information, it uses more memory than
`compact_state_agg`. If you want to minimize memory use and don't need to query the
timestamps of state transitions, consider using [`compact_state_agg`][compact_state_agg]
instead.

[compact_state_agg]: /api/:currentVersion:/hyperfunctions/state-tracking/compact_state_agg/
