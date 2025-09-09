module.exports = [
  {
    title: "API Reference",
    filePath: "index.md",
    href: "api",
    name: "API Reference",
    excerpt:
      "The API Reference is your go-to resource for all functions, VIEWs and special feature interfaces available with the TimescaleDB extension",
    description:
      "Jobs allow you to run functions and procedures implemented in a language of your choice on a schedule within TimescaleDB. This allows...",
    children: [
      {
        title: "Hypertables and chunks",
        href: "hypertable",
        children: [
          {
            title: "CREATE TABLE",
            href: "create_table",
          },
          {
            title: "create_hypertable",
            href: "create_hypertable",
          },
          {
            title: "create_hypertable (old API)",
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
            title: "split_chunk",
            href: "split_chunk",
          },
          {
            title: "merge_chunks",
            href: "merge_chunks",
          },
          {
            title: "move_chunk",
            href: "move_chunk",
          },
          {
            title: "detach_chunk",
            href: "detach_chunk",
          },
          {
            title: "attach_chunk",
            href: "attach_chunk",
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
            title: "enable_chunk_skipping",
            href: "enable_chunk_skipping",
          },
          {
            title: "disable_chunk_skipping",
            href: "disable_chunk_skipping",
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
        ],
      },
      {
        title: "Hypercore",
        excerpt: "Seamlessly switch between fast row-oriented storage and efficient column-oriented storage",
        href: "hypercore",
        children: [
          {
            title: "ALTER TABLE",
            href: "alter_table",
            excerpt: "Enable the columnstore for a hypertable.",
          },
          {
            title: "add_columnstore_policy",
            href: "add_columnstore_policy",
            excerpt: "Automatically convert chunks in the hypertable rowstore to the columnstore after a specific time interval",
          },
          {
            title: "remove_columnstore_policy",
            href: "remove_columnstore_policy",
            excerpt: "Remove a columnstore policy from a hypertable or continuous aggregate",
          },
          {
            title: "convert_to_columnstore",
            href: "convert_to_columnstore",
            excerpt: "Manually convert a specific chunk in the hypertable rowstore to the columnstore",
          },
          {
            title: "convert_to_rowstore",
            href: "convert_to_rowstore",
            excerpt: "Manually convert a specific chunk in the hypertable columnstore to the rowstore",
          },
          {
            title: "hypertable_columnstore_settings",
            href: "hypertable_columnstore_settings",
            excerpt: "Retrieve information about the settings for all hypertables in the columnstore",
          },
          {
            title: "hypertable_columnstore_stats",
            href: "hypertable_columnstore_stats",
            excerpt: "Retrieve compression statistics for the columnstore",
          },
          {
            title: "chunk_columnstore_settings",
            href: "chunk_columnstore_settings",
            excerpt: "Retrieve the compression settings for each chunk in the columnstore",
          },
          {
            title: "chunk_columnstore_stats",
            href: "chunk_columnstore_stats",
            excerpt: "Retrieve statistics about the chunks in the columnstore",
          },
        ],
      },
      {
        title: "Continuous aggregates",
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
        title: "Jobs and automation",
        href: "jobs-automation",
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
            title: "timescaledb_information.job_history",
            href: "job_history",
          },
          {
            title: "timescaledb_experimental.policies",
            href: "policies",
          },
        ],
      },
      {
        title: "Service configuration",
        href: "configuration",
        excerpt: "Configure Tiger Postgres",
        children: [
          {
            title: "Tiger Postgres configuration",
            href: "tiger-postgres",
            excerpt: "Configure PostgreSQL and TimescaleDB",
          },
          {
            title: "Grand Unified Configuration (GUC) parameters",
            href: "gucs",
            excerpt: "Change the behaviour of TimescaleDB using GUCs",
          },
          ],
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
          "An overview of what different tags represent in the API section of TigerData Documentation.",
      },
      {
        title: "Tiger Cloud REST API",
        href: "api-reference",
        description:
          "A comprehensive RESTful API for managing Tiger Cloud resources including VPCs, services, and read replicas.",
      },
      {
        title: "Glossary",
        href: "glossary",
        description:
          "Comprehensive glossary of technical terms, concepts, and terminology used in TigerData documentation and the time-series database industry.",
      },
      {
        title: "Compression (Old API, replaced by Hypercore)",
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
        title: "Distributed hypertables (Sunsetted v2.14.x)",
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
    ],
  },
];
