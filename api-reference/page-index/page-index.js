

module.exports = [
  {
    title: "API Reference",
    filePath: 'index.md',
    href: "api-reference",
    name: 'API Reference',
    excerpt: 'The API Reference is your go-to resource for all functions, VIEWs and special feature interfaces available with the TimescaleDB extension',
    children: [
      {
        title: "Hypertables & Chunks",
        type: 'directory',
        href: "hypertables-and-chunks",
        children: [
          {
            title: "create_hypertable",
            href: "create_hypertable"
          },
          {
            title: "show_chunks",
            href: "show_chunks"
          },
          {
            title: "drop_chunks",
            href: "drop_chunks"
          },
          {
            title: "reorder_chunk",
            href: "reorder_chunk"
          },
          {
            title: "move_chunk",
            href: "move_chunk"
          },
          {
            title: "add_reorder_policy",
            href: "add_reorder_policy"
          },
          {
            title: "remove_reorder_policy",
            href: "remove_reorder_policy"
          },
          {
            title: "attach_tablespace",
            href: "attach_tablespace"
          },
          {
            title: "detach_tablespace",
            href: "detach_tablespace"
          },
          {
            title: "detach_tablespaces",
            href: "detach_tablespaces"
          },
          {
            title: "show_tablespaces",
            href: "show_tablespaces"
          },
          {
            title: "set_chunk_time_interval",
            href: "set_chunk_time_interval"
          },
          {
            title: "set_number_partitions",
            href: "set_number_partitions"
          },
          {
            title: "set_replication_factor",
            href: "set_replication_factor"
          },
          {
            title: "set_integer_now_func",
            href: "set_integer_now_func"
          },
          {
            title: "add_dimension",
            href: "add_dimension"
          },
          {
            title: "create_index (transaction per chunk)",
            href: "create_index"
          },
          {
            title: "hypertable_size",
            href: "hypertable_size"
          },
          {
            title: "hypertable_detailed_size",
            href: "hypertable_detailed_size"
          },
          {
            title: "hypertable_index_size",
            href: "hypertable_index_size"
          },
          {
            title: "chunks_detailed_size",
            href: "chunks_detailed_size"
          }
        ]
      },
      {
        title: "Distributed Hypertables",
        type: 'directory',
        href: "distributed-hypertables",
        children: [
          {
            title: "create_distributed_hypertable",
            href: "create_distributed_hypertable"
          },
          {
            title: "add_data_node",
            href: "add_data_node"
          },
          {
            title: "attach_data_node",
            href: "attach_data_node"
          },
          {
            title: "detach_data_node",
            href: "detach_data_node"
          },
          {
            title: "delete_data_node",
            href: "delete_data_node"
          },
          {
            title: "distributed_exec",
            href: "distributed_exec"
          },
          {
            title: "reorder_chunk",
            href: "reorder_chunk"
          },
          {
            title: "add_reorder_policy",
            href: "add_reorder_policy"
          },
          {
            title: "remove_reorder_policy",
            href: "remove_reorder_policy"
          },
          {
            title: "set_chunk_time_interval",
            href: "set_chunk_time_interval"
          },
          {
            title: "set_number_partitions",
            href: "set_number_partitions"
          },
          {
            title: "set_replication_factor",
            href: "set_replication_factor"
          },
          {
            title: "set_integer_now_func",
            href: "set_integer_now_func"
          },
          {
            title: "create_index",
            href: "create_index"
          }
        ]
      },
      {
        title: "Compression",
        type: 'directory',
        href: "compression",
        children: [
          {
            title: "ALTER TABLE (Compression)",
            href: "alter_table_compression"
          },
          {
            title: "add_compression_policy",
            href: "add_compression_policy"
          },
          {
            title: "remove_compression_policy",
            href: "remove_compression_policy"
          },
          {
            title: "compress_chunk",
            href: "compress_chunk"
          },
          {
            title: "decompress_chunk",
            href: "decompress_chunk"
          },
          {
            title: "hypertable_compression_stats",
            href: "hypertable_compression_stats"
          },
          {
            title: "chunk_compression_stats",
            href: "chunk_compression_stats"
          }
        ]
      },
      {
        title: "Continuous Aggregates",
        type: 'directory',
        href: "continuous-aggregates",
        children: [
          {
            title: "CREATE MATERIALIZED VIEW (Continuous Aggregate)",
            href: "create_materialized_view"
          },
          {
            title: "ALTER MATERIALIZED VIEW (Continuous Aggregate)",
            href: "alter_materialized_view"
          },
          {
            title: "DROP MATERIALIZED VIEW (Continuous Aggregate)",
            href: "drop_materialized_view"
          },
          {
            title: "add_continuous_aggregate_policy",
            href: "add_continuous_aggregate_policy"
          },
          {
            title: "refresh_continuous_aggregate",
            href: "refresh_continuous_aggregate"
          },
          {
            title: "remove_continuous_aggregate_policy",
            href: "remove_continuous_aggregate_policy"
          }
        ]
      },
      {
        title: "Data Retention",
        type: 'directory',
        href: "data-retention",
        children: [
          {
            title: "add_retention_policy",
            href: "add_retention_policy"
          },
          {
            title: "remove_retention_policy",
            href: "remove_retention_policy"
          }
        ]
      },
      {
        title: "Actions and Automation",
        type: 'directory',
        href: "actions-and-automation",
        children: [
          {
            title: "add_job",
            href: "add_job"
          },
          {
            title: "alter_job",
            href: "alter_job"
          },
          {
            title: "delete_job",
            href: "delete_job"
          },
          {
            title: "run_job",
            href: "run_job"
          }
        ]
      },
      {
        title: "Analytics",
        type: 'directory',
        href: "analytics",
        children: [
          {
            title: "approximate_row_count",
            href: "approximate_row_count"
          },
          {
            title: "first",
            href: "first"
          },
          {
            title: "last",
            href: "last"
          },
          {
            title: "histogram",
            href: "histogram"
          },
          {
            title: "locf",
            href: "locf"
          },
          {
            title: "interpolate",
            href: "interpolate"
          },
          {
            title: "time_bucket",
            href: "time_bucket"
          },
          {
            title: "time_bucket_gapfill",
            href: "time_bucket_gapfill"
          }
        ]
      },
      {
        title: "Informational Views",
        type: 'directory',
        href: "informational-views",
        children: [
          {
            title: "timescaledb_information.chunks",
            href: "timescaledb_information-chunks"
          },
          {
            title: "timescaledb_information.continuous_aggregates",
            href: "timescaledb_information-continuous_aggregates"
          },
          {
            title: "timescaledb_information.compression_settings",
            href: "timescaledb_information-compression_settings"
          },
          {
            title: "timescaledb_information.data_nodes",
            href: "timescaledb_information-data_nodes"
          },
          {
            title: "timescaledb_information.dimensions",
            href: "timescaledb_information-dimensions"
          },
          {
            title: "timescaledb_information.hypertables",
            href: "timescaledb_information-hypertables"
          },
          {
            title: "timescaledb_information.jobs",
            href: "timescaledb_information-jobs"
          },
          {
            title: "timescaledb_information.job_stats",
            href: "timescaledb_information-job_stats"
          },
          {
            title: "timescaledb_information.license",
            href: "timescaledb_information-license"
          }
        ]
      },
      {
        title: "Administration Functions",
        type: 'directory',
        href: "administration-functions",
        children: [
          {
            title: "timescaledb_pre_restore",
            href: "timescaledb_pre_restore"
          },
          {
            title: "timescaledb_post_restore",
            href: "timescaledb_post_restore"
          },
          {
            title: "get_telemetry_report",
            href: "get_telemetry_report"
          },
          {
            title: "dump_meta_data",
            href: "dump_meta_data"
          }
        ]
      }
],
  }
]
