
import Deprecated2210 from "versionContent/_partials/_deprecated_2_21_0.mdx";

## Policies

### `timescaledb.max_background_workers (int)`

Max background worker processes allocated to $TIMESCALE_DB. Set to at least 1 +
the number of databases loaded with the $TIMESCALE_DB extension in a PostgreSQL
instance. Default value is 16.

## Hypercore features

### `timescaledb.default_hypercore_use_access_method (bool)`

The default value for `hypercore_use_access_method` for functions that have this parameter. This function is in `user` context, meaning that any user can set it for the session. The default value is `false`.

<Deprecated2210 /> This feature is sunsetted in TimescaleDB v2.22.0.

## $SERVICE_LONG tuning

### `timescaledb.disable_load (bool)`

Disable the loading of the actual extension

### `timescaledb.enable_cagg_reorder_groupby (bool)`
Enable group by reordering

### `timescaledb.enable_chunk_append (bool)`
Enable chunk append node

### `timescaledb.enable_constraint_aware_append (bool)`
Enable constraint-aware append scans

### `timescaledb.enable_constraint_exclusion (bool)`
Enable constraint exclusion

### `timescaledb.enable_job_execution_logging (bool)`
Enable job execution logging

### `timescaledb.enable_optimizations (bool)`
Enable $TIMESCALE_DB  query optimizations

### `timescaledb.enable_ordered_append (bool)`
Enable ordered append scans

### `timescaledb.enable_parallel_chunk_append (bool)`
Enable parallel chunk append node

### `timescaledb.enable_runtime_exclusion (bool)`
Enable runtime chunk exclusion

### `timescaledb.enable_tiered_reads (bool)`

Enable [tiered reads][enabling-data-tiering] to query your data normally when it's distributed across different storage tiers.
Your hypertable is spread across the tiers, so queries and `JOIN`s work and fetch the same data as usual.

By default, tiered data is not accessed by queries. Querying tiered data may slow down query performance
as the data is not stored locally on Timescale's high-performance storage tier.


### `timescaledb.enable_transparent_decompression (bool)`
Enable transparent decompression


### `timescaledb.restoring (bool)`
Stop any background workers which could have been performing tasks. This is especially useful if you 
migrate data to your [$SERVICE_LONG][pg-dump-and-restore] or [$SELF_LONG][migrate-entire].

### `timescaledb.max_cached_chunks_per_hypertable (int)`
Maximum cached chunks

### `timescaledb.max_open_chunks_per_insert (int)`
Maximum open chunks per insert

### `timescaledb.max_tuples_decompressed_per_dml_transaction (int)`

The max number of tuples that can be decompressed during an INSERT, UPDATE, or DELETE.

[enabling-data-tiering]: /use-timescale/:currentVersion:/data-tiering/enabling-data-tiering/
[pg-dump-and-restore]: /migrate/:currentVersion:/pg-dump-and-restore/
[migrate-entire]: /self-hosted/:currentVersion:/migration/entire-database/
