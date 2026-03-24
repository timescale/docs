---
title: PostgreSQL metrics
excerpt: Reference for PostgreSQL metrics available in Tiger Cloud
products: [cloud]
keywords: [metrics, postgresql, monitoring]
tags: [telemetry, monitor, metrics]
---

# PostgreSQL metrics

These additional metrics are collected if you tick `PostgreSQL metrics` when creating $CLOUD_LONG exporters. 
All metrics have a scrape interval of 15 seconds.

## Exporter metrics

These metrics show the health and status of the metrics collection process, including scrape duration, errors, and total scrape count.

|Metric|Description|
|-|-|
|`pg_exporter_last_scrape_duration_seconds`|Duration of the last scrape of metrics from PostgreSQL.|
|`pg_exporter_last_scrape_error`|Whether the last scrape of metrics from PostgreSQL resulted in an error (1 for error, 0 for success).|
|`pg_exporter_scrapes_total`|Total number of times PostgreSQL was scraped for metrics.|
|`pg_exporter_user_queries_load_error`|Whether the user queries file was loaded and parsed successfully (1 for error, 0 for success).|

## Lock metrics

These metrics track current lock activity in the database, helping you detect lock contention that may be blocking queries.

|Metric|Description|
|-|-|
|`pg_locks_count`|Number of locks.|

## Replication metrics

These metrics track the status and lag of replication slots, helping you monitor whether replicas are keeping up with the primary.

|Metric|Description|
|-|-|
|`pg_replication_slots_active`|Flag indicating if the slot is active.|
|`pg_replication_slots_pg_wal_lsn_diff`|Replication lag in bytes.|

## PG settings metrics

These metrics expose the current values of PostgreSQL configuration parameters as numeric values, covering memory limits, planner costs, autovacuum tuning, WAL configuration, and more.

|Metric|Description|
|-|-|
|`pg_settings_allow_alter_system`|Allows running the ALTER SYSTEM command.|
|`pg_settings_allow_in_place_tablespaces`|Allows tablespaces directly inside `pg_tblspc`, for testing.|
|`pg_settings_allow_system_table_mods`|Allows modifications of the structure of system tables.|
|`pg_settings_archive_timeout_seconds`|Sets the amount of time to wait before forcing a switch to the next WAL file. Units converted to seconds.|
|`pg_settings_array_nulls`|Enables input of NULL elements in arrays.|
|`pg_settings_authentication_timeout_seconds`|Sets the maximum allowed time to complete client authentication. Units converted to seconds.|
|`pg_settings_auto_explain_log_analyze`|Use EXPLAIN ANALYZE for plan logging.|
|`pg_settings_auto_explain_log_buffers`|Log buffers usage.|
|`pg_settings_auto_explain_log_min_duration_seconds`|Sets the minimum execution time above which plans will be logged. Units converted to seconds.|
|`pg_settings_auto_explain_log_nested_statements`|Log nested statements.|
|`pg_settings_auto_explain_log_parameter_max_length_bytes`|Sets the maximum length of query parameter values to log. Units converted to bytes.|
|`pg_settings_auto_explain_log_settings`|Log modified configuration parameters affecting query planning.|
|`pg_settings_auto_explain_log_timing`|Collect timing data, not just row counts.|
|`pg_settings_auto_explain_log_triggers`|Include trigger statistics in plans.|
|`pg_settings_auto_explain_log_verbose`|Use EXPLAIN VERBOSE for plan logging.|
|`pg_settings_auto_explain_log_wal`|Log WAL usage.|
|`pg_settings_auto_explain_sample_rate`|Fraction of queries to process.|
|`pg_settings_autovacuum`|Starts the autovacuum subprocess.|
|`pg_settings_autovacuum_analyze_scale_factor`|Number of tuple inserts, updates, or deletes prior to analyze as a fraction of `reltuples`.|
|`pg_settings_autovacuum_analyze_threshold`|Minimum number of tuple inserts, updates, or deletes prior to analyze.|
|`pg_settings_autovacuum_freeze_max_age`|Age at which to autovacuum a table to prevent transaction ID wraparound.|
|`pg_settings_autovacuum_max_workers`|Sets the maximum number of simultaneously running autovacuum worker processes.|
|`pg_settings_autovacuum_multixact_freeze_max_age`|Multixact age at which to autovacuum a table to prevent multixact wraparound.|
|`pg_settings_autovacuum_naptime_seconds`|Time to sleep between autovacuum runs. Units converted to seconds.|
|`pg_settings_autovacuum_vacuum_cost_delay_seconds`|Vacuum cost delay in milliseconds, for autovacuum. Units converted to seconds.|
|`pg_settings_autovacuum_vacuum_cost_limit`|Vacuum cost amount available before napping, for autovacuum.|
|`pg_settings_autovacuum_vacuum_insert_scale_factor`|Number of tuple inserts prior to vacuum as a fraction of `reltuples`.|
|`pg_settings_autovacuum_vacuum_insert_threshold`|Minimum number of tuple inserts prior to vacuum.|
|`pg_settings_autovacuum_vacuum_max_threshold`|Maximum number of tuple updates or deletes prior to vacuum.|
|`pg_settings_autovacuum_vacuum_scale_factor`|Number of tuple updates or deletes prior to vacuum as a fraction of `reltuples`.|
|`pg_settings_autovacuum_vacuum_threshold`|Minimum number of tuple updates or deletes prior to vacuum.|
|`pg_settings_autovacuum_work_mem_bytes`|Sets the maximum memory to be used by each autovacuum worker process. Units converted to bytes.|
|`pg_settings_autovacuum_worker_slots`|Sets the number of backend slots to allocate for autovacuum workers.|
|`pg_settings_backend_flush_after_bytes`|Number of pages after which previously performed writes are flushed to disk. Units converted to bytes.|
|`pg_settings_bgwriter_delay_seconds`|Background writer sleep time between rounds. Units converted to seconds.|
|`pg_settings_bgwriter_flush_after_bytes`|Number of pages after which previously performed writes are flushed to disk. Units converted to bytes.|
|`pg_settings_bgwriter_lru_maxpages`|Background writer maximum number of LRU pages to flush per round.|
|`pg_settings_bgwriter_lru_multiplier`|Multiple of the average buffer usage to free per round.|
|`pg_settings_block_size`|Shows the size of a disk block.|
|`pg_settings_bonjour`|Enables advertising the server via Bonjour.|
|`pg_settings_check_function_bodies`|Check routine bodies during CREATE FUNCTION and CREATE PROCEDURE.|
|`pg_settings_checkpoint_completion_target`|Time spent flushing dirty buffers during checkpoint, as fraction of checkpoint interval.|
|`pg_settings_checkpoint_flush_after_bytes`|Number of pages after which previously performed writes are flushed to disk. Units converted to bytes.|
|`pg_settings_checkpoint_timeout_seconds`|Sets the maximum time between automatic WAL checkpoints. Units converted to seconds.|
|`pg_settings_checkpoint_warning_seconds`|Sets the maximum time before warning if checkpoints triggered by WAL volume happen too frequently. Units converted to seconds.|
|`pg_settings_client_connection_check_interval_seconds`|Sets the time interval between checks for disconnection while running queries. Units converted to seconds.|
|`pg_settings_commit_delay`|Sets the delay in microseconds between transaction commit and flushing WAL to disk.|
|`pg_settings_commit_siblings`|Sets the minimum number of concurrent open transactions required before performing `commit_delay`.|
|`pg_settings_commit_timestamp_buffers_bytes`|Sets the size of the dedicated buffer pool used for the commit timestamp cache. Units converted to bytes.|
|`pg_settings_cpu_index_tuple_cost`|Sets the planner's estimate of the cost of processing each index entry during an index scan.|
|`pg_settings_cpu_operator_cost`|Sets the planner's estimate of the cost of processing each operator or function call.|
|`pg_settings_cpu_tuple_cost`|Sets the planner's estimate of the cost of processing each tuple (row).|
|`pg_settings_cursor_tuple_fraction`|Sets the planner's estimate of the fraction of a cursor's rows that will be retrieved.|
|`pg_settings_data_checksums`|Shows whether data checksums are turned on for this cluster.|
|`pg_settings_data_directory_mode`|Shows the mode of the data directory.|
|`pg_settings_data_sync_retry`|Whether to continue running after a failure to sync data files.|
|`pg_settings_deadlock_timeout_seconds`|Sets the time to wait on a lock before checking for deadlock. Units converted to seconds.|
|`pg_settings_debug_assertions`|Shows whether the running server has assertion checks enabled.|
|`pg_settings_debug_discard_caches`|Aggressively flush system caches for debugging purposes.|
|`pg_settings_debug_pretty_print`|Indents parse and plan tree displays.|
|`pg_settings_debug_print_parse`|Logs each query's parse tree.|
|`pg_settings_debug_print_plan`|Logs each query's execution plan.|
|`pg_settings_debug_print_rewritten`|Logs each query's rewritten parse tree.|
|`pg_settings_default_statistics_target`|Sets the default statistics target.|
|`pg_settings_default_transaction_deferrable`|Sets the default deferrable status of new transactions.|
|`pg_settings_default_transaction_read_only`|Sets the default read-only status of new transactions.|
|`pg_settings_effective_cache_size_bytes`|Sets the planner's assumption about the total size of the data caches. Units converted to bytes.|
|`pg_settings_effective_io_concurrency`|Number of simultaneous requests that can be handled efficiently by the disk subsystem.|
|`pg_settings_enable_async_append`|Enables the planner's use of async append plans.|
|`pg_settings_enable_bitmapscan`|Enables the planner's use of bitmap-scan plans.|
|`pg_settings_enable_distinct_reordering`|Enables reordering of DISTINCT keys.|
|`pg_settings_enable_gathermerge`|Enables the planner's use of gather merge plans.|
|`pg_settings_enable_group_by_reordering`|Enables reordering of GROUP BY keys.|
|`pg_settings_enable_hashagg`|Enables the planner's use of hashed aggregation plans.|
|`pg_settings_enable_hashjoin`|Enables the planner's use of hash join plans.|
|`pg_settings_enable_incremental_sort`|Enables the planner's use of incremental sort steps.|
|`pg_settings_enable_indexonlyscan`|Enables the planner's use of index-only-scan plans.|
|`pg_settings_enable_indexscan`|Enables the planner's use of index-scan plans.|
|`pg_settings_enable_material`|Enables the planner's use of materialization.|
|`pg_settings_enable_memoize`|Enables the planner's use of memoization.|
|`pg_settings_enable_mergejoin`|Enables the planner's use of merge join plans.|
|`pg_settings_enable_nestloop`|Enables the planner's use of nested-loop join plans.|
|`pg_settings_enable_parallel_append`|Enables the planner's use of parallel append plans.|
|`pg_settings_enable_parallel_hash`|Enables the planner's use of parallel hash plans.|
|`pg_settings_enable_partition_pruning`|Enables plan-time and execution-time partition pruning.|
|`pg_settings_enable_partitionwise_aggregate`|Enables partitionwise aggregation and grouping.|
|`pg_settings_enable_partitionwise_join`|Enables partitionwise join.|
|`pg_settings_enable_presorted_aggregate`|Enables the planner's ability to produce plans that provide presorted input for ORDER BY / DISTINCT aggregate functions.|
|`pg_settings_enable_self_join_elimination`|Enables removal of unique self-joins.|
|`pg_settings_enable_seqscan`|Enables the planner's use of sequential-scan plans.|
|`pg_settings_enable_sort`|Enables the planner's use of explicit sort steps.|
|`pg_settings_enable_tidscan`|Enables the planner's use of TID scan plans.|
|`pg_settings_escape_string_warning`|Warn about backslash escapes in ordinary string literals.|
|`pg_settings_event_triggers`|Enables event triggers.|
|`pg_settings_exit_on_error`|Terminate session on any error.|
|`pg_settings_extra_float_digits`|Sets the number of digits displayed for floating-point values.|
|`pg_settings_extwlist_extname_from_filename`|Flag allowing a lookup of extension name in custom script filename.|
|`pg_settings_from_collapse_limit`|Sets the FROM-list size beyond which subqueries are not collapsed.|
|`pg_settings_fsync`|Forces synchronization of updates to disk.|
|`pg_settings_full_page_writes`|Writes full pages to WAL when first modified after a checkpoint.|
|`pg_settings_geqo`|Enables genetic query optimization.|
|`pg_settings_geqo_effort`|GEQO: effort is used to set the default for other GEQO parameters.|
|`pg_settings_geqo_generations`|GEQO: number of iterations of the algorithm.|
|`pg_settings_geqo_pool_size`|GEQO: number of individuals in the population.|
|`pg_settings_geqo_seed`|GEQO: seed for random path selection.|
|`pg_settings_geqo_selection_bias`|GEQO: selective pressure within the population.|
|`pg_settings_geqo_threshold`|Sets the threshold of FROM items beyond which GEQO is used.|
|`pg_settings_gin_fuzzy_search_limit`|Sets the maximum allowed result for exact search by GIN.|
|`pg_settings_gin_pending_list_limit_bytes`|Sets the maximum size of the pending list for GIN index. Units converted to bytes.|
|`pg_settings_gss_accept_delegation`|Sets whether GSSAPI delegation should be accepted from the client.|
|`pg_settings_hash_mem_multiplier`|Multiple of `work_mem` to use for hash tables.|
|`pg_settings_hot_standby`|Allows connections and queries during recovery.|
|`pg_settings_hot_standby_feedback`|Allows feedback from a hot standby to the primary that will avoid query conflicts.|
|`pg_settings_huge_page_size_bytes`|The size of huge page that should be requested. Units converted to bytes.|
|`pg_settings_idle_in_transaction_session_timeout_seconds`|Sets the maximum allowed idle time between queries, when in a transaction. Units converted to seconds.|
|`pg_settings_idle_replication_slot_timeout_seconds`|Sets the duration a replication slot can remain idle before it is invalidated. Units converted to seconds.|
|`pg_settings_idle_session_timeout_seconds`|Sets the maximum allowed idle time between queries, when not in a transaction. Units converted to seconds.|
|`pg_settings_ignore_checksum_failure`|Continues processing after a checksum failure.|
|`pg_settings_ignore_invalid_pages`|Continues recovery after an invalid pages failure.|
|`pg_settings_ignore_system_indexes`|Disables reading from system indexes.|
|`pg_settings_in_hot_standby`|Shows whether hot standby is currently active.|
|`pg_settings_integer_datetimes`|Shows whether datetimes are integer based.|
|`pg_settings_io_combine_limit_bytes`|Limit on the size of data reads and writes. Units converted to bytes.|
|`pg_settings_io_max_combine_limit_bytes`|Server-wide limit that clamps `io_combine_limit`. Units converted to bytes.|
|`pg_settings_io_max_concurrency`|Max number of IOs that one process can execute simultaneously.|
|`pg_settings_io_workers`|Number of IO worker processes, for `io_method=worker`.|
|`pg_settings_jit`|Allow JIT compilation.|
|`pg_settings_jit_above_cost`|Perform JIT compilation if query is more expensive.|
|`pg_settings_jit_debugging_support`|Register JIT-compiled functions with debugger.|
|`pg_settings_jit_dump_bitcode`|Write out LLVM bitcode to facilitate JIT debugging.|
|`pg_settings_jit_expressions`|Allow JIT compilation of expressions.|
|`pg_settings_jit_inline_above_cost`|Perform JIT inlining if query is more expensive.|
|`pg_settings_jit_optimize_above_cost`|Optimize JIT-compiled functions if query is more expensive.|
|`pg_settings_jit_profiling_support`|Register JIT-compiled functions with perf profiler.|
|`pg_settings_jit_tuple_deforming`|Allow JIT compilation of tuple deforming.|
|`pg_settings_join_collapse_limit`|Sets the FROM-list size beyond which JOIN constructs are not flattened.|
|`pg_settings_krb_caseins_users`|Sets whether Kerberos and GSSAPI user names should be treated as case-insensitive.|
|`pg_settings_lo_compat_privileges`|Enables backward compatibility mode for privilege checks on large objects.|
|`pg_settings_lock_timeout_seconds`|Sets the maximum allowed duration of any wait for a lock. Units converted to seconds.|
|`pg_settings_log_autovacuum_min_duration_seconds`|Sets the minimum execution time above which autovacuum actions will be logged. Units converted to seconds.|
|`pg_settings_log_checkpoints`|Logs each checkpoint.|
|`pg_settings_log_disconnections`|Logs end of a session, including duration.|
|`pg_settings_log_duration`|Logs the duration of each completed SQL statement.|
|`pg_settings_log_executor_stats`|Writes executor performance statistics to the server log.|
|`pg_settings_log_file_mode`|Sets the file permissions for log files.|
|`pg_settings_log_hostname`|Logs the host name in the connection logs.|
|`pg_settings_log_lock_failures`|Logs lock failures.|
|`pg_settings_log_lock_waits`|Logs long lock waits.|
|`pg_settings_log_min_duration_sample_seconds`|Sets the minimum execution time above which a sample of statements will be logged. Sampling is determined by `log_statement_sample_rate`. Units converted to seconds.|
|`pg_settings_log_min_duration_statement_seconds`|Sets the minimum execution time above which all statements will be logged. Units converted to seconds.|
|`pg_settings_log_parameter_max_length_bytes`|Sets the maximum length in bytes of data logged for bind parameter values when logging statements. Units converted to bytes.|
|`pg_settings_log_parameter_max_length_on_error_bytes`|Sets the maximum length in bytes of data logged for bind parameter values when logging statements, on error. Units converted to bytes.|
|`pg_settings_log_parser_stats`|Writes parser performance statistics to the server log.|
|`pg_settings_log_planner_stats`|Writes planner performance statistics to the server log.|
|`pg_settings_log_recovery_conflict_waits`|Logs standby recovery conflict waits.|
|`pg_settings_log_replication_commands`|Logs each replication command.|
|`pg_settings_log_rotation_age_seconds`|Sets the amount of time to wait before forcing log file rotation. Units converted to seconds.|
|`pg_settings_log_rotation_size_bytes`|Sets the maximum size a log file can reach before being rotated. Units converted to bytes.|
|`pg_settings_log_startup_progress_interval_seconds`|Time between progress updates for long-running startup operations. Units converted to seconds.|
|`pg_settings_log_statement_sample_rate`|Fraction of statements exceeding `log_min_duration_sample` to be logged.|
|`pg_settings_log_statement_stats`|Writes cumulative performance statistics to the server log.|
|`pg_settings_log_temp_files_bytes`|Log the use of temporary files larger than this number of kilobytes. Units converted to bytes.|
|`pg_settings_log_transaction_sample_rate`|Sets the fraction of transactions from which to log all statements.|
|`pg_settings_log_truncate_on_rotation`|Truncate existing log files of same name during log rotation.|
|`pg_settings_logging_collector`|Start a subprocess to capture stderr, csvlog and/or jsonlog into log files.|
|`pg_settings_logical_decoding_work_mem_bytes`|Sets the maximum memory to be used for logical decoding. Units converted to bytes.|
|`pg_settings_maintenance_io_concurrency`|A variant of `effective_io_concurrency` that is used for maintenance work.|
|`pg_settings_maintenance_work_mem_bytes`|Sets the maximum memory to be used for maintenance operations. Units converted to bytes.|
|`pg_settings_max_active_replication_origins`|Sets the maximum number of active replication origins.|
|`pg_settings_max_connections`|Sets the maximum number of concurrent connections.|
|`pg_settings_max_files_per_process`|Sets the maximum number of files each server process is allowed to open simultaneously.|
|`pg_settings_max_function_args`|Shows the maximum number of function arguments.|
|`pg_settings_max_identifier_length`|Shows the maximum identifier length.|
|`pg_settings_max_index_keys`|Shows the maximum number of index keys.|
|`pg_settings_max_locks_per_transaction`|Sets the maximum number of locks per transaction.|
|`pg_settings_max_logical_replication_workers`|Maximum number of logical replication worker processes.|
|`pg_settings_max_notify_queue_pages`|Sets the maximum number of allocated pages for NOTIFY / LISTEN queue.|
|`pg_settings_max_parallel_apply_workers_per_subscription`|Maximum number of parallel apply workers per subscription.|
|`pg_settings_max_parallel_maintenance_workers`|Sets the maximum number of parallel processes per maintenance operation.|
|`pg_settings_max_parallel_workers`|Sets the maximum number of parallel workers that can be active at one time.|
|`pg_settings_max_parallel_workers_per_gather`|Sets the maximum number of parallel processes per executor node.|
|`pg_settings_max_pred_locks_per_page`|Sets the maximum number of predicate-locked tuples per page.|
|`pg_settings_max_pred_locks_per_relation`|Sets the maximum number of predicate-locked pages and tuples per relation.|
|`pg_settings_max_pred_locks_per_transaction`|Sets the maximum number of predicate locks per transaction.|
|`pg_settings_max_prepared_transactions`|Sets the maximum number of simultaneously prepared transactions.|
|`pg_settings_max_replication_slots`|Sets the maximum number of simultaneously defined replication slots.|
|`pg_settings_max_slot_wal_keep_size_bytes`|Sets the maximum WAL size that can be reserved by replication slots. Units converted to bytes.|
|`pg_settings_max_stack_depth_bytes`|Sets the maximum stack depth, in kilobytes. Units converted to bytes.|
|`pg_settings_max_standby_archive_delay_seconds`|Sets the maximum delay before canceling queries when a hot standby server is processing archived WAL data. Units converted to seconds.|
|`pg_settings_max_standby_streaming_delay_seconds`|Sets the maximum delay before canceling queries when a hot standby server is processing streamed WAL data. Units converted to seconds.|
|`pg_settings_max_sync_workers_per_subscription`|Maximum number of table synchronization workers per subscription.|
|`pg_settings_max_wal_senders`|Sets the maximum number of simultaneously running WAL sender processes.|
|`pg_settings_max_wal_size_bytes`|Sets the WAL size that triggers a checkpoint. Units converted to bytes.|
|`pg_settings_max_worker_processes`|Maximum number of concurrent worker processes.|
|`pg_settings_md5_password_warnings`|Enables deprecation warnings for MD5 passwords.|
|`pg_settings_mem_guard_block`|Block memory allocations in query executing processes if the usage is above limit.|
|`pg_settings_mem_guard_enable_auth_hook`|The use the authentication hook to indicate if we should block a pid.|
|`pg_settings_mem_guard_enable_explain`|Enable collection of data in explain plans.|
|`pg_settings_mem_guard_limit_bytes`|The memory limit for all processes in the container. Units converted to bytes.|
|`pg_settings_min_dynamic_shared_memory_bytes`|Amount of dynamic shared memory reserved at startup. Units converted to bytes.|
|`pg_settings_min_parallel_index_scan_size_bytes`|Sets the minimum amount of index data for a parallel scan. Units converted to bytes.|
|`pg_settings_min_parallel_table_scan_size_bytes`|Sets the minimum amount of table data for a parallel scan. Units converted to bytes.|
|`pg_settings_min_wal_size_bytes`|Sets the minimum size to shrink the WAL to. Units converted to bytes.|
|`pg_settings_multixact_member_buffers_bytes`|Sets the size of the dedicated buffer pool used for the MultiXact member cache. Units converted to bytes.|
|`pg_settings_multixact_offset_buffers_bytes`|Sets the size of the dedicated buffer pool used for the MultiXact offset cache. Units converted to bytes.|
|`pg_settings_notify_buffers_bytes`|Sets the size of the dedicated buffer pool used for the LISTEN/NOTIFY message cache. Units converted to bytes.|
|`pg_settings_num_os_semaphores`|Shows the number of semaphores required for the server.|
|`pg_settings_parallel_leader_participation`|Controls whether Gather and Gather Merge also run subplans.|
|`pg_settings_parallel_setup_cost`|Sets the planner's estimate of the cost of starting up worker processes for parallel query.|
|`pg_settings_parallel_tuple_cost`|Sets the planner's estimate of the cost of passing each tuple (row) from worker to leader backend.|
|`pg_settings_pg_prewarm_autoprewarm`|Starts the autoprewarm worker.|
|`pg_settings_pg_prewarm_autoprewarm_interval_seconds`|Sets the interval between dumps of shared buffers. Units converted to seconds.|
|`pg_settings_pg_stat_statements_max`|Sets the maximum number of statements tracked by `pg_stat_statements`.|
|`pg_settings_pg_stat_statements_save`|Save `pg_stat_statements` statistics across server shutdowns.|
|`pg_settings_pg_stat_statements_track_planning`|Selects whether planning duration is tracked by `pg_stat_statements`.|
|`pg_settings_pg_stat_statements_track_utility`|Selects whether utility commands are tracked by `pg_stat_statements`.|
|`pg_settings_pgaudit_log_catalog`|Specifies that session logging should be enabled in the case where all relations in a statement are in `pg_catalog`. Disabling this setting will reduce noise in the log from tools like psql and PgAdmin that query the catalog heavily.|
|`pg_settings_pgaudit_log_client`|Specifies whether audit messages should be visible to the client. This setting should generally be left disabled but may be useful for debugging or other purposes.|
|`pg_settings_pgaudit_log_parameter`|Specifies that audit logging should include the parameters that were passed with the statement. When parameters are present they will be included in CSV format after the statement text.|
|`pg_settings_pgaudit_log_parameter_max_size`|Specifies, in bytes, the maximum length of variable-length parameters to log. If 0 (the default), parameters are not checked for size. If set, when the size of the parameter is longer than the setting, the value in the audit log is replaced with a placeholder. Note that for character types, the length is in bytes for the parameter's encoding, not characters.|
|`pg_settings_pgaudit_log_relation`|Specifies whether session audit logging should create a separate log entry for each relation referenced in a SELECT or DML statement. This is a useful shortcut for exhaustive logging without using object audit logging.|
|`pg_settings_pgaudit_log_rows`|Specifies whether logging will include the rows retrieved or affected by a statement.|
|`pg_settings_pgaudit_log_statement`|Specifies whether logging will include the statement text and parameters. Depending on requirements, the full statement text might not be required in the audit log.|
|`pg_settings_pgaudit_log_statement_once`|Specifies whether logging will include the statement text and parameters with the first log entry for a statement/substatement combination or with every entry. Enabling this setting will result in less verbose logging but may make it more difficult to determine the statement that generated a log entry, though the statement/substatement pair along with the process id should suffice to identify the statement text logged with a previous entry.|
|`pg_settings_port`|Sets the TCP port the server listens on.|
|`pg_settings_post_auth_delay_seconds`|Sets the amount of time to wait after authentication on connection startup. Units converted to seconds.|
|`pg_settings_pre_auth_delay_seconds`|Sets the amount of time to wait before authentication on connection startup. Units converted to seconds.|
|`pg_settings_quote_all_identifiers`|When generating SQL fragments, quote all identifiers.|
|`pg_settings_random_page_cost`|Sets the planner's estimate of the cost of a nonsequentially fetched disk page.|
|`pg_settings_recovery_min_apply_delay_seconds`|Sets the minimum delay for applying changes during recovery. Units converted to seconds.|
|`pg_settings_recovery_target_inclusive`|Sets whether to include or exclude transaction with recovery target.|
|`pg_settings_recursive_worktable_factor`|Sets the planner's estimate of the average size of a recursive query's working table.|
|`pg_settings_remove_temp_files_after_crash`|Remove temporary files after backend crash.|
|`pg_settings_reserved_connections`|Sets the number of connection slots reserved for roles with privileges of `pg_use_reserved_connections`.|
|`pg_settings_restart_after_crash`|Reinitialize server after backend crash.|
|`pg_settings_row_security`|Enables row security.|
|`pg_settings_scram_iterations`|Sets the iteration count for SCRAM secret generation.|
|`pg_settings_segment_size_bytes`|Shows the number of pages per disk file. Units converted to bytes.|
|`pg_settings_send_abort_for_crash`|Send SIGABRT not SIGQUIT to child processes after backend crash.|
|`pg_settings_send_abort_for_kill`|Send SIGABRT not SIGKILL to stuck child processes.|
|`pg_settings_seq_page_cost`|Sets the planner's estimate of the cost of a sequentially fetched disk page.|
|`pg_settings_serializable_buffers_bytes`|Sets the size of the dedicated buffer pool used for the serializable transaction cache. Units converted to bytes.|
|`pg_settings_server_version_num`|Shows the server version as an integer.|
|`pg_settings_shared_buffers_bytes`|Sets the number of shared memory buffers used by the server. Units converted to bytes.|
|`pg_settings_shared_memory_size_bytes`|Shows the size of the server's main shared memory area (rounded up to the nearest MB). Units converted to bytes.|
|`pg_settings_shared_memory_size_in_huge_pages`|Shows the number of huge pages needed for the main shared memory area.|
|`pg_settings_ssl`|Enables SSL connections.|
|`pg_settings_ssl_passphrase_command_supports_reload`|Controls whether `ssl_passphrase_command` is called during server reload.|
|`pg_settings_ssl_prefer_server_ciphers`|Give priority to server ciphersuite order.|
|`pg_settings_standard_conforming_strings`|Causes '...' strings to treat backslashes literally.|
|`pg_settings_statement_timeout_seconds`|Sets the maximum allowed duration of any statement. Units converted to seconds.|
|`pg_settings_subtransaction_buffers_bytes`|Sets the size of the dedicated buffer pool used for the subtransaction cache. Units converted to bytes.|
|`pg_settings_summarize_wal`|Starts the WAL summarizer process to enable incremental backup.|
|`pg_settings_superuser_reserved_connections`|Sets the number of connection slots reserved for superusers.|
|`pg_settings_sync_replication_slots`|Enables a physical standby to synchronize logical failover replication slots from the primary server.|
|`pg_settings_synchronize_seqscans`|Enables synchronized sequential scans.|
|`pg_settings_syslog_sequence_numbers`|Add sequence number to syslog messages to avoid duplicate suppression.|
|`pg_settings_syslog_split_messages`|Split messages sent to syslog by lines and to fit into 1024 bytes.|
|`pg_settings_tcp_keepalives_count`|Maximum number of TCP keepalive retransmits.|
|`pg_settings_tcp_keepalives_idle_seconds`|Time between issuing TCP keepalives. Units converted to seconds.|
|`pg_settings_tcp_keepalives_interval_seconds`|Time between TCP keepalive retransmits. Units converted to seconds.|
|`pg_settings_tcp_user_timeout_seconds`|TCP user timeout. Units converted to seconds.|
|`pg_settings_temp_buffers_bytes`|Sets the maximum number of temporary buffers used by each session. Units converted to bytes.|
|`pg_settings_temp_file_limit_bytes`|Limits the total size of all temporary files used by each process. Units converted to bytes.|
|`pg_settings_timescaledb_bgw_launcher_poll_time`|Launcher timeout value in milliseconds.|
|`pg_settings_timescaledb_bgw_scheduler_restart_time_seconds`|Restart time for scheduler. Units converted to seconds.|
|`pg_settings_timescaledb_disable_load`|Disable the loading of the actual extension.|
|`pg_settings_timescaledb_lake_disable_load`|Disable the loading of the actual extension.|
|`pg_settings_timescaledb_max_background_workers`|Maximum background worker processes allocated to TimescaleDB|
|`pg_settings_timescaledb_osm_disable_load`|Disable the loading of the actual extension.|
|`pg_settings_trace_connection_negotiation`|Logs details of pre-authentication connection handshake.|
|`pg_settings_trace_notify`|Generates debugging output for LISTEN and NOTIFY.|
|`pg_settings_trace_sort`|Emit information about resource usage in sorting.|
|`pg_settings_track_activities`|Collects information about executing commands.|
|`pg_settings_track_activity_query_size_bytes`|Sets the size reserved for `pg_stat_activity`.query, in bytes. Units converted to bytes.|
|`pg_settings_track_commit_timestamp`|Collects transaction commit time.|
|`pg_settings_track_cost_delay_timing`|Collects timing statistics for cost-based vacuum delay.|
|`pg_settings_track_counts`|Collects statistics on database activity.|
|`pg_settings_track_io_timing`|Collects timing statistics for database I/O activity.|
|`pg_settings_track_wal_io_timing`|Collects timing statistics for WAL I/O activity.|
|`pg_settings_transaction_buffers_bytes`|Sets the size of the dedicated buffer pool used for the transaction status cache. Units converted to bytes.|
|`pg_settings_transaction_deferrable`|Whether to defer a read-only serializable transaction until it can be executed with no possible serialization failures.|
|`pg_settings_transaction_read_only`|Sets the current transaction's read-only status.|
|`pg_settings_transaction_timeout_seconds`|Sets the maximum allowed duration of any transaction within a session (not a prepared transaction). Units converted to seconds.|
|`pg_settings_transform_null_equals`|Treats "expr=NULL" as "expr IS NULL".|
|`pg_settings_ts_stat_statements_enable_auth_hook`|Selects whether the auth hook is intercepted by ts_stat_statements.|
|`pg_settings_ts_stat_statements_enable_log_hook`|Selects whether the log hook is intercepted by ts_stat_statements.|
|`pg_settings_ts_stat_statements_enable_mem_guard_stats`|Enable reading memory stats from mem_guard.|
|`pg_settings_ts_stat_statements_enable_regression_debug`|Enable debug messages for regression tests.|
|`pg_settings_ts_stat_statements_enable_system_stats`|Enable system stat collections.|
|`pg_settings_ts_stat_statements_explain_bound`|When tracking, capture an explain plan for queries running longer than this many milliseconds.|
|`pg_settings_ts_stat_statements_track_planning`|Selects whether planning duration is tracked by ts_stat_statements.|
|`pg_settings_ts_stat_statements_track_utility`|Selects whether utility commands are tracked by ts_stat_statements.|
|`pg_settings_tsdb_admin_read_only_connection`|Enable immutable read-only mode for this connection.|
|`pg_settings_tsdb_admin_read_only_role`|Enable immutable read-only mode for this role.|
|`pg_settings_unix_socket_permissions`|Sets the access permissions of the Unix-domain socket.|
|`pg_settings_update_process_title`|Updates the process title to show the active SQL command.|
|`pg_settings_vacuum_buffer_usage_limit_bytes`|Sets the buffer pool size for VACUUM, ANALYZE, and autovacuum. Units converted to bytes.|
|`pg_settings_vacuum_cost_delay_seconds`|Vacuum cost delay in milliseconds. Units converted to seconds.|
|`pg_settings_vacuum_cost_limit`|Vacuum cost amount available before napping.|
|`pg_settings_vacuum_cost_page_dirty`|Vacuum cost for a page dirtied by vacuum.|
|`pg_settings_vacuum_cost_page_hit`|Vacuum cost for a page found in the buffer cache.|
|`pg_settings_vacuum_cost_page_miss`|Vacuum cost for a page not found in the buffer cache.|
|`pg_settings_vacuum_failsafe_age`|Age at which VACUUM should trigger failsafe to avoid a wraparound outage.|
|`pg_settings_vacuum_freeze_min_age`|Minimum age at which VACUUM should freeze a table row.|
|`pg_settings_vacuum_freeze_table_age`|Age at which VACUUM should scan whole table to freeze tuples.|
|`pg_settings_vacuum_max_eager_freeze_failure_rate`|Fraction of pages in a relation vacuum can scan and fail to freeze before disabling eager scanning.|
|`pg_settings_vacuum_multixact_failsafe_age`|Multixact age at which VACUUM should trigger failsafe to avoid a wraparound outage.|
|`pg_settings_vacuum_multixact_freeze_min_age`|Minimum age at which VACUUM should freeze a MultiXactId in a table row.|
|`pg_settings_vacuum_multixact_freeze_table_age`|Multixact age at which VACUUM should scan whole table to freeze tuples.|
|`pg_settings_vacuum_truncate`|Enables vacuum to truncate empty pages at the end of the table.|
|`pg_settings_wal_block_size`|Shows the block size in the write ahead log.|
|`pg_settings_wal_buffers_bytes`|Sets the number of disk-page buffers in shared memory for WAL. Units converted to bytes.|
|`pg_settings_wal_decode_buffer_size_bytes`|Buffer size for reading ahead in the WAL during recovery. Units converted to bytes.|
|`pg_settings_wal_init_zero`|Writes zeroes to new WAL files before first use.|
|`pg_settings_wal_keep_size_bytes`|Sets the size of WAL files held for standby servers. Units converted to bytes.|
|`pg_settings_wal_log_hints`|Writes full pages to WAL when first modified after a checkpoint, even for a non-critical modification.|
|`pg_settings_wal_receiver_create_temp_slot`|Sets whether a WAL receiver should create a temporary replication slot if no permanent slot is configured.|
|`pg_settings_wal_receiver_status_interval_seconds`|Sets the maximum interval between WAL receiver status reports to the sending server. Units converted to seconds.|
|`pg_settings_wal_receiver_timeout_seconds`|Sets the maximum wait time to receive data from the sending server. Units converted to seconds.|
|`pg_settings_wal_recycle`|Recycles WAL files by renaming them.|
|`pg_settings_wal_retrieve_retry_interval_seconds`|Sets the time to wait before retrying to retrieve WAL after a failed attempt. Units converted to seconds.|
|`pg_settings_wal_segment_size_bytes`|Shows the size of write ahead log segments. Units converted to bytes.|
|`pg_settings_wal_sender_timeout_seconds`|Sets the maximum time to wait for WAL replication. Units converted to seconds.|
|`pg_settings_wal_skip_threshold_bytes`|Minimum size of new file to fsync instead of writing WAL. Units converted to bytes.|
|`pg_settings_wal_summary_keep_time_seconds`|Time for which WAL summary files should be kept. Units converted to seconds.|
|`pg_settings_wal_writer_delay_seconds`|Time between WAL flushes performed in the WAL writer. Units converted to seconds.|
|`pg_settings_wal_writer_flush_after_bytes`|Amount of WAL written out by WAL writer that triggers a flush. Units converted to bytes.|
|`pg_settings_work_mem_bytes`|Sets the maximum memory to be used for query workspaces. Units converted to bytes.|
|`pg_settings_zero_damaged_pages`|Continues processing past damaged page headers.|

## PG stats metrics

These metrics come from PostgreSQL's internal statistics collector and include connection counts, transaction throughput, buffer usage, replication state, and database-level I/O.

|Metric|Description|
|-|-|
|`pg_stat_activity_count`|Number of connections in this state.|
|`pg_stat_activity_max_tx_duration`|Max duration in seconds any active transaction has been running.|
|`pg_stat_archiver_archived_count_total`|Number of WAL files that have been successfully archived.|
|`pg_stat_archiver_failed_count_total`|Number of failed attempts for archiving WAL files.|
|`pg_stat_archiver_last_archive_age`|Time in seconds since last WAL segment was successfully archived.|
|`pg_stat_bgwriter_buffers_alloc_total`|Number of buffers allocated.|
|`pg_stat_bgwriter_buffers_clean_total`|Number of buffers written by the background writer.|
|`pg_stat_bgwriter_maxwritten_clean_total`|Number of times the background writer stopped a cleaning scan because it had written too many buffers.|
|`pg_stat_bgwriter_stats_reset_total`|Time at which these statistics were last reset.|
|`pg_stat_database_active_time`|Unknown metric from `pg_stat_database`.|
|`pg_stat_database_blk_read_time_total`|Time spent reading data file blocks by backends in this database, in milliseconds.|
|`pg_stat_database_blk_write_time_total`|Time spent writing data file blocks by backends in this database, in milliseconds.|
|`pg_stat_database_blks_hit_total`|Number of times disk blocks were found already in the buffer cache, so that a read was not necessary (this only includes hits in the PostgreSQL buffer cache, not the operating system's file system cache).|
|`pg_stat_database_blks_read_total`|Number of disk blocks read in this database.|
|`pg_stat_database_checksum_failures`|Unknown metric from `pg_stat_database`.|
|`pg_stat_database_checksum_last_failure`|Unknown metric from `pg_stat_database`.|
|`pg_stat_database_conflicts_confl_active_logicalslot`|Unknown metric from `pg_stat_database_conflicts`.|
|`pg_stat_database_conflicts_confl_bufferpin_total`|Number of queries in this database that have been canceled due to pinned buffers.|
|`pg_stat_database_conflicts_confl_deadlock_total`|Number of queries in this database that have been canceled due to deadlocks.|
|`pg_stat_database_conflicts_confl_lock_total`|Number of queries in this database that have been canceled due to lock timeouts.|
|`pg_stat_database_conflicts_confl_snapshot_total`|Number of queries in this database that have been canceled due to old snapshots.|
|`pg_stat_database_conflicts_confl_tablespace_total`|Number of queries in this database that have been canceled due to dropped tablespaces.|
|`pg_stat_database_conflicts_total`|Number of queries canceled due to conflicts with recovery in this database. (Conflicts occur only on standby servers; see `pg_stat_database_conflicts` for details.)|
|`pg_stat_database_deadlocks_total`|Number of deadlocks detected in this database.|
|`pg_stat_database_idle_in_transaction_time`|Unknown metric from `pg_stat_database`.|
|`pg_stat_database_numbackends`|Number of backends currently connected to this database. This is the only column in this view that returns a value reflecting current state; all other columns return the accumulated values since the last reset.|
|`pg_stat_database_parallel_workers_launched`|Unknown metric from `pg_stat_database`.|
|`pg_stat_database_parallel_workers_to_launch`|Unknown metric from `pg_stat_database`.|
|`pg_stat_database_session_time`|Unknown metric from `pg_stat_database`.|
|`pg_stat_database_sessions`|Unknown metric from `pg_stat_database`.|
|`pg_stat_database_sessions_abandoned`|Unknown metric from `pg_stat_database`.|
|`pg_stat_database_sessions_fatal`|Unknown metric from `pg_stat_database`.|
|`pg_stat_database_sessions_killed`|Unknown metric from `pg_stat_database`.|
|`pg_stat_database_stats_reset_total`|Time at which these statistics were last reset.|
|`pg_stat_database_temp_bytes_total`|Total amount of data written to temporary files by queries in this database. All temporary files are counted, regardless of why the temporary file was created, and regardless of the `log_temp_files` setting.|
|`pg_stat_database_temp_files_total`|Number of temporary files created by queries in this database. All temporary files are counted, regardless of why the temporary file was created (e.g., sorting or hashing), and regardless of the `log_temp_files` setting.|
|`pg_stat_database_tup_deleted_total`|Number of rows deleted by queries in this database.|
|`pg_stat_database_tup_fetched_total`|Number of rows fetched by queries in this database.|
|`pg_stat_database_tup_inserted_total`|Number of rows inserted by queries in this database.|
|`pg_stat_database_tup_returned_total`|Number of rows returned by queries in this database.|
|`pg_stat_database_tup_updated_total`|Number of rows updated by queries in this database.|
|`pg_stat_database_xact_commit_total`|Number of transactions in this database that have been committed.|
|`pg_stat_database_xact_rollback_total`|Number of transactions in this database that have been rolled back.|
|`pg_stat_replication_pg_current_wal_lsn_bytes`|WAL position in bytes.|
|`pg_stat_replication_pg_wal_lsn_diff`|Lag in bytes between primary and replica.|
|`pg_stat_replication_reply_time`|Timestamp of the last reply message received from the standby server.|
|`pg_static`|Version string as reported by PostgreSQL.|
|`pg_up`|Whether the last scrape of metrics from PostgreSQL was able to connect to the server (1 for yes, 0 for no).|