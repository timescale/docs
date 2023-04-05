---
title: Configuring Hypershift
excerpt: Migrate an existing PostgreSQL database to Timescale Cloud in a single step
products: [cloud]
keywords: [data migration, Hypershift]
tags: [ingest, Hypershift, postgresql]
---

# Hypershift configuration file

Hypershift uses a YAML configuration file to determine how to set up your new
Timescale database. You can create your own file, or use the example file as a
starting point. To complete your file, you need these details for the tables
that you want to convert to hypertables:

*   The schema that contains the table
*   The name of the table
*   The name of the `time` column of that table
*   The chunk time interval to use
*   The compression policy you want to use

If you are not sure what chunk time interval to use, see the
[time partitioning section][chunk-time].

Use this format:

```yml
source: '<SOURCE_DB_URI>'
target: '<TARGET_DU_URI>'
actions: ['clone', 'verify']
include_tables: []
exclude_tables: []
include_schemas: []
exclude_schemas: []

hypertable_configs:
  name: <table_name>
  schema: <schema_name>
  time_column_name: <time_column_name>
  chunk_time_interval: 7d
  compress:
    after: <in units of time>
    segmentby:
<column list>
    orderby:
<column list>
```

## Source database

FIXME

## Target database

FIXME

## Actions

FIXME

## Include and exclude tables

The `include_tables` configuration can be used to provide an array of tables
which should be included in the migration. Only these tables are copied.

For example:

```yaml
include_tables:
- '"MixedCaseSchema"."MixedCaseTable"'
- public.my_table
- public.a_small_table
- other_schema.table
```

<highlight type="note">
It is possible for a table to depend on other object (for example the schema
that the table is in, or a custom type). The `include_tables` configuration
will _only_ copy the specified table, not any dependent objects. If dependent
objects are not present in the target database, the migration will fail.

You must ensure that all objects which an included table relies on are already
present in the target database in order for the `include_tables` to work.
</highlight>

This does not work in combination with [exclude_tables](#exclude-tables),
[include_schemas](#include-schemas), or [exclude_schemas](#exclude-schemas)

The `exclude_tables` configuration can be used to provide an array of tables
which should not be included in the migration. Only these tables are not
copied.

For example:

```yaml
exclude_tables:
- '"MixedCaseSchema"."MixedCaseTable"'
- public.my_table
- public.a_small_table
- other_schema.table
```

<highlight type="note">
It is possible for objects to depend on a table, for example a view which uses
a table. Hypershift will not warn about an object depending on an excluded
table, and the migration will fail.

You must ensure that all objects which depend on a table are also excluded.
</highlight>

This does not work in combination with [include_tables](#include-tables)

## Include and exclude schemas

The `include_schemas` configuration can be used to provide an array of schemas
which should be included in the migration. Only objects in these schemas are
copied.

For example:

```yaml
include_schemas:
- public
- test
- '"FooBar"'
```

<highlight type="note">
It is possible for objects in one schema to depend on objects in another schema
for example, a table in the `public` schema depending on a type in the `other`
schema. Hypershift will not warn about missing dependencies on objects in
schemas which are not included, instead the migration will fail.

To avoid this, ensure that you do not exclude schemas containing objects on
which objects in other schemas depend.
</highlight>

This does not work in combination with [exclude_schemas](#exclude-schemas).

The `exclude_schemas` configuration can be used to provide an array of schemas
which should not be included in the migration. Only objects which are not in
these schemas are copied.

For example:

```yaml
exclude_schemas:
- public
- test
- '"FooBar"'
```

<highlight type="note">
It is possible for objects in one schema to depend on objects in another schema
for example, a table in the `public` schema depending on a type in the `other`
schema. Hypershift will not warn about missing dependencies on objects in
excluded schemas, instead the migration will fail.

To avoid this, ensure that you do not exclude schemas containing objects on
which objects in other schemas depend.
</highlight>

This does not work in combination with [include_schemas](#include-schemas)

### Filtering tables and schemas

Hypershift offers filtering at the schema and table level. Filtering is
enabled through the `include_schemas`, `exclude_schemas`, `include_tables`, and
`exclude_tables` parameters in the hypershift configuration file. Some of these
options are mutually exclusive.

This is an example of a hypershift configuration file with schema and table
exclusions:

```yaml
source: postgres://postgres:password@source:5432/database
target: postgres://postgres:password@target:5432/database
exclude_schemas:
- public
exclude_tables:
- test.an_uninteresting_table
```

#### Pattern matching

Hypershift does not support pattern matching on schema or table names in either
inclusion or exclusion rules. Support may be provided for this in a future
release.

## Hypertable configuration

FIXME

## Compression configuration

FIXME

<Collapsible heading="Example configuration file" headingLevel={2} defaultExpanded={false}>

This section contains a complete example hypershift configuration file for you
to use as a starting point for creating your own.

```yml
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

</Collapsible>

[chunk-time]: /use-timescale/:currentVersion:/hypertables/about-hypertables#best-practices-for-time-partitioning
