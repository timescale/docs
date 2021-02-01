

module.exports = [
  {
    Title: "Api Reference",
    type: 'page',
    filePath: 'index.md',
    href: "api-reference",
    name: 'Api Reference',
    excerpt: 'blah blha blha',
    children: [
      {
        Title: "Hypertables & Chunks",
        type: 'directory',
        href: "hypertables-and-chunks",
        children: [
          {
            Title: "create_hypertable",
            type: 'page',
            href: "create_hypertable"
          },
          {
            Title: "show_chunks",
            type: 'page',
            href: "show_chunks"
          },
          {
            Title: "drop_chunks",
            type: 'page',
            href: "drop_chunks"
          },
          {
            Title: "reorder_chunk",
            type: 'page',
            href: "reorder_chunk"
          },
          {
            Title: "add_reorder_policy",
            type: 'page',
            href: "add_reorder_policy"
          },           
          {
            Title: "remove_reorder_policy",
            type: 'page',
            href: "remove_reorder_policy"
          },
          {
            Title: "attach_tablespace",
            type: 'page',
            href: "attach_tablespace"
          },          
          {
            Title: "detach_tablespace",
            type: 'page',
            href: "detach_tablespace"
          },
          {
            Title: "detach_tablespaces",
            type: 'page',
            href: "detach_tablespaces"
          },
          {
            Title: "show_tablespaces",
            type: 'page',
            href: "show_tablespaces"
          },                                                               
          {
            Title: "set_chunk_time_interval",
            type: 'page',
            href: "set_chunk_time_interval"
          },
          {
            Title: "set_number_partitions",
            type: 'page',
            href: "set_number_partitions"
          },
          {
            Title: "set_replication_factor",
            type: 'page',
            href: "set_replication_factor"
          },  
          {
            Title: "set_integer_now_func",
            type: 'page',
            href: "set_integer_now_func"
          },
          {
            Title: "add_dimension",
            type: 'page',
            href: "add_dimension"
          },                         
          {
            Title: "create_index (transaction per chunk)",
            type: 'page',
            href: "create_index"
          }
        ]
      },
      {
        Title: "Distributed Hypertables",
        type: 'directory',
        href: "distributed-hypertables",
        children: [
          {
            Title: "create_distributed_hypertable",
            type: 'page',
            href: "create_distributed_hypertable"
          },
          {
            Title: "add_data_node",
            type: 'page',
            href: "add_data_node"
          },
          {
            Title: "attach_data_node",
            type: 'page',
            href: "attach_data_node"
          },          
          {
            Title: "detach_data_node",
            type: 'page',
            href: "detach_data_node"
          },          
          {
            Title: "delete_data_node",
            type: 'page',
            href: "delete_data_node"
          },
          {
            Title: "distributed_exec",
            type: 'page',
            href: "distributed_exec"
          },
          {
            Title: "reorder_chunk",
            type: 'page',
            href: "reorder_chunk"
          },
          {
            Title: "add_reorder_policy",
            type: 'page',
            href: "add_reorder_policy"
          },
          {
            Title: "remove_reorder_policy",
            type: 'page',
            href: "remove_reorder_policy"
          },                                                   
          {
            Title: "set_chunk_time_interval",
            type: 'page',
            href: "set_chunk_time_interval"
          },
          {
            Title: "set_number_partitions",
            type: 'page',
            href: "set_number_partitions"
          },
          {
            Title: "set_replication_factor",
            type: 'page',
            href: "set_replication_factor"
          },  
          {
            Title: "set_integer_now_func",
            type: 'page',
            href: "set_integer_now_func"
          },                         
          {
            Title: "create_index",
            type: 'page',
            href: "create_index"
          }
        ]
      },      
      {
        Title: "Compression",
        type: 'directory',
        href: "compression",
        children: [
          {
            Title: "ALTER TABLE (Compression)",
            type: 'page',
            href: "alter_table_compression"
          },
          {
            Title: "add_compression_policy",
            type: 'page',
            href: "add_compression_policy"
          },
          {
            Title: "remove_compression_policy",
            type: 'page',
            href: "remove_compression_policy"
          },
          {
            Title: "compress_chunk",
            type: 'page',
            href: "compress_chunk"
          },
          {
            Title: "decompress_chunk",
            type: 'page',
            href: "decompress_chunk"
          },
          {
            Title: "hypertable_size",
            type: 'page',
            href: "hypertable_size"
          },          
          {
            Title: "hypertable_detailed_size",
            type: 'page',
            href: "hypertable_detailed_size"
          },          
          {
            Title: "hypertable_index_size",
            type: 'page',
            href: "hypertable_index_size"
          },          
          {
            Title: "hypertable_compression_stats",
            type: 'page',
            href: "hypertable_compression_stats"
          },          
        ]
      },
      {
        Title: "Continuous Aggregates",
        type: 'directory',
        href: "continuous-aggregates",
        children: [
          {
            Title: "CREATE MATERIALIZED VIEW (Continuous Aggregate)",
            type: 'page',
            href: "create_materialized_view"
          },
          {
            Title: "ALTER MATERIALIZED VIEW (Continuous Aggregate)",
            type: 'page',
            href: "alter_materialized_view"
          },
          {
            Title: "DROP MATERIALIZED VIEW (Continuous Aggregate)",
            type: 'page',
            href: "drop_materialized_view"
          }, 
          {
            Title: "add_continuous_aggregate_policy",
            type: 'page',
            href: "add_continuous_aggregate_policy"
          },     
          {
            Title: "refresh_continuous_aggregate",
            type: 'page',
            href: "refresh_continuous_aggregate"
          },
          {
            Title: "remove_continuous_aggregate_policy",
            type: 'page',
            href: "remove_continuous_aggregate_policy"
          }          
        ]
      },
      {
        Title: "Data Retention",
        type: 'directory',
        href: "data-retention",
        children: [
          {
            Title: "add_retention_policy",
            type: 'page',
            href: "add_retention_policy"
          },
          {
            Title: "remove_retention_policy",
            type: 'page',
            href: "remove_retention_policy"
          }          
        ]
      },
      {
        Title: "Actions and Automation",
        type: 'directory',
        href: "actions-and-automation",
        children: [
          {
            Title: "add_job",
            type: 'page',
            href: "add_job"
          },
          {
            Title: "alter_job",
            type: 'page',
            href: "alter_job"
          },
          {
            Title: "delete_job",
            type: 'page',
            href: "delete_job"
          },
          {
            Title: "run_job",
            type: 'page',
            href: "run_job"
          }                      
        ]
      },
      {
        Title: "Analytics",
        type: 'directory',
        href: "analytics",
        children: [
          {
            Title: "approximate_row_count",
            type: 'page',
            href: "approximate_row_count"
          },
          {
            Title: "first",
            type: 'page',
            href: "first"
          },
          {
            Title: "last",
            type: 'page',
            href: "last"
          },
          {
            Title: "histogram",
            type: 'page',
            href: "histogram"
          },
          {
            Title: "locf",
            type: 'page',
            href: "locf"
          },                     
          {
            Title: "interpolate",
            type: 'page',
            href: "interpolate"
          },
          {
            Title: "time_bucket",
            type: 'page',
            href: "time_bucket"
          },
          {
            Title: "time_bucket_gapfill",
            type: 'page',
            href: "time_bucket_gapfill"
          }                              
        ]
      },
      {
        Title: "Informational Views",
        type: 'directory',
        href: "informational-views",
        children: [
          {
            Title: "timescaledb_information-chunks",
            type: 'page',
            href: "timescaledb_information-chunks"
          },
          {
            Title: "timescaledb_information-continuous_aggregates",
            type: 'page',
            href: "timescaledb_information-continuous_aggregates"
          },
          {
            Title: "timescaledb_information-compression_settings",
            type: 'page',
            href: "timescaledb_information-compression_settings"
          },
          {
            Title: "timescaledb_information-data_nodes",
            type: 'page',
            href: "timescaledb_information-data_nodes"
          },
          {
            Title: "timescaledb_information-dimensions",
            type: 'page',
            href: "timescaledb_information-dimensions"
          },
          {
            Title: "timescaledb_information-hypertables",
            type: 'page',
            href: "timescaledb_information-hypertables"
          },
          {
            Title: "timescaledb_information-jobs",
            type: 'page',
            href: "timescaledb_information-jobs"
          },
          {
            Title: "timescaledb_information-job_stats",
            type: 'page',
            href: "timescaledb_information-job_stats"
          },
          {
            Title: "timescaledb_information-license",
            type: 'page',
            href: "timescaledb_information-license"
          }
        ]
      },
      {
        Title: "Administration Functions",
        type: 'directory',
        href: "administration-functions",
        children: [
          {
            Title: "timescaledb_pre_restore",
            type: 'page',
            href: "timescaledb_pre_restore"
          },
          {
            Title: "timescaledb_post_restore",
            type: 'page',
            href: "timescaledb_post_restore"
          },
          {
            Title: "get_telemetry_report",
            type: 'page',
            href: "get_telemetry_report"
          },           
          {
            Title: "dump_meta_data",
            type: 'page',
            href: "dump_meta_data"
          }          
        ]
      }             
],
  }
]
