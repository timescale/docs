---
title: Configuring Hypershift
excerpt: Migrate an existing PostgreSQL database to Timescale in a single step
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
verify: <boolean>
include_tables: []
exclude_tables: []
include_schemas: []
exclude_schemas: []
hypertable_configs:
- name: <table_name>
  schema: <schema_name>
  time_column_name: <time_column_name>
  chunk_time_interval: 7d
  compress:
    after: <in units of time>
    segmentby:
      - <column>
    orderby:
      - <column> <direction>
parallel_min_table_size: <integer>
foreign_keys_priority: <enum>
create_db: <boolean>
drop_incompatible_hypertable_constraints: <boolean>
```

## Source and target database details

This is the connection string to use for the databases. The source is the
database you are migrating from, and the target is the new database that you are
migrating to. Connection strings usually contain the hostname to access the
database, the name of the database, the port the database can be accessed on,
and username and password details to log in to the database. If you do not want
to provide this information in the configuration file, you can provide these
details on the command line instead. For more information, see the
[hypershift command line options][hypershift-cli].

Connection strings are in the format:

```bash
postgres://<USERNAME>:<PASSWORD>@<HOSTNAME>:<PORT>/<DB_NAME>
```

For example:

```bash
postgres://tsdbadmin:my_password@timescale-cloud.com:30001/my_database
```

## Verify

Set `verify` to `true` to check if the migration was successful. This does a
check over the data in the tables on the source and target database to ensure that
they contain the same values.

## Include and exclude tables

If you want to include or exclude tables from the migration, you can use the
`include_tables` and `exclude_tables` parameters.

Use `include_tables` to declare the tables that should be migrated. For example:

```yaml
include_tables:
- '"MixedCaseSchema"."MixedCaseTable"'
- public.my_table
- public.a_small_table
- other_schema.table
```

Use `exclude_tables` to declare tables that should not be migrated. For example:

```yaml
exclude_tables:
- '"MixedCaseSchema"."MixedCaseTable"'
- public.my_table
- public.a_small_table
- other_schema.table
```

If you declare the `include_tables` parameter, you cannot also declare the
`exclude_tables` parameter. Similarly, if you declare the `exclude_tables`
parameter, you cannot also declare the `include_tables` parameter.

### Dependent objects for tables

It is possible for a table to depend on other objects, for example the schema
that the table is in, or a custom type. The `include_tables` configuration only
copies the specified table, not any dependent objects. If dependent objects are
not present in the target database, the migration fails.

You must ensure that all objects which an included table relies on are already
in the target database in order for the `include_tables` to work.

It is also possible for objects to depend on a table, for example a view which uses
a table. Hypershift does not warn about an object depending on an excluded
table, and the migration fails.

You must ensure that all objects which depend on a table are also excluded.

## Include and exclude schemas

If you want to include or exclude schemas from the migration, you can use the
`include_schemas` and `exclude_schemas` parameters.

Use `include_schemas` to declare an array of schemas that should be migrated.
For example:

```yaml
include_schemas:
- public
- test
- '"OtherSchema"'
```

Use `exclude_schemas` to declare an array of schemas that should not be migrated.
For example:

```yaml
exclude_schemas:
- public
- test
- '"OtherSchema"'
```

If you declare the `include_schemas` parameter, you cannot also declare the
`exclude_schemas` parameter. Similarly, if you declare the `exclude_schemas`
parameter, you cannot also declare the `include_schemas` parameter.

### Dependent objects for schemas

It is possible for objects in one schema to depend on objects in another schema
for example, a table in the `public` schema depending on a type in the `other`
schema. Hypershift does not warn about missing dependencies on objects in
schemas which are not included, and the migration fails.

To avoid this, ensure that you do not exclude schemas containing objects on
which objects in other schemas depend.

### Filtering tables and schemas

You can use the include and exclude table and schema parameters to filter tables
and schemas. This example filters tables and schemas by excluding them:

```yaml
source: postgres://postgres:password@source:5432/database
target: postgres://postgres:password@target:5432/database
exclude_schemas:
- public
exclude_tables:
- test.an_uninteresting_table
```

<Highlight type="important">
Hypershift does not currently support pattern matching on schema or table names
in either inclusion or exclusion rules.
</Highlight>

## Hypertable configuration

In the hypertable configuration section, you can provide parameters that control
how the hypertable is created on the target database.

## Parallel minimum table size

Use the `parallel_min_table_size` parameter to control the size a hypertable, in
MiB, must be to use parallel copying. Hypershift uses parallel copying to speed
up migration of larger tables. Tables sized under the `parallel_min_table_size`
parameter are copied in a single transaction. Tables sized over the
`parallel_min_table_size` parameter use parallel copying.

This parameter defaults to 128&nbsp;MiB.

## Foreign key checking

Use the `foreign_keys_priority` parameter to control when hypershift should
check foreign keys. The options for this parameter are:

*   `immediate`: Check all foreign keys immediately when they are encountered.
*   `deferred`: Check all foreign keys in a batch after the migration is finished.
*   `unchecked`: Leave all foreign keys unchecked.
*   `disabled`: Disable foreign key checking entirely.

This parameter defaults to `unchecked`.

## Logging format

Use the `log_format` parameter to control which file format to save log files
in. The options for this parameter are:

*   `json`: Save logs in `json` format.
*   `text`: Save logs as plain text.

This parameter defaults to `text`.

## Create the target database

Use the `create_db` parameter to control whether or not hypershift creates a new
target database during the migration. The options for this parameter are:

*   `true`: Create a new target database during migration.
*   `false`: Do not create a new target database during migration.

This parameter defaults to `false`.

## Drop incompatible hypertable constraints

In some cases, tables can have constraints on them that can't be retained when
they are converted to a hypertable. For example, if a table has a foreign key
that points to a hypertable, the foreign key can't be retained, and an error is
shown. When this occurs, the migrations fails. You can use the
`drop_incompatible_hypertable_constraints` parameter to silently drop any
incompatible constraints, and continue with the migration anyway.

The options for this parameter are:

*   `true`: Drop incompatible hypertable constraints and continue with the migration.
*   `false`: Keep incompatible hypertable constrains and stop the migration.

This parameter defaults to `false`.

<Collapsible heading="Example configuration file" headingLevel={2} defaultExpanded={false}>

This section contains a complete example hypershift configuration file for you
to use as a starting point for creating your own.

```yml
# Required.
# Source database details. Can be provided as a database URI or as "host=example.com dbname=mydb".
source: <string>

# Required.
# Target database details. Can be provided as a database URI or as "host=example.com dbname=mydb".
target: <string>

# Number of workers to fetch data parallely from the target database.
parallel: <u16> # Default = 8

# Verify migrated data.
verify: <boolean> # Default = false

# Only copy the specified table. No other objects are copied.
# * Tables must be specified schema-qualified (e.g. `include_tables: [ public.my_table ]`).
# * Tables with mixed-case names must be quoted, e.g. `include_tables: [ '"MixedCase"."TABLE_name"' ]`.
#
# Mutually exclusive with `exclude_schemas`, `exclude_tables`, and `include_schemas`.
#
# Note: As in `pg_dump`, this flag will cause only the table to be copied, and not any
# dependent objects (e.g. schemas, types, required foreign-key relations, etc.). You must
# ensure that all dependent objects are present in the target database before copying the
# table with this filter.
include_tables: [<string>] # Default = []

# Exclude the specified table from the copy.
# * Tables must be specified schema-qualified, e.g. `exclude_tables: [ public.my_table ]`.
# * Tables with mixed-case names must be quoted, e.g. `exclude_tables: [ '"MixedCase"."TABLE_name"' ]`.
#
# Mutually exclusive with `include_tables`.
exclude_tables: [<string>] # Default = []

# Only copy objects from the specified schemas. This flag behaves same
# as the `--schema` argument of 'pg_dump', but without pattern matching.
# Mutually exclusive with `exclude_schemas`.
include_schemas: [<string>] # Default = []

# Exclude specified schemas from clone operation. This flag behaves same
# as the `--exclude_schemas` argument of 'pg_dump', but without pattern matching.
# Mutually exclusive with `include_schemas`.
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
#   chunk_time_interval: <microseconds> or <interval>   # Optional. Default "7d"
#   compress:                                           # Compression settings (optional)
#       after: <microseconds> or <interval>
#       orderby:
#        - <column_name> <direction>    # Column name, sort direction ('asc' or 'desc').
#       segmentby: [<string>]           # List of column names.
#
# Example:
# hypertable_configs:
#  - name: metric
#    schema: public
#    time_column_name: time
#    chunk_time_interval: 4w
#    compress:
#      after: 1w
#      orderby:
#       - time desc
#      segmentby:
#       - series_id
# ----------------------------------------------------------------------------
hypertable_configs: [<hypertable_configuration>] # Default = []

# Minimum size of the table (in MiB) for which parallel copying of data should be done.
parallel_min_table_size: <u16> # Default = 128

# When Foreign Keys should be checked.
foreign_keys_priority: <VALID: immediate, deferred, unchecked, disabled> # Default = unchecked

# Create the target database.
create_db: <boolean> # Default = false

# Drop constraints that prevent hypertables from being created.
#
# Some constraints like foreign keys that point to a hypertable cannot be
# retained when migrating and will throw an error.
#
# Use this option to not create those constraints instead.
drop_incompatible_hypertable_constraints: <boolean> # Default = false

# Ignore the fact that hypertables may be missing a time index.
ignore_missing_time_index: <boolean> # Default = false

# Hide migration progress bar.
hide_progress: <boolean> # Default = false

# Display verbose logs with progress bar.
verbose: <boolean> # Default = false
```

</Collapsible>

[chunk-time]: /use-timescale/:currentVersion:/hypertables/about-hypertables#best-practices-for-time-partitioning
[hypershift-cli]: /use-timescale/:currentVersion:/migration/about-hypershift#the-hypershift-command-line-tool
