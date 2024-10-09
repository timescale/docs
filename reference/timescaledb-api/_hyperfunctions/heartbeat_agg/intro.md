---
section: hyperfunction
subsection: heartbeat_agg()
---

Given a series of timestamped heartbeats and a liveness interval, determine the
overall liveness of a system. This aggregate can be used to report total uptime
or downtime as well as report the time ranges where the system was live or dead.

It's also possible to combine multiple heartbeat aggregates to determine the
overall health of a service. For example, the heartbeat aggregates from a
primary and standby server could be combine to see if there was ever a window
where both machines were down at the same time.
