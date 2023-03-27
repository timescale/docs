---
title: Hypershift Configuration
excerpt: Configure Hypershift to migrate a PostgreSQL database to Timescale Cloud
product: cloud
keywords: [data migration, Hypershift, configuration]
tags: [ingest, Hypershift, postgresql]
---

# Configuring Hypershift

## Flags

Hypershift supports the following CLI flags

```shell
./hypershift --help
hypershift

hypershift clones a PostgreSQL data source into a TimescaleDB database.
It uses parallel workers to speed up the process, and requires almost
no local storage, except some temporary files.

It requires a pg_dump binary to be in the path that is compatible with the
source database.


Usage:

Options:
  -C, --config-file <CONFIG_FILE>
          Path for Hypershift configuration file. Please refer <TODO: weblink>
          for more details regarding configuring Hypershift.

          [env: HYPERSHIFT_CONFIG_FILE=]
          [default: ]

  -S, --source-uri <SOURCE>
          URI for source database

          [env: HYPERSHIFT_SOURCE_URI=]
          [default: ]

  -T, --target-uri <TARGET>
          URI for target database

          [env: HYPERSHIFT_TARGET_URI=]
          [default: ]

      --ignore-missing-time-index
          Ignore the fact that hypertables may be missing a time index

          [env: HYPERSHIFT_IGNORE_MISSING_TIME_INDEX=]

  -h, --help
          Print help (see a summary with '-h')

  -V, --version
          Print version


Example:

Migrate by using source database and target database CLI flags only, along with default configuration settings:
./hypershift -S='host=localhost dbname=postgres port=5432 user=postgres password=source_password' -T='host=localhost dbname=postgres port=5433 user=postgres password=target_password'

Migrate by configuring Hypershift using a configuration file:
./hypershift -C=config.yaml

Migrate with source database and target database as CLI flags and configuring Hypershift using a configuration file:
./hypershift -C=config.yaml -S='host=localhost dbname=postgres port=5432 user=postgres password=source_password' -T='host=localhost dbname=postgres port=5433 user=postgres password=target_password'
```

You can provide source and target database URI either in the CLI flags or in the configuration file. In case of both, CLI flags would take the precedence.

## Configuration file

This section gives you information about the configuration parameters supported by Hypershift.

```yaml
# Required.
# Source database details. Can be provided as a database URI
# or as "host=example.com dbname=mydb".
source: <string>

# Required.
# Target database details. Can be provided as a database URI
# or as "host=example.com dbname=mydb".
target: <string>

# Actions instructs Hypershift to perform operations against the
# source or target database.
# Available actions: clone, verify
actions: [<string>] # Default = ['clone']

# Clone specified sections only. These sections correspond to those in pg_dump.
sections: [<string>] # Default = ['roles', 'pre-data', 'data', 'post-data']

# Number of workers to fetch data parallely from the target database.
parallel: <u16> # Default = 8

# Copy the specified tables only. No other objects are copied during the migration.
# * Tables must be specified schema-qualified (e.g. `include_tables: [ public.my_table ]`).
# * Tables with mixed-case names must be quoted, e.g. `include_tables: [ '"MixedCase"."TABLE_name"' ]`.
#
# This field is mutually exclusive with `exclude_schemas`, `exclude_tables`, and `include_schemas`.
#
# Note: Similar to pg_dump's `--table`, this will copy the specified tables only, and not any
# dependent objects (e.g. schemas, types, required foreign-key relations, etc.). You must
# ensure that all dependent objects are present in the target database before copying the
# table with this filter.
include_tables: [<string>] # Default = []

# Exclude the specified table from being copied.
# * Tables must be specified schema-qualified, e.g. `exclude_tables: [ public.my_table ]`.
# * Tables with mixed-case names must be quoted, e.g. `exclude_tables: [ '"MixedCase"."TABLE_name"' ]`.
#
# This field is mutually exclusive with `include_tables`.
exclude_tables: [<string>] # Default = []

# Copy objects from the specified schemas only. This field behaves same
# as the `--schema` argument of pg_dump, but without pattern matching.
# This field is mutually exclusive with `exclude_schemas`.
include_schemas: [<string>] # Default = []

# Exclude specified schemas from clone operation. This field behaves same
# as the `--exclude_schemas` argument of pg_dump, but without pattern matching.
# This field is mutually exclusive with `include_schemas`.
exclude_schemas: [<string>] # Default = []

# If applied, Hypershift will convert the given list of tables to
# TimescaleDB hypertables while migration.
# 'hypertable_configs' also allows compressing data while migration
# if the 'compress' field is applied.
#
# -------------------------<hypertable_configuration>-------------------------
# - schema: <string>                                    # Required.
#   name: <string>                                      # Required.
#   time_column_name: <string>                          # Required.
#   chunk_time_interval: <microseconds> or <interval>
#   compress:                                           # Compress hypertable if applied.
#       after: <microseconds> or <interval>
#       orderby:
#           name: <string>      # Column name.
#           direction: <string> # Sorting direction. Expected 'asc' or 'desc'.
#       segmentby: [<string>]   # List of column names.
#
# Example:
# hypertable_configs:
# - name: metric
#   schema: public
#   time_column_name: time
#   chunk_time_interval: 4w
# ----------------------------------------------------------------------------
hypertable_configs: [<hypertable_configuration>] # Default = []

# Minimum size of the table (in MiB) for which parallel
# copying of data should be done.
parallel_min_table_size: <u16> # Default = 128

# Specify when should foreign keys be checked.
foreign_keys_priority: <VALID: immediate, deferred, unchecked, disabled> # Default = unchecked

# Specify the logging format to be used.
log_format: <VALID: json, text> # Default = text

# Create the target database.
create_db: <boolean> # Default = false

# Drop constraints that prevent hypertables from being created.
#
# Some constraints like foreign keys pointing to a Hypertable cannot be
# retained when migrating and will throw an error.
#
# Use this option to not create those constraints instead.
drop_incompatible_hypertable_constraints: <boolean> # Default = false

# Hide migration progress bar.
hide_progress: <boolean> # Default = false

# Display verbose logs with progress bar.
verbose: <boolean> # Default = false

# Do not collect anonymous telemetry during migration. By default,
# Hypershift collects anonymous statistics that are important for
# its improvement.
no_telemetry: <boolean> # Default = false
```
