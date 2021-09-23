# hyperloglog()  <tag type="toolkit">Toolkit</tag><tag type="experimental">Experimental</tag>
TimescaleDB Toolkit provides an implementation of the hyperloglog estimator for
`COUNT DISTINCT` approximations of any type that has a hash function.
Timescale's hyperLogLog is implemented as an aggregate function in PostgreSQL.
It does not support moving-aggregate mode, and are not ordered-set aggregates.
It is restricted to values that have an extended hash function. They are
parallelizable and are good candidates for continuous aggregation.

For more information about hyperloglog(), see the
[Toolkit documentation][toolkit-hyperloglog].


[toolkit-hyperloglog]: timescaledb/:currentVersion:/how-to-guides/toolkit/hyperloglog/
