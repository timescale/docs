---
section: hyperfunction
subsection: timeline_agg()
---

Given a system or value that switches between discrete states, track transitions
between the states. For example, you can use `timeline_agg` to create a timeline
of state transitions, or to calculate the durations of states. `timeline_agg`
extends the capabilities of [`state_agg`][state_agg].

`timeline_agg` is designed to work with a relatively small number of states. It
might not perform well on datasets where states are mostly distinct between
rows.

Because `timeline_agg` tracks more information, it uses more memory than
`state_agg`. If you want to minimize memory use and don't need to query the
timestamps of state transitions, consider using [`state_agg`][state_agg]
instead.

[state_agg]: /api/:currentVersion:/hyperfunctions/state-tracking/state_agg/
