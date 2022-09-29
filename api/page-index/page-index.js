module.exports = [
  {
    title: "API Reference",
    filePath: "index.md",
    href: "api",
    name: "API Reference",
    excerpt:
      "The API Reference is your go-to resource for all functions, VIEWs and special feature interfaces available with the TimescaleDB extension",
    description:
      "User-defined actions allow you to run functions and procedures implemented in a language of your choice on a schedule within TimescaleDB. This allows...",
    children: [
      {
        title: "Hypertables & chunks",
        type: "directory",
        href: "hypertable",
        children: [
          {
            title: "create_hypertable",
            href: "create_hypertable",
          },
          {
            title: "show_chunks",
            href: "show_chunks",
          },
          {
            title: "drop_chunks",
            href: "drop_chunks",
          },
          {
            title: "reorder_chunk",
            href: "reorder_chunk",
          },
          {
            title: "move_chunk",
            href: "move_chunk",
          },
          {
            title: "add_reorder_policy",
            href: "add_reorder_policy",
          },
          {
            title: "remove_reorder_policy",
            href: "remove_reorder_policy",
          },
          {
            title: "attach_tablespace",
            href: "attach_tablespace",
          },
          {
            title: "detach_tablespace",
            href: "detach_tablespace",
          },
          {
            title: "detach_tablespaces",
            href: "detach_tablespaces",
          },
          {
            title: "show_tablespaces",
            href: "show_tablespaces",
          },
          {
            title: "set_chunk_time_interval",
            href: "set_chunk_time_interval",
          },
          {
            title: "set_integer_now_func",
            href: "set_integer_now_func",
          },
          {
            title: "add_dimension",
            href: "add_dimension",
          },
          {
            title: "create_index (transaction per chunk)",
            href: "create_index",
          },
          {
            title: "hypertable_size",
            href: "hypertable_size",
          },
          {
            title: "hypertable_detailed_size",
            href: "hypertable_detailed_size",
          },
          {
            title: "hypertable_index_size",
            href: "hypertable_index_size",
          },
          {
            title: "chunks_detailed_size",
            href: "chunks_detailed_size",
          },
        ],
      },
      {
        title: "Distributed hypertables",
        type: "directory",
        href: "distributed-hypertables",
        children: [
          {
            title: "create_distributed_hypertable",
            href: "create_distributed_hypertable",
          },
          {
            title: "add_data_node",
            href: "add_data_node",
          },
          {
            title: "attach_data_node",
            href: "attach_data_node",
          },
          {
            title: "detach_data_node",
            href: "detach_data_node",
          },
          {
            title: "delete_data_node",
            href: "delete_data_node",
          },
          {
            title: "distributed_exec",
            href: "distributed_exec",
          },
          {
            title: "set_number_partitions",
            href: "set_number_partitions",
          },
          {
            title: "set_replication_factor",
            href: "set_replication_factor",
          },
          {
            title: "copy_chunk",
            href: "copy_chunk_experimental",
          },
          {
            title: "move_chunk",
            href: "move_chunk_experimental",
          },
          {
            title: "cleanup_copy_chunk_operation",
            href: "cleanup_copy_chunk_operation_experimental",
          },
          {
            title: "create_distributed_restore_point",
            href: "create_distributed_restore_point",
          },
        ],
      },
      {
        title: "Compression",
        type: "directory",
        href: "compression",
        description:
          "We highly recommend reading the blog post and tutorial about compression before trying to set it up for the first time.",
        children: [
          {
            title: "ALTER TABLE (Compression)",
            href: "alter_table_compression",
          },
          {
            title: "add_compression_policy",
            href: "add_compression_policy",
          },
          {
            title: "remove_compression_policy",
            href: "remove_compression_policy",
          },
          {
            title: "compress_chunk",
            href: "compress_chunk",
          },
          {
            title: "decompress_chunk",
            href: "decompress_chunk",
          },
          {
            title: "recompress_chunk",
            href: "recompress_chunk",
          },
          {
            title: "hypertable_compression_stats",
            href: "hypertable_compression_stats",
          },
          {
            title: "chunk_compression_stats",
            href: "chunk_compression_stats",
          },
        ],
      },
      {
        title: "Continuous aggregates",
        type: "directory",
        href: "continuous-aggregates",
        children: [
          {
            title: "CREATE MATERIALIZED VIEW (Continuous Aggregate)",
            href: "create_materialized_view",
          },
          {
            title: "ALTER MATERIALIZED VIEW (Continuous Aggregate)",
            href: "alter_materialized_view",
          },
          {
            title: "DROP MATERIALIZED VIEW (Continuous Aggregate)",
            href: "drop_materialized_view",
          },
          {
            title: "refresh_continuous_aggregate",
            href: "refresh_continuous_aggregate",
          },
          {
            title: "add_continuous_aggregate_policy",
            href: "add_continuous_aggregate_policy",
          },
          {
            title: "add_policies",
            href: "add_policies",
          },
          {
            title: "alter_policies",
            href: "alter_policies",
          },
          {
            title: "show_policies",
            href: "show_policies",
          },
          {
            title: "remove_continuous_aggregate_policy",
            href: "remove_continuous_aggregate_policy",
          },
          {
            title: "remove_policies",
            href: "remove_policies",
          },
          {
            title: "remove_all_policies",
            href: "remove_all_policies",
          },
        ],
      },
      {
        title: "Data retention",
        type: "directory",
        href: "data-retention",
        children: [
          {
            title: "add_retention_policy",
            href: "add_retention_policy",
          },
          {
            title: "remove_retention_policy",
            href: "remove_retention_policy",
          },
        ],
      },
      {
        title: "Actions and automation",
        type: "directory",
        href: "actions",
        children: [
          {
            title: "add_job",
            href: "add_job",
          },
          {
            title: "alter_job",
            href: "alter_job",
          },
          {
            title: "delete_job",
            href: "delete_job",
          },
          {
            title: "run_job",
            href: "run_job",
          },
        ],
      },
      {
        title: "Hyperfunctions",
        type: "directory",
        href: "hyperfunctions",
        children: [
          {
            title: "approximate_row_count",
            href: "approximate_row_count",
          },
          {
            title: "first",
            href: "first",
          },
          {
            title: "last",
            href: "last",
          },
          {
            title: "histogram",
            href: "histogram",
          },
          {
            title: "time_bucket",
            href: "time_bucket",
          },
          {
            title: "time_bucket_ng",
            href: "time_bucket_ng",
          },
          {
            title: "days_in_month",
            href: "days_in_month",
          },
          {
            title: "month_normalize",
            href: "month_normalize",
          },
          {
            title: "Approximate count distincts",
            type: "directory",
            href: "approx_count_distincts",
            children: [
              {
                title: "hyperloglog",
                href: "hyperloglog",
              },
              {
                title: "rollup",
                href: "rollup-hyperloglog",
              },
              {
                title: "distinct_count",
                href: "distinct_count",
              },
              {
                title: "stderror",
                href: "stderror",
              },
              {
                title: "approx_count_distinct",
                href: "approx_count_distinct",
              },
            ],
          },
          {
            title: "Saturating math",
            type: "directory",
            href: "saturating_math",
            children: [
              {
                title: "saturating_add",
                href: "saturating_add",
              },
              {
                title: "saturating_add_pos",
                href: "saturating_add_pos",
              },
              {
                title: "saturating_mul",
                href: "saturating_mul",
              },
              {
                title: "saturating_sub",
                href: "saturating_sub",
              },
              {
                title: "saturating_sub_pos",
                href: "saturating_sub_pos",
              },
            ],
          },
          {
            title: "Statistical aggregates",
            type: "directory",
            href: "stats_aggs",
            children: [
              {
                title: "stats_agg",
                href: "stats_agg",
              },
              {
                title: "rolling",
                href: "rolling-stats",
              },
              {
                title: "rollup",
                href: "rollup-stats",
              },
              {
                title: "average / average_y / average_x",
                href: "average-stats",
              },
              {
                title: "corr (correlation coefficient)",
                href: "corr-stats",
              },
              {
                title: "covariance",
                href: "covariance",
              },
              {
                title: "determination_coeff (R squared)",
                href: "determination_coeff",
              },
              {
                title: "intercept",
                href: "intercept-stats",
              },
              {
                title: "kurtosis / kurtosis_y / kurtosis_x",
                href: "kurtosis",
              },
              {
                title: "num_vals",
                href: "num_vals-stats",
              },
              {
                title: "skewness / skewness_y / skewness_x",
                href: "skewness",
              },
              {
                title: "stddev / stddev_y / stddev_x",
                href: "stddev",
              },
              {
                title: "slope",
                href: "slope-stats",
              },
              {
                title: "sum/ sum_y / sum_x",
                href: "sum-stats",
              },
              {
                title: "variance / variance_y / variance_x",
                href: "variance",
              },
              {
                title: "x_intercept",
                href: "x_intercept",
              },
            ],
          },
          {
            title: "Financial analysis",
            type: "directory",
            href: "financial-analysis",
            children: [
              {
                title: "ohlc",
                href: "ohlc",
              },
              {
                title: "open, high, low, close",
                href: "open-high-low-close",
              },
              {
                title: "open_time, high_time, low_time, close_time",
                href: "open-high-low-close-time",
              },
              {
                title: "rollup",
                href: "rollup",
              },
            ],
          },
          {
            title: "Gapfilling and interpolation",
            type: "directory",
            href: "gapfilling-interpolation",
            children: [
              {
                title: "time_bucket_gapfill",
                href: "time_bucket_gapfill",
              },
              {
                title: "locf",
                href: "locf",
              },
              {
                title: "interpolate",
                href: "interpolate",
              },
            ],
          },
          {
            title: "Percentile approximation",
            type: "directory",
            href: "percentile-approximation",
            children: [
              {
                title: "percentile_agg",
                href: "percentile_agg",
              },
              {
                title: "approx_percentile",
                href: "approx_percentile",
              },
              {
                title: "approx_percentile_rank",
                href: "approx_percentile_rank",
              },
              {
                title: "rollup",
                href: "rollup-percentile",
              },
              {
                title: "max_val",
                href: "max_val",
              },
              {
                title: "mean",
                href: "mean",
              },
              {
                title: "error",
                href: "error",
              },
              {
                title: "min_val",
                href: "min_val",
              },
              {
                title: "num_vals",
                href: "num_vals-percentile",
              },
              {
                title: "Advanced aggregation methods",
                type: "directory",
                href: "percentile-aggregation-methods",
                children: [
                  {
                    title: "uddsketch",
                    href: "uddsketch",
                  },
                  {
                    title: "tdigest",
                    href: "tdigest",
                  },
                ],
              },
            ],
          },
          {
            title: "Metric aggregation (counters and gauges)",
            type: "directory",
            href: "counter_aggs",
            children: [
              {
                title: "counter_agg (point form)",
                href: "counter_agg_point",
              },
              {
                title: "gauge_agg",
                href: "gauge_agg",
              },
              {
                title: "rollup",
                href: "rollup-counter",
              },
              {
                title: "corr",
                href: "corr-counter",
              },
              {
                title: "counter_zero_time",
                href: "counter_zero_time",
              },
              {
                title: "delta",
                href: "delta",
              },
              {
                title: "extrapolated_delta",
                href: "extrapolated_delta",
              },
              {
                title: "extrapolated_rate",
                href: "extrapolated_rate",
              },
              {
                title: "first_time, last_time",
                href: "first-last-time-counter",
              },
              {
                title: "first_val, last_val",
                href: "first-last-val-counter",
              },
              {
                title: "interpolated_delta",
                href: "interpolated_delta",
              },
              {
                title: "interpolated_rate",
                href: "interpolated_rate",
              },
              {
                title: "idelta",
                href: "idelta",
              },
              {
                title: "intercept",
                href: "intercept-counter",
              },
              {
                title: "irate",
                href: "irate",
              },
              {
                title: "num_changes",
                href: "num_changes",
              },
              {
                title: "num_elements",
                href: "num_elements",
              },
              {
                title: "num_resets",
                href: "num_resets",
              },
              {
                title: "rate",
                href: "rate",
              },
              {
                title: "slope",
                href: "slope-counter",
              },
              {
                title: "time_delta",
                href: "time_delta",
              },
              {
                title: "with_bounds",
                href: "with_bounds",
              },
            ],
          },
          {
            title: "Time-weighted averages",
            type: "directory",
            href: "time-weighted-averages",
            children: [
              {
                title: "time_weight",
                href: "time_weight",
              },
              {
                title: "rollup",
                href: "rollup-timeweight",
              },
              {
                title: "average",
                href: "average-time-weight",
              },
              {
                title: "first_time, last_time",
                href: "first-last-time-timeweight",
              },
              {
                title: "first_val, last_val",
                href: "first-last-val-timeweight",
              },
              {
                title: "integral",
                href: "integral-time-weight",
              },
              {
                title: "interpolated_average",
                href: "interpolated_average",
              },
              {
                title: "interpolated_integral",
                href: "interpolated_integral",
              },
            ],
          },
          {
            title: "Downsample",
            type: "directory",
            href: "downsample",
            children: [
              {
                title: "asap",
                href: "asap",
              },
              {
                title: "lttb",
                href: "lttb",
              },
            ],
          },
          {
            title: "Frequency Analysis",
            type: "directory",
            href: "frequency-analysis",
            children: [
              {
                title: "freq_agg",
                href: "freq_agg",
              },
              {
                title: "topn_agg",
                href: "topn_agg",
              },
              {
                title: "topn",
                href: "topn",
              },
              {
                title: "count_min_sketch",
                href: "count_min_sketch",
              },
              {
                title: "approx_count",
                href: "approx_count",
              },
              {
                title: "into_values (for freq_agg)",
                href: "into_values-freq_agg",
              },
              {
                title: "min_frequency / max_frequency",
                href: "min_frequency-max_frequency",
              },
              {
                title: "state_agg",
                href: "state_agg",
              },
              {
                title: "duration_in",
                href: "duration_in",
              },
              {
                title: "interpolated_duration_in",
                href: "interpolated_duration_in",
              },
              {
                title: "into_values (for state_agg)",
                href: "into_values-state_agg",
              },
            ],
          },
        ],
      },
      {
        title: "Informational views",
        type: "directory",
        href: "informational-views",
        children: [
          {
            title: "timescaledb_information.chunks",
            href: "chunks",
          },
          {
            title: "timescaledb_information.continuous_aggregates",
            href: "continuous_aggregates",
          },
          {
            title: "timescaledb_information.compression_settings",
            href: "compression_settings",
          },
          {
            title: "timescaledb_information.data_nodes",
            href: "data_nodes",
          },
          {
            title: "timescaledb_information.dimensions",
            href: "dimensions",
          },
          {
            title: "timescaledb_information.hypertables",
            href: "hypertables",
          },
          {
            title: "timescaledb_information.jobs",
            href: "jobs",
          },
          {
            title: "timescaledb_information.job_stats",
            href: "job_stats",
          },
          {
            title: "timescaledb_experimental.policies",
            href: "policies",
          },
        ],
      },
      {
        href: "configuration",
        excerpt: "Configure PostgreSQL and TimescaleDB",
      },
      {
        title: "Administration Functions",
        type: "directory",
        href: "administration",
        description:
          "These administrative APIs help you prepare a database before and after a restore event, and also helps you keep track of your TimescaleDB setup data.",
        children: [
          {
            title: "timescaledb_pre_restore",
            href: "timescaledb_pre_restore",
          },
          {
            title: "timescaledb_post_restore",
            href: "timescaledb_post_restore",
          },
          {
            title: "get_telemetry_report",
            href: "get_telemetry_report",
          },
          {
            title: "dump_meta_data",
            href: "dump_meta_data",
          },
        ],
      },
      {
        title: "API Reference Tag Overview",
        href: "api-tag-overview",
        description:
          "An overview of what different tags represent in the API section of Timescale Documentation.",
      },
    ],
  },
];
