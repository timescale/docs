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
            title: "create_hypertable (old interface)",
            href: "create_hypertable_old",
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
            title: "add_dimension (old interface)",
            href: "add_dimension_old",
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
            title: "hypertable_approximate_size",
            href: "hypertable_approximate_size",
          },
          {
            title: "hypertable_detailed_size",
            href: "hypertable_detailed_size",
          },
          {
            title: "hypertable_approximate_detailed_size",
            href: "hypertable_approximate_detailed_size",
          },
          {
            title: "hypertable_index_size",
            href: "hypertable_index_size",
          },
          {
            title: "chunks_detailed_size",
            href: "chunks_detailed_size",
          },
          {
            title: "dimension builders",
            href: "dimension_info",
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
            title: "alter_data_node",
            href: "alter_data_node",
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
        type: "redirect-to-child-page",
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
            title: "cagg_migrate",
            href: "cagg_migrate",
          },
          {
            title: "remove_policies",
            href: "remove_policies",
          },
          {
            title: "remove_all_policies",
            href: "remove_all_policies",
          },
          {
            title: "hypertable_size",
            href: "hypertable_size",
          },
          {
            title: "hypertable_detailed_size",
            href: "hypertable_detailed_size",
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
            title: "Approximate count distinct",
            href: "approximate-count-distinct",
            type: "redirect-to-child-page",
            children: [
              {
                title: "hyperloglog",
                href: "hyperloglog",
                type: "placeholder",
              },
            ],
          },
          {
            title: "Saturating math",
            type: "placeholder",
            href: "saturating-math",
          },
          {
            title: "Statistical and regression analysis",
            href: "statistical-and-regression-analysis",
            type: "redirect-to-child-page",
            children: [
              {
                title: "stats_agg (one variable)",
                href: "stats_agg-one-variable",
                type: "placeholder",
              },
              {
                title: "stats_agg (two variables)",
                href: "stats_agg-two-variables",
                type: "placeholder",
              },
            ],
          },
          {
            title: "Minimum and maximum",
            href: "minimum-and-maximum",
            type: "redirect-to-child-page",
            children: [
              {
                title: "min_n",
                href: "min_n",
                type: "placeholder",
              },
              {
                title: "max_n",
                href: "max_n",
                type: "placeholder",
              },
              {
                title: "min_n_by",
                href: "min_n_by",
                type: "placeholder",
              },
              {
                title: "max_n_by",
                href: "max_n_by",
                type: "placeholder",
              },
            ],
          },
          {
            title: "Financial analysis",
            href: "financial-analysis",
            type: "redirect-to-child-page",
            children: [
              {
                title: "candlestick_agg",
                href: "candlestick_agg",
                type: "placeholder",
              },
            ],
          },
          {
            title: "Gapfilling",
            href: "gapfilling",
            type: "redirect-to-child-page",
            children: [
              {
                title: "time_bucket_gapfill",
                href: "time_bucket_gapfill",
                type: "placeholder",
              },
            ],
          },
          {
            title: "Percentile approximation",
            href: "percentile-approximation",
            type: "redirect-to-child-page",
            children: [
              {
                title: "percentile_agg and uddsketch",
                href: "uddsketch",
                type: "placeholder",
              },
              {
                title: "tdigest",
                href: "tdigest",
                type: "placeholder",
              },
            ],
          },
          {
            title: "Counters and gauges",
            type: "redirect-to-child-page",
            href: "counters-and-gauges",
            children: [
              {
                title: "counter_agg",
                href: "counter_agg",
                type: "placeholder",
              },
              {
                title: "gauge_agg",
                href: "gauge_agg",
                type: "placeholder",
              },
            ],
          },
          {
            title: "Time-weighted calculations",
            href: "time-weighted-calculations",
            type: "redirect-to-child-page",
            children: [
              {
                title: "time_weight",
                href: "time_weight",
                type: "placeholder",
              },
            ],
          },
          {
            title: "Downsampling",
            type: "placeholder",
            href: "downsampling",
          },
          {
            title: "Frequency analysis",
            type: "redirect-to-child-page",
            href: "frequency-analysis",
            children: [
              {
                title: "freq_agg",
                href: "freq_agg",
                type: "placeholder",
              },
              {
                title: "count_min_sketch",
                href: "count_min_sketch",
                type: "placeholder",
              },
            ],
          },
          {
            title: "State tracking",
            type: "redirect-to-child-page",
            href: "state-tracking",
            children: [
              {
                title: "compact_state_agg",
                href: "compact_state_agg",
                type: "placeholder",
              },
              {
                title: "state_agg",
                href: "state_agg",
                type: "placeholder",
              },
              {
                title: "heartbeat_agg",
                href: "heartbeat_agg",
                type: "placeholder",
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
            title: "timescaledb_information.chunk_compression_settings",
            href: "chunk_compression_settings",
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
            title: "timescaledb_information.hypertable_compression_settings",
            href: "hypertable_compression_settings",
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
            title: "timescaledb_information.job_errors",
            href: "job_errors",
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
