---
title: Migrate from PostgreSQL using dual-write and backfill
excerpt: Migrate from a PostgreSQL database using the low-downtime dual-write and backfill method
products: [cloud]
keywords: [migration, low-downtime]
tags: [migration, logical backup]
---

import GettingHelp from "versionContent/_partials/_migrate_dual_write_backfill_getting_help.mdx";
import StepOne from "versionContent/_partials/_migrate_dual_write_step1.mdx";
import StepTwo from "versionContent/_partials/_migrate_dual_write_step2.mdx";
import StepFour from "versionContent/_partials/_migrate_dual_write_step4.mdx";
import StepFive from "versionContent/_partials/_migrate_dual_write_step5.mdx";
import SetupSourceTarget from "versionContent/_partials/_migrate_set_up_source_and_target.mdx";
import ValidateProductionLoad from "versionContent/_partials/_migrate_dual_write_validate_production_load.mdx";
import SwitchProductionWorkload from "versionContent/_partials/_migrate_dual_write_switch_production_workload.mdx";
import SourceTargetNote from "versionContent/_partials/_migrate_source_target_note.mdx";
import DumpDatabaseRoles from "versionContent/_partials/_migrate_dual_write_dump_database_roles.mdx";
import Step6eTurnOnCompressionPolicies from "versionContent/_partials/_migrate_dual_write_6e_turn_on_compression_policies.mdx";
import Step6aThroughc from "versionContent/_partials/_migrate_dual_write_6a_through_c.mdx";

# Dual-write and backfill from PostgreSQL database

This document provides detailed step-by-step instructions to migrate data using
the [dual-write and backfill][dual-write-and-backfill] migration method from a
source database which is using PostgreSQL to Timescale.

<SourceTargetNote />

In detail, the migration process consists of the following steps:
1. Set up a target database instance in Timescale.
1. Modify the application to write to the target database.
1. Migrate schema and relational data from source to target.
1. Start the application in dual-write mode.
1. Determine the completion point `T`.
1. Backfill time-series data from source to target.
1. Validate that all data is present in target database.
1. Validate that target database can handle production load.
1. Switch application to treat target database as primary (potentially
   continuing to write into source database, as a backup).

<GettingHelp />

<StepOne />

<StepTwo />

## 3. Set up schema and migrate relational data to target database

You would probably like to convert some of your large tables which contain
time-series data into hypertables. This step consists of identifying those
tables, excluding their data from the database dump, copying the database
schema and tables, and setting up the time-series tables as hypertables. The
data is backfilled into these hypertables in a subsequent step.

<SetupSourceTarget />

### 3a. Dump the database roles from the source database

<DumpDatabaseRoles />

### 3b. Determine which tables to convert to hypertables

[//]: # (TODO: add a reference to timescale doctor here when it is ready)

Ideal candidates for hypertables are large tables containing
[time-series data].
This is usually data with some form of timestamp value (`TIMESTAMPTZ`,
`TIMESTAMP`, `BIGINT`, `INT` etc.) as the primary dimension, and some other
measurement values.

### 3c. Dump all tables from the source database, excluding data from hypertable candidates

```
pg_dump -d "$SOURCE" \
  --format=plain \
  --quote-all-identifiers \
  --no-tablespaces \
  --no-owner \
  --no-privileges \
  --exclude-table-data=<table name or pattern> \
  --file=dump.sql
```

- `--exclude-table-data` is used to exclude all data from hypertable
  candidates. You can either specify a table pattern, or specify
  `--exclude-table-data` multiple times, once for each table to be converted.

<ExplainPgDumpFlags />

### 3d. Load the roles and schema into the target database

```
psql -X -d "$TARGET" \
  -v ON_ERROR_STOP=1 \
  --echo-errors \
  -f roles.sql \
  -f dump.sql
```

### 3e. Convert the plain tables to hypertables, optionally enabling compression

For each table which should be converted to a hypertable in the target
database, execute:
```
SELECT create_hypertable('<table name>', '<time column name>');
```

For more information about the options which you can pass to
`create_hypertable`, consult the [create_table API reference]. For
more information about hypertables in general, consult the
[hypertable documentation].

You may also wish to consider taking advantage of some of Timescale's killer
features, such as:
- [retention policies] to automatically drop unneeded data
- [data tiering] to automatically move data to cheap storage
- [compression] to reduce the size of your hypertables
- [continuous aggregates] to write blisteringly fast aggregate queries on your data

[time-series data]: /getting-started/:currentVersion:/time-series-data/
[create_table API reference]: /api/:currentVersion:/hypertable/create_hypertable/
[hypertable documentation]: /use-timescale/:currentVersion:/hypertables/
[retention policies]: /use-timescale/:currentVersion:/data-retention/
[data tiering]: /use-timescale/:currentVersion:/data-tiering/
[compression]: /use-timescale/:currentVersion:/compression/about-compression/
[continuous aggregates]: /use-timescale/:currentVersion:/continuous-aggregates

<StepFour />

<StepFive />

## 6. Backfill data from source to target

<Step6aThroughc />

### 6d. Copy the data with a streaming copy

Execute the following command, replacing `<source table>` and `<hypertable>`
with the fully qualified names of the source table and target hypertable
respectively:

```bash
psql $SOURCE -f - <<EOF
  \copy ( \
      SELECT * FROM <source table> WHERE time >= <start> AND time < <end> \
    ) TO stdout WITH (format CSV);" | timescaledb-parallel-copy \
  --connection $TARGET \
  --table <hypertable> \
  --log-batches \
  --batch-size=1000 \
  --workers=4
EOF
```

The above command is not transactional. If there is a connection issue, or some
other issue which causes it to stop copying, the partially copied rows must be
removed from the target (using the instructions in step 6b above), and then the
copy can be restarted.

<Step6eTurnOnCompressionPolicies />

## 7. Validate that all data is present in target database

Now that all data has been backfilled, and the application is writing data to
both databases, the contents of both databases should be the same. How exactly
this should best be validated is dependent on your application.

If you are reading from both databases in parallel for every production query,
you could consider adding an application-level validation that both databases
are returning the same data.

Another option is to compare the number of rows in the source and target
tables, although this reads all data in the table which may have an impact on
your production workload.

Another option is to run `ANALYZE` on both the source and target tables and
then look at the `reltuples` column of the `pg_class` table. This is not exact,
but doesn't require reading all rows from the table. Note: for hypertables, the
reltuples value belongs to the chunk table, so you must take the sum of
`reltuples` for all chunks belonging to the hypertable. If the chunk is
compressed in one database, but not the other, then this check cannot be used.

## 8. Validate that target database can handle production load

<ValidateProductionLoad />

## 9. Switch production workload to target database

<SwitchProductionWorkload />

[dual-write-and-backfill]: /migrate/:currentVersion:/dual-write-and-backfill/
