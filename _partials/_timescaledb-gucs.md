| Name | Type | Default | Short Description | Long Description |
| --- | --- | --- | --- | --- |
| `auto_sparse_indexes` | `BOOLEAN` | `true` | Create sparse indexes on compressed chunks | The hypertable columns that are used as index keys will have suitable sparse indexes when compressed. Must be set at the moment of chunk compression |
| `bgw_log_level` | `ENUM` | `/* options= */ loglevel_options` | Log level for the background worker subsystem | Log level for the scheduler and workers of the background worker subsystem. Requires configuration reload to change. |
| `compress_truncate_behaviour` | `ENUM` | `compress_truncate_behaviour_options` | Define behaviour of truncate after compression | Defines how truncate behaves at the end of compression. 'truncate_only' forces truncation. 'truncate_disabled' deletes rows instead of truncate. 'truncate_or_delete' allows falling back to deletion. |
| `compression_batch_size_limit` | `INTEGER` | `1` | The max number of tuples that can be batched together during compression | Setting this option to a number between 1 and 999 will force compression to limit the size of compressed batches to that amount of uncompressed tuples.Setting this to 0 defaults to the max batch size of 1000. |
| `default_hypercore_use_access_method` | `BOOLEAN` | `PGC_USERSET` | gettext_noop(Enable to always use Hypercore TAM when compressing.) | gettext_noop(Sets the global default for using Hypercore TAM when compressing chunks.) |
| `enable_bool_compression` | `BOOLEAN` | `PGC_USERSET` | Enable bool compression functionality | Enable bool compression |
| `enable_bulk_decompression` | `BOOLEAN` | `true` | Enable decompression of the entire compressed batches | Increases throughput of decompression |
| `enable_cagg_reorder_groupby` | `BOOLEAN` | `PGC_USERSET` | Enable group by reordering | Enable group by clause reordering for continuous aggregates |
| `enable_cagg_sort_pushdown` | `BOOLEAN` | `PGC_USERSET` | Enable sort pushdown for continuous aggregates | Enable pushdown of ORDER BY clause for continuous aggregates |
| `enable_cagg_watermark_constify` | `BOOLEAN` | `PGC_USERSET` | Enable cagg watermark constify | Enable constifying cagg watermark for real-time caggs |
| `enable_cagg_window_functions` | `BOOLEAN` | `PGC_USERSET` | Enable window functions in continuous aggregates | Allow window functions in continuous aggregate views |
| `enable_chunk_append` | `BOOLEAN` | `PGC_USERSET` | Enable chunk append node | Enable using chunk append node |
| `enable_chunk_skipping` | `BOOLEAN` | `PGC_USERSET` | Enable chunk skipping functionality | Enable using chunk column stats to filter chunks based on column filters |
| `enable_chunkwise_aggregation` | `BOOLEAN` | `PGC_USERSET` | Enable chunk-wise aggregation | Enable the pushdown of aggregations to the chunk level |
| `enable_columnarscan` | `BOOLEAN` | `PGC_USERSET` | Enable columnar-optimized scans for supported access methods | A columnar scan replaces sequence scans for columnar-oriented storage and enables storage-specific optimizations like vectorized filters. Disabling columnar scan will make PostgreSQL fall back to regular sequence scans. |
| `enable_compressed_direct_batch_delete` | `BOOLEAN` | `PGC_USERSET` | Enable direct deletion of compressed batches | Enable direct batch deletion in compressed chunks |
| `enable_compressed_skipscan` | `BOOLEAN` | `PGC_USERSET` | Enable SkipScan for compressed chunks | Enable SkipScan for distinct inputs over compressed chunks |
| `enable_compression_indexscan` | `BOOLEAN` | `false` | Enable compression to take indexscan path | Enable indexscan during compression |
| `enable_compression_ratio_warnings` | `BOOLEAN` | `PGC_USERSET` | Enable warnings for poor compression ratio | Enable warnings for poor compression ratio |
| `enable_compression_wal_markers` | `BOOLEAN` | `PGC_SIGHUP` | Enable WAL markers for compression ops | Enable the generation of markers in the WAL stream which mark the start and end of compression operations |
| `enable_compressor_batch_limit` | `BOOLEAN` | `PGC_USERSET` | Enable compressor batch limit | Enable compressor batch limit for compressors which can go over the allocation limit (1 GB). This feature will limit those compressors by reducing the size of the batch and thus avoid hitting the limit. |
| `enable_constraint_aware_append` | `BOOLEAN` | `PGC_USERSET` | Enable constraint-aware append scans | Enable constraint exclusion at execution time |
| `enable_constraint_exclusion` | `BOOLEAN` | `PGC_USERSET` | Enable constraint exclusion | Enable planner constraint exclusion |
| `enable_custom_hashagg` | `BOOLEAN` | `PGC_USERSET` | Enable custom hash aggregation | Enable creating custom hash aggregation plans |
| `enable_decompression_sorted_merge` | `BOOLEAN` | `PGC_USERSET` | Enable compressed batches heap merge | Enable the merge of compressed batches to preserve the compression order by |
| `enable_delete_after_compression` | `BOOLEAN` | `PGC_USERSET` | Delete all rows after compression instead of truncate | Delete all rows after compression instead of truncate |
| `enable_deprecation_warnings` | `BOOLEAN` | `PGC_USERSET` | Enable warnings when using deprecated functionality | "Enable warnings when using deprecated functionality" |
| `enable_dml_decompression` | `BOOLEAN` | `PGC_USERSET` | Enable DML decompression | Enable DML decompression when modifying compressed hypertable |
| `enable_dml_decompression_tuple_filtering` | `BOOLEAN` | `PGC_USERSET` | Enable DML decompression tuple filtering | Recheck tuples during DML decompression to only decompress batches with matching tuples |
| `enable_event_triggers` | `BOOLEAN` | `PGC_SUSET` | Enable event triggers for chunks creation | Enable event triggers for chunks creation |
| `enable_exclusive_locking_recompression` | `BOOLEAN` | `PGC_USERSET` | Enable exclusive locking recompression | Enable getting exclusive lock on chunk during segmentwise recompression |
| `enable_foreign_key_propagation` | `BOOLEAN` | `PGC_USERSET` | Enable foreign key propagation | Adjust foreign key lookup queries to target whole hypertable |
| `enable_job_execution_logging` | `BOOLEAN` | `PGC_SIGHUP` | Enable job execution logging | Retain job run status in logging table |
| `enable_merge_on_cagg_refresh` | `BOOLEAN` | `PGC_USERSET` | Enable MERGE statement on cagg refresh | Enable MERGE statement on cagg refresh |
| `enable_now_constify` | `BOOLEAN` | `PGC_USERSET` | Enable now() constify | Enable constifying now() in query constraints |
| `enable_null_compression` | `BOOLEAN` | `PGC_USERSET` | Debug only flag to enable NULL compression | Enable null compression |
| `enable_optimizations` | `BOOLEAN` | `PGC_USERSET` | Enable TimescaleDB query optimizations | "Enable TimescaleDB query optimizations" |
| `enable_ordered_append` | `BOOLEAN` | `PGC_USERSET` | Enable ordered append scans | Enable ordered append optimization for queries that are ordered by the time dimension |
| `enable_parallel_chunk_append` | `BOOLEAN` | `PGC_USERSET` | Enable parallel chunk append node | Enable using parallel aware chunk append node |
| `enable_qual_propagation` | `BOOLEAN` | `PGC_USERSET` | Enable qualifier propagation | Enable propagation of qualifiers in JOINs |
| `enable_runtime_exclusion` | `BOOLEAN` | `PGC_USERSET` | Enable runtime chunk exclusion | Enable runtime chunk exclusion in ChunkAppend node |
| `enable_segmentwise_recompression` | `BOOLEAN` | `PGC_USERSET` | Enable segmentwise recompression functionality | Enable segmentwise recompression |
| `enable_skipscan` | `BOOLEAN` | `PGC_USERSET` | Enable SkipScan | Enable SkipScan for DISTINCT queries |
| `enable_skipscan_for_distinct_aggregates` | `BOOLEAN` | `PGC_USERSET` | Enable SkipScan for DISTINCT aggregates | Enable SkipScan for DISTINCT aggregates |
| `enable_sparse_index_bloom` | `BOOLEAN` | `true` | Enable creation of the bloom1 sparse index on compressed chunks | This sparse index speeds up the equality queries on compressed columns |
| `enable_tiered_reads` | `BOOLEAN` | `PGC_USERSET` | Enable tiered data reads | Enable reading of tiered data by including a foreign table representing the data in the object storage into the query plan |
| `enable_transparent_decompression` | `ENUM` | `transparent_decompression_options` | Enable transparent decompression | Enable transparent decompression when querying hypertable |
| `enable_tss_callbacks` | `BOOLEAN` | `PGC_SUSET` | Enable ts_stat_statements callbacks | Enable ts_stat_statements callbacks |
| `enable_vectorized_aggregation` | `BOOLEAN` | `PGC_USERSET` | Enable vectorized aggregation | Enable vectorized aggregation for compressed data |
| `hypercore_copy_to_behavior` | `ENUM` | `/* options= */ hypercore_copy_to_options` | The behavior of COPY TO on a hypercore table | Set to 'all_data' to return both compressed and uncompressed data via the Hypercore table when using COPY TO. Set to 'no_compressed_data' to skip compressed data. |
| `hypercore_indexam_whitelist` | `STRING` | `hash"` | gettext_noop( Whitelist for index access methods supported by hypercore.) | gettext_noop( List of index access method names supported by hypercore.) |
| `materializations_per_refresh_window` | `INTEGER` | `10` | Max number of materializations per cagg refresh window | The maximal number of individual refreshes per cagg refresh. If more refreshes need to be performed |
| `max_cached_chunks_per_hypertable` | `INTEGER` | `0` | Maximum cached chunks | Maximum number of chunks stored in the cache |
| `max_open_chunks_per_insert` | `INTEGER` | `0` | Maximum open chunks per insert | Maximum number of open chunk tables per insert |
| `max_tuples_decompressed_per_dml_transaction` | `INTEGER` | `an error will ""be thrown and transaction rolled back. ""Setting this to 0 sets this value to unlimited number of ""tuples decompressed."` | The max number of tuples that can be decompressed during an INSERT | UPDATE |
| `restoring` | `BOOLEAN` | `PGC_SUSET` | Enable restoring mode for timescaledb | In restoring mode all timescaledb internal hooks are disabled. This mode is required for restoring logical dumps of databases with timescaledb. |
| `telemetry_level` | `ENUM` | `telemetry_level_options` | Telemetry settings level | Level used to determine which telemetry to send |
