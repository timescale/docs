| Name | Type | Short Description | Short Description | Value |
| --- | --- | --- | --- | --- |
| `auto_sparse_indexes` | `BOOLEAN` | Create sparse indexes on compressed chunks | The hypertable columns that are used as index keys will have  suitable sparse indexes when compressed. Must be set at the moment  of chunk compression | `&ts_guc_auto_sparse_indexes` |
| `bgw_log_level` | `ENUM` | Log level for the background worker subsystem | Log level for the scheduler and workers of the background worker  subsystem. Requires configuration reload to change. | `/* bootValue= */ WARNING` |
| `compress_truncate_behaviour` | `ENUM` | Define behaviour of truncate after compression | Defines how truncate behaves at the end of compression.  'truncate_only' forces truncation. 'truncate_disabled' deletes rows  instead of truncate. 'truncate_or_delete' allows falling back to  deletion. | `COMPRESS_TRUNCATE_ONLY` |
| `compression_batch_size_limit` | `INTEGER` | The max number of tuples that can be batched together during ""compression | Setting this option to a number between 1 and 999 will force compression to limit the size of compressed batches to that amount of uncompressed tuples.Setting this to 0 defaults to the max batch size of 1000. | `1000` |
| `default_hypercore_use_access_method` | `BOOLEAN` | gettext_noop("Enable to always use Hypercore TAM when compressing.") | gettext_noop(Sets the global default for using Hypercore TAM when   compressing chunks.) | `false` |
| `enable_bool_compression` | `BOOLEAN` | Enable bool compression functionality | Enable bool compression | `true` |
| `enable_bulk_decompression` | `BOOLEAN` | Enable decompression of the entire compressed batches | Increases throughput of decompression | `&ts_guc_enable_bulk_decompression` |
| `enable_cagg_reorder_groupby` | `BOOLEAN` | Enable group by reordering | Enable group by clause reordering for continuous aggregates | `true` |
| `enable_cagg_sort_pushdown` | `BOOLEAN` | Enable sort pushdown for continuous aggregates | Enable pushdown of ORDER BY clause for continuous aggregates | `true` |
| `enable_cagg_watermark_constify` | `BOOLEAN` | Enable cagg watermark constify | Enable constifying cagg watermark for real-time caggs | `true` |
| `enable_cagg_window_functions` | `BOOLEAN` | Enable window functions in continuous aggregates | Allow window functions in continuous aggregate views | `false` |
| `enable_chunk_append` | `BOOLEAN` | Enable chunk append node | Enable using chunk append node | `true` |
| `enable_chunk_skipping` | `BOOLEAN` | Enable chunk skipping functionality | Enable using chunk column stats to filter chunks based on column  filters | `false` |
| `enable_chunkwise_aggregation` | `BOOLEAN` | Enable chunk-wise aggregation | Enable the pushdown of aggregations to the  chunk level | `true` |
| `enable_columnarscan` | `BOOLEAN` | Enable columnar-optimized scans for supported access methods | A columnar scan replaces sequence scans for columnar-oriented  storage  and enables storage-specific optimizations like vectorized filters.  Disabling columnar scan will make PostgreSQL fall back to regular  sequence scans. | `true` |
| `enable_compressed_direct_batch_delete` | `BOOLEAN` | Enable direct deletion of compressed batches | Enable direct batch deletion in compressed chunks | `true` |
| `enable_compressed_skipscan` | `BOOLEAN` | Enable SkipScan for compressed chunks | Enable SkipScan for distinct inputs over compressed chunks | `true` |
| `enable_compression_indexscan` | `BOOLEAN` | Enable compression to take indexscan path | Enable indexscan during compression | `&ts_guc_enable_compression_indexscan` |
| `enable_compression_ratio_warnings` | `BOOLEAN` | Enable warnings for poor compression ratio | Enable warnings for poor compression ratio | `true` |
| `enable_compression_wal_markers` | `BOOLEAN` | Enable WAL markers for compression ops | Enable the generation of markers in the WAL stream which mark the  start and end of compression operations | `true` |
| `enable_compressor_batch_limit` | `BOOLEAN` | Enable compressor batch limit | Enable compressor batch limit for compressors which  can go over the allocation limit (1 GB). This feature will limit those compressors by reducing the size of the batch and thus  avoid hitting the limit. | `false` |
| `enable_constraint_aware_append` | `BOOLEAN` | Enable constraint-aware append scans | Enable constraint exclusion at execution time | `true` |
| `enable_constraint_exclusion` | `BOOLEAN` | Enable constraint exclusion | Enable planner constraint exclusion | `true` |
| `enable_custom_hashagg` | `BOOLEAN` | Enable custom hash aggregation | Enable creating custom hash aggregation plans | `false` |
| `enable_decompression_sorted_merge` | `BOOLEAN` | Enable compressed batches heap merge | Enable the merge of compressed batches to preserve the compression  order by | `true` |
| `enable_delete_after_compression` | `BOOLEAN` | Delete all rows after compression instead of truncate | Delete all rows after compression instead of truncate | `false` |
| `enable_deprecation_warnings` | `BOOLEAN` | Enable warnings when using deprecated functionality | "Enable warnings when using deprecated functionality" | `true` |
| `enable_dml_decompression` | `BOOLEAN` | Enable DML decompression | Enable DML decompression when modifying compressed hypertable | `true` |
| `enable_dml_decompression_tuple_filtering` | `BOOLEAN` | Enable DML decompression tuple filtering | Recheck tuples during DML decompression to only decompress batches  with matching tuples | `true` |
| `enable_event_triggers` | `BOOLEAN` | Enable event triggers for chunks creation | Enable event triggers for chunks creation | `false` |
| `enable_exclusive_locking_recompression` | `BOOLEAN` | Enable exclusive locking recompression | Enable getting exclusive lock on chunk during segmentwise  recompression | `false` |
| `enable_foreign_key_propagation` | `BOOLEAN` | Enable foreign key propagation | Adjust foreign key lookup queries to target whole hypertable | `true` |
| `enable_job_execution_logging` | `BOOLEAN` | Enable job execution logging | Retain job run status in logging table | `false` |
| `enable_merge_on_cagg_refresh` | `BOOLEAN` | Enable MERGE statement on cagg refresh | Enable MERGE statement on cagg refresh | `false` |
| `enable_now_constify` | `BOOLEAN` | Enable now() constify | Enable constifying now() in query constraints | `true` |
| `enable_null_compression` | `BOOLEAN` | Debug only flag to enable NULL compression | Enable null compression | `true` |
| `enable_optimizations` | `BOOLEAN` | Enable TimescaleDB query optimizations | "Enable TimescaleDB query optimizations" | `true` |
| `enable_ordered_append` | `BOOLEAN` | Enable ordered append scans | Enable ordered append optimization for queries that are ordered by  the time dimension | `true` |
| `enable_parallel_chunk_append` | `BOOLEAN` | Enable parallel chunk append node | Enable using parallel aware chunk append node | `true` |
| `enable_qual_propagation` | `BOOLEAN` | Enable qualifier propagation | Enable propagation of qualifiers in JOINs | `true` |
| `enable_runtime_exclusion` | `BOOLEAN` | Enable runtime chunk exclusion | Enable runtime chunk exclusion in ChunkAppend node | `true` |
| `enable_segmentwise_recompression` | `BOOLEAN` | Enable segmentwise recompression functionality | Enable segmentwise recompression | `true` |
| `enable_skipscan` | `BOOLEAN` | Enable SkipScan | Enable SkipScan for DISTINCT queries | `true` |
| `enable_skipscan_for_distinct_aggregates` | `BOOLEAN` | Enable SkipScan for DISTINCT aggregates | Enable SkipScan for DISTINCT aggregates | `true` |
| `enable_sparse_index_bloom` | `BOOLEAN` | Enable creation of the bloom1 sparse index on compressed chunks | This sparse index speeds up the equality queries on compressed  columns | `&ts_guc_enable_sparse_index_bloom` |
| `enable_tiered_reads` | `BOOLEAN` | Enable tiered data reads | Enable reading of tiered data by including a foreign table  representing the data in the object storage into the query plan | `true` |
| `enable_transparent_decompression` | `ENUM` | Enable transparent decompression | Enable transparent decompression when querying hypertable | `1` |
| `enable_tss_callbacks` | `BOOLEAN` | Enable ts_stat_statements callbacks | Enable ts_stat_statements callbacks | `true` |
| `enable_vectorized_aggregation` | `BOOLEAN` | Enable vectorized aggregation | Enable vectorized aggregation for compressed data | `true` |
| `hypercore_copy_to_behavior` | `ENUM` | The behavior of COPY TO on a hypercore table | Set to 'all_data' to return both compressed and uncompressed data  via the Hypercore table when using COPY TO. Set to  'no_compressed_data' to skip compressed data. | `/* bootValue= */ HYPERCORE_COPY_NO_COMPRESSED_DATA` |
| `hypercore_indexam_whitelist` | `STRING` | gettext_noop(   "Whitelist for index access methods supported by hypercore.") | gettext_noop(   List of index access method names supported by hypercore.) | `/* Value= */ "btree` |
| `materializations_per_refresh_window` | `INTEGER` | Max number of materializations per cagg refresh window | The maximal number of individual refreshes per cagg refresh. If more refreshes need to be performed | `&ts_guc_cagg_max_individual_materializations` |
| `max_cached_chunks_per_hypertable` | `INTEGER` | Maximum cached chunks | Maximum number of chunks stored in the cache | `1024` |
| `max_open_chunks_per_insert` | `INTEGER` | Maximum open chunks per insert | Maximum number of open chunk tables per insert | `1024` |
| `max_tuples_decompressed_per_dml_transaction` | `INTEGER` | The max number of tuples that can be decompressed during an ""INSERT | UPDATE | `" If the number of tuples exceeds this value` |
| `restoring` | `BOOLEAN` | Enable restoring mode for timescaledb | In restoring mode all timescaledb internal hooks are disabled. This  mode is required for restoring logical dumps of databases with  timescaledb. | `false` |
| `telemetry_level` | `ENUM` | Telemetry settings level | Level used to determine which telemetry to send | `TELEMETRY_DEFAULT` |
