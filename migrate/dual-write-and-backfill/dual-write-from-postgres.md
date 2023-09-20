---
title: Migrate from PostgreSQL using dual-write and backfill
excerpt: Migrate from a PostgreSQL database using the low-downtime dual-write and backfill method
products: [cloud]
keywords: [migration, low-downtime]
tags: [migration, logical backup]
---

import StepOne from "versionContent/_partials/_migrate_dual_write_step1.mdx";
import StepTwo from "versionContent/_partials/_migrate_dual_write_step2.mdx";
import StepFour from "versionContent/_partials/_migrate_dual_write_step4.mdx";
import StepFive from "versionContent/_partials/_migrate_dual_write_step5.mdx";
import SetupSourceTarget from "versionContent/_partials/_migrate_set_up_source_and_target.mdx";
import ValidateProductionLoad from "versionContent/_partials/_migrate_dual_write_validate_production_load.mdx";
import SwitchProductionWorkload from "versionContent/_partials/_migrate_dual_write_switch_production_workload.mdx";
import SourceTargetNote from "versionContent/_partials/_migrate_source_target_note.mdx";

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

```
pg_dumpall -d "$SOURCE" \
  --quote-all-identifiers \
  --roles-only \
  --file=roles.sql
```

Timescale services do not support roles with superuser access. If your SQL
dump includes roles that have such permissions, you'll need to modify the file
to be compliant with the security model.

You can use the following `sed` command to remove unsupported statements and
permissions from your roles.sql file:

```
sed -i -E \
-e '/CREATE ROLE "postgres";/d' \
-e '/ALTER ROLE "postgres"/d' \
-e 's/(NO)*SUPERUSER//g' \
-e 's/(NO)*REPLICATION//g' \
-e 's/(NO)*BYPASSRLS//g' \
-e 's/GRANTED BY "[^"]*"//g' \
roles.sql
```

<Highlight type="note">
This command works only with the GNU implementation of sed (sometimes referred
to as gsed). For the BSD implementation (the default on macOS), you need to
add an extra argument to change the `-i` flag to `-i ''`.

To check the sed version, you can use the command `sed --version`. While the
GNU version will explicitly identify itself as GNU, the BSD version of sed
generally doesn't provide a straightforward --version flag and will simply
output an "illegal option" error.
</Highlight>

A brief explanation of this script is:

- `CREATE ROLE "postgres"`; and `ALTER ROLE "postgres"`: These statements are
  removed because they require superuser access, which is not supported
  by Timescale.

- `(NO)SUPERUSER` | `(NO)REPLICATION` | `(NO)BYPASSRLS`: These are permissions
  that require superuser access.

- `GRANTED BY role_specification`: The GRANTED BY clause can also have permissions that
  require superuser access and should therefore be removed. Note: Per the
  TimescaleDB documentation, the GRANTOR in the GRANTED BY clause must be the
  current user, and this clause mainly serves the purpose of SQL compatibility.
  Therefore, it's safe to remove it.

### 3b. Determine which tables to convert to hypertables

[//]: # (TODO: we should add a reference to timescale doctor here when it is ready)

Ideal candidates for hypertables are large tables containing
[time-series data][time-series-data].
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

- `--no-tablespaces` is required because Timescale does not support
  tablespaces other than the default. This is a known limitation.

- `--no-owner` is required because Timescale's `tsdbadmin` user is not a
  superuser and cannot assign ownership in all cases. This flag means that
  everything will be owned by the user used to connect to the target,
  regardless of ownership in the source. This is a known limitation.

- `--no-privileges` is required because Timescale's `tsdbadmin` user is not a
  superuser and cannot assign privileges in all cases. This flag means that
  privileges assigned to other users will need to be reassigned in the target
  database as a manual clean-up task. This is a known limitation.

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
`create_hypertable`, consult the [create_table API reference][create-api]. For
more information about hypertables in general, consult the
[hypertable documentation][hypertable-docs].

You may also wish to consider taking advantage of some of Timescale's killer
features, such as:
- [retention policies][retention-policies] to automatically drop unneeded data
- [data tiering][data-tiering] to automatically move data to cheap storage
- [compression][compression] to reduce the size of your hypertables
- [continuous aggregates][caggs] to write blazingly-fast aggregate queries on your data

[time-series-data]: /getting-started/:currentVersion:/time-series-data/
[create-api]: /api/:currentVersion:/hypertable/create_hypertable/
[hypertable-docs]: /use-timescale/:currentVersion:/hypertables/
[retention-policies]: /use-timescale/:currentVersion:/data-retention/
[data-tiering]: /use-timescale/:currentVersion:/data-tiering/
[compression]: /use-timescale/:currentVersion:/compression/about-compression/
[caggs]: /use-timescale/:currentVersion:/continuous-aggregates

<StepFour />

<StepFive />

## 6. Backfill data from source to target

We recommend dumping the data from your source database on a per-table basis
into CSV format, and restoring those CSVs into the target database using the
`timescaledb-parallel-copy` tool.

To dump rows from the source table in CSV format, you can use `psql`'s `\copy`
command. Note that all rows in the CSV data which you load into the target
hypertable must be before the completion point. This filter can be applied when
dumping the data from the source database:

```bash
psql -d $SOURCE \
  -c "\copy (
    SELECT * FROM <table name>
    WHERE <time_column> < <completion point time
  )
  TO
  '<table name>.csv' WITH (FORMAT CSV)"
```

Before you load the CSV data into the target hypertable, you must remove all
rows which were inserted by dual writes, and which are before the completion
point:

```bash
psql -d $TARGET \
  -c "DELETE FROM <target_hypertable>
      WHERE <time_column> < <completion point time>";
```

You can load a CSV file into a hypertable using `timescaledb-parallel-copy` as
follows, note to set the number of workers equal to the number of cores in your
target database:

```
timescaledb-parallel-copy \
  --connection $TARGET \
  --table <target_hypertable> \
  --workers 8 \
  --file <table name>.csv
```

## 7. Validate that all data is present in target database

Now that all data has been backfilled, and the application is writing data to
both databases, the contents of both databases should be the same. How exactly
this should best be validated is dependent on your application.

If you are reading from both databases in parallel for every production query,
you could  consider adding an application-level validation that both databases
are returning the same data.

Another option is to compare the number of rows in the source and target
tables, although this will read all data in the table which may have an impact
on your production workload.

Another option is to run `ANALYZE` on both the source and target tables and
then look at the `reltuples` column of the `pg_class` table. This is not exact,
but doesn't require reading all rows from the table. Note: for hypertables, the
reltuples value belongs to the chunk table, so you must take the sum of
`reltuples` for all chunks belonging to the hypertable.

## 8. Validate that target database can handle production load

Now that dual-writes have been in place for a while, the target database should
be holding up to production write traffic. Now would be the right time to
determine if the target database can serve all production traffic (both reads
_and_ writes). How exactly this is done is application-specific and up to you
to determine.

## 9. Switch production workload to target database

<SwitchProductionWorkload />

[create-service]: /use-timescale/:currentVersion:/services/create-a-service/
[dual-write-and-backfill]: /migrate/:currentVersion:/dual-write-and-backfill/