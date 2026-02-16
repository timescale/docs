| Name | Type | Default | Description |
| -- | -- | -- | -- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `auto_sparse_indexes` | `BOOLEAN` | `true` | The hypertable columns that are used as index keys will have suitable sparse indexes when compressed. Must be set at the moment of chunk compression, e.g. when the `compress_chunk()` is called. |
| `bgw_log_level` | `ENUM` | `WARNING` | Log level for the scheduler and workers of the background worker subsystem. Requires configuration reload to change. |
| `compress_truncate_behaviour` | `ENUM` | `COMPRESS_TRUNCATE_ONLY` | Defines how truncate behaves at the end of compression. 'truncate_only' forces truncation. 'truncate_disabled' deletes rows instead of truncate. 'truncate_or_delete' allows falling back to deletion. |
| `compression_batch_size_limit` | `INTEGER` | `1000` | Setting this option to a number between 1 and 999 will force compression to limit the size of compressed batches to that amount of uncompressed tuples.Setting this to 0 defaults to the max batch size of 1000.<br />min: `1`, max: `1000` |
| `compression_orderby_default_function` | `STRING` | `"_timescaledb_functions.get_orderby_defaults"` | Function to use for calculating default order_by setting for compression |
| `compression_segmentby_default_function` | `STRING` | `"_timescaledb_functions.get_segmentby_defaults"` | Function to use for calculating default segment_by setting for compression |
| `current_timestamp_mock` | `STRING` | `NULL` |  this is for debugging purposes |
| `debug_bgw_scheduler_exit_status` | `INTEGER` | `0` |  this is for debugging purposes<br />min: `0`, max: `255` |
| `debug_compression_path_info` | `BOOLEAN` | `false` |  this is for debugging/information purposes |
| `debug_have_int128` | `BOOLEAN` | `#ifdef HAVE_INT128 true` |  this is for debugging purposes |
| `debug_require_batch_sorted_merge` | `ENUM` | `DRO_Allow` |  this is for debugging purposes |
| `debug_require_vector_agg` | `ENUM` | `DRO_Allow` |  this is for debugging purposes |
| `debug_require_vector_qual` | `ENUM` | `DRO_Allow` | this is for debugging purposes, to let us check if the vectorized quals are used or not. EXPLAIN differs after PG15 for custom nodes, and using the test templates is a pain |
| `debug_skip_scan_info` | `BOOLEAN` | `false` | Print debug info about SkipScan distinct columns |
| `debug_toast_tuple_target` | `INTEGER` | `/* bootValue = */ 128` |  this is for debugging purposes<br />min: `/* minValue = */ 1`, max: `/* maxValue = */ 65535` |
| `direct_compress_copy_tuple_sort_limit` | `INTEGER` | `100000` | This is mainly used to keep the memory footprint down for operations like importing large amounts of data in single transaction. Setting this to 0 would make it unlimited.<br />min: `0`, max: `2147483647` |
| `direct_compress_insert_tuple_sort_limit` | `INTEGER` | `10000` | This is mainly used to keep the memory footprint down for operations like importing large amounts of data in single transaction. Setting this to 0 would make it unlimited.<br />min: `0`, max: `2147483647` |
| `enable_bool_compression` | `BOOLEAN` | `true` | Enable bool compression |
| `enable_bulk_decompression` | `BOOLEAN` | `true` | Increases throughput of decompression, but might increase query memory usage |
| `enable_cagg_reorder_groupby` | `BOOLEAN` | `true` | Enable group by clause reordering for continuous aggregates |
| `enable_cagg_sort_pushdown` | `BOOLEAN` | `true` | Enable pushdown of ORDER BY clause for continuous aggregates |
| `enable_cagg_watermark_constify` | `BOOLEAN` | `true` | Enable constifying cagg watermark for real-time caggs |
| `enable_cagg_window_functions` | `BOOLEAN` | `false` | Allow window functions in continuous aggregate views |
| `enable_chunk_append` | `BOOLEAN` | `true` | Enable using chunk append node |
| `enable_chunk_auto_publication` | `BOOLEAN` | `false` | Enable automatically adding newly created chunks to the publication of their hypertable |
| `enable_chunk_skipping` | `BOOLEAN` | `false` | Enable using chunk column stats to filter chunks based on column filters |
| `enable_chunkwise_aggregation` | `BOOLEAN` | `true` | Enable the pushdown of aggregations to the chunk level |
| `enable_columnarindexscan` | `BOOLEAN` | `false` | Enable experimental support for returning results directly from compression metadata without decompression |
| `enable_columnarscan` | `BOOLEAN` | `true` | Transparently decompress columnar data using ColumnarScan custom node. Disabling columnar scan will ignore data stored in columnar format in queries. |
| `enable_compressed_direct_batch_delete` | `BOOLEAN` | `true` | Enable direct batch deletion in compressed chunks |
| `enable_compressed_skipscan` | `BOOLEAN` | `true` | Enable SkipScan for distinct inputs over compressed chunks |
| `enable_compression_indexscan` | `BOOLEAN` | `false` | Enable indexscan during compression, if matching index is found |
| `enable_compression_ratio_warnings` | `BOOLEAN` | `true` | Enable warnings for poor compression ratio |
| `enable_compression_wal_markers` | `BOOLEAN` | `true` | Enable the generation of markers in the WAL stream which mark the start and end of compression operations |
| `enable_compressor_batch_limit` | `BOOLEAN` | `false` | Enable compressor batch limit for compressors which can go over the allocation limit (1 GB). This feature will limit those compressors by reducing the size of the batch and thus avoid hitting the limit. |
| `enable_constraint_aware_append` | `BOOLEAN` | `true` | Enable constraint exclusion at execution time |
| `enable_constraint_exclusion` | `BOOLEAN` | `true` | Enable planner constraint exclusion |
| `enable_decompression_sorted_merge` | `BOOLEAN` | `true` | Enable the merge of compressed batches to preserve the compression order by |
| `enable_delete_after_compression` | `BOOLEAN` | `false` | Delete all rows after compression instead of truncate |
| `enable_deprecation_warnings` | `BOOLEAN` | `true` | Enable warnings when using deprecated functionality |
| `enable_direct_compress_copy` | `BOOLEAN` | `false` | Enable experimental support for direct compression during COPY |
| `enable_direct_compress_copy_client_sorted` | `BOOLEAN` | `false` | Correct handling of data sorting by the user is required for this option. |
| `enable_direct_compress_copy_sort_batches` | `BOOLEAN` | `true` | Enable batch sorting during direct compress COPY |
| `enable_direct_compress_insert` | `BOOLEAN` | `false` | Enable experimental support for direct compression during INSERT |
| `enable_direct_compress_insert_client_sorted` | `BOOLEAN` | `false` | Correct handling of data sorting by the user is required for this option. |
| `enable_direct_compress_insert_sort_batches` | `BOOLEAN` | `true` | Enable batch sorting during direct compress INSERT |
| `enable_direct_compress_on_cagg_refresh` | `BOOLEAN` | `false` | Enable experimental support for direct compression during Continuous Aggregate refresh |
| `enable_dml_decompression` | `BOOLEAN` | `true` | Enable DML decompression when modifying compressed hypertable |
| `enable_dml_decompression_tuple_filtering` | `BOOLEAN` | `true` | Recheck tuples during DML decompression to only decompress batches with matching tuples |
| `enable_event_triggers` | `BOOLEAN` | `false` | Enable event triggers for chunks creation |
| `enable_exclusive_locking_recompression` | `BOOLEAN` | `false` | Enable getting exclusive lock on chunk during segmentwise recompression |
| `enable_foreign_key_propagation` | `BOOLEAN` | `true` | Adjust foreign key lookup queries to target whole hypertable |
| `enable_in_memory_recompression` | `BOOLEAN` | `true` | Enable in-memory recompression |
| `enable_job_execution_logging` | `BOOLEAN` | `false` | Retain job run status in logging table |
| `enable_merge_on_cagg_refresh` | `BOOLEAN` | `false` | Enable MERGE statement on cagg refresh |
| `enable_multikey_skipscan` | `BOOLEAN` | `true` | Enable SkipScan for multiple distinct inputs |
| `enable_now_constify` | `BOOLEAN` | `true` | Enable constifying now() in query constraints |
| `enable_null_compression` | `BOOLEAN` | `true` | Enable null compression |
| `enable_optimizations` | `BOOLEAN` | `true` | Enable TimescaleDB query optimizations |
| `enable_ordered_append` | `BOOLEAN` | `true` | Enable ordered append optimization for queries that are ordered by the time dimension |
| `enable_parallel_chunk_append` | `BOOLEAN` | `true` | Enable using parallel aware chunk append node |
| `enable_partitioned_hypertables` | `BOOLEAN` | `false` | Enable experimental support for creating hypertables using PostgreSQL's native declarative partitioning |
| `enable_qual_filtering` | `BOOLEAN` | `true` | Filter qualifiers on chunks when complete chunk would be included by filter |
| `enable_qual_propagation` | `BOOLEAN` | `true` | Enable propagation of qualifiers in JOINs |
| `enable_rowlevel_compression_locking` | `BOOLEAN` | `false` |  Use only if you know what you are doing |
| `enable_runtime_exclusion` | `BOOLEAN` | `true` | Enable runtime chunk exclusion in ChunkAppend node |
| `enable_segmentwise_recompression` | `BOOLEAN` | `true` | Enable segmentwise recompression |
| `enable_skipscan` | `BOOLEAN` | `true` | Enable SkipScan for DISTINCT queries |
| `enable_skipscan_for_distinct_aggregates` | `BOOLEAN` | `true` | Enable SkipScan for DISTINCT aggregates |
| `enable_sparse_index_bloom` | `BOOLEAN` | `true` | This sparse index speeds up the equality queries on compressed columns, and can be disabled when not desired. |
| `enable_tiered_reads` | `BOOLEAN` | `true` | Enable reading of tiered data by including a foreign table representing the data in the object storage into the query plan |
| `enable_tss_callbacks` | `BOOLEAN` | `true` | Enable ts_stat_statements callbacks |
| `enable_uuid_compression` | `BOOLEAN` | `true` | Enable uuid compression |
| `enable_vectorized_aggregation` | `BOOLEAN` | `true` | Enable vectorized aggregation for compressed data |
| `license` | `STRING` | `TS_LICENSE_DEFAULT` |  Determines which features are enabled |
| `max_cached_chunks_per_hypertable` | `INTEGER` | `1024` | Maximum number of chunks stored in the cache<br />min: `0`, max: `65536` |
| `max_open_chunks_per_insert` | `INTEGER` | `1024` | Maximum number of open chunk tables per insert<br />min: `0`, max: `PG_INT16_MAX` |
| `max_tuples_decompressed_per_dml_transaction` | `INTEGER` | `100000` | If the number of tuples exceeds this value, an error will be thrown and transaction rolled back. Setting this to 0 sets this value to unlimited number of tuples decompressed.<br />min: `0`, max: `2147483647` |
| `read_legacy_bloom1_v1` | `BOOLEAN` | `false` | These legacy indexes might give false negatives if they were built by the TimescaleDB extension compiled with different build options. |
| `restoring` | `BOOLEAN` | `false` | In restoring mode all timescaledb internal hooks are disabled. This mode is required for restoring logical dumps of databases with timescaledb. |
| `shutdown_bgw_scheduler` | `BOOLEAN` | `false` |  this is for debugging purposes |
| `skip_scan_run_cost_multiplier` | `REAL` | `1.0` | Default is 1.0 i.e. regularly estimated SkipScan run cost, 0.0 will make SkipScan to have run cost = 0<br />min: `0.0`, max: `1.0` |
| `telemetry_level` | `ENUM` | `TELEMETRY_DEFAULT` | Level used to determine which telemetry to send |

Version: [2.25.0][2250]

[2250]: https://github.com/timescale/timescaledb/releases/tag/2.25.0