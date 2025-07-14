import ConfigCloudSelf from "versionContent/_partials/_cloud_self_configuration.mdx";

Just as you can tune settings in $PG, $TIMESCALE_DB provides a number of configuration
settings that may be useful to your specific installation and performance needs. These can
also be set within the `postgresql.conf` file or as command-line parameters
when starting $PG.

## Query Planning and Execution

### `timescaledb.enable_chunkwise_aggregation (bool)`
If enabled, aggregations are converted into partial aggregations during query
planning. The first part of the aggregation is executed on a per-chunk basis.
Then, these partial results are combined and finalized. Splitting aggregations
decreases the size of the created hash tables and increases data locality, which
speeds up queries.

### `timescaledb.vectorized_aggregation (bool)`
Enables or disables the vectorized optimizations in the query executor. For
example, the `sum()` aggregation function on compressed chunks can be optimized
in this way.

### `timescaledb.enable_merge_on_cagg_refresh  (bool)`

Set to `ON` to dramatically decrease the amount of data written on a continuous aggregate
in the presence of a small number of changes, reduce the i/o cost of refreshing a
[continuous aggregate][continuous-aggregates], and generate fewer Write-Ahead Logs (WAL). Only works for continuous aggregates that don't have compression enabled.

<ConfigCloudSelf />

## Administration

### `timescaledb.restoring (bool)`

Set TimescaleDB in restoring mode. It is disabled by default.

### `timescaledb.license (string)`

Change access to features based on the TimescaleDB license in use. For example,
setting `timescaledb.license` to `apache` limits TimescaleDB to features that
are implemented under the Apache 2 license. The default value is `timescale`,
which allows access to all features.

### `timescaledb.telemetry_level (enum)`

Telemetry settings level. Level used to determine which telemetry to
send. Can be set to `off` or `basic`. Defaults to `basic`.

### `timescaledb.last_tuned (string)`

Records last time `timescaledb-tune` ran.

### `timescaledb.last_tuned_version (string)`

Version of `timescaledb-tune` used to tune when it runs.

[continuous-aggregates]: /use-timescale/:currentVersion:/continuous-aggregates/
