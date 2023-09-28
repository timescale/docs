---
title: Migrate from TimescaleDB using dual-write and backfill
excerpt: Migrate from a TimescaleDB database using the low-downtime dual-write and backfill method
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
import TimescaleDBVersion from "versionContent/_partials/_migrate_from_timescaledb_version.mdx";
import DumpDatabaseRoles from "versionContent/_partials/_migrate_dual_write_dump_database_roles.mdx";
import ExplainPgDumpFlags from "versionContent/_partials/_migrate_explain_pg_dump_flags.mdx";

# Dual-write and backfill from TimescaleDB database

This document provides detailed step-by-step instructions to migrate data using
the [dual-write and backfill][dual-write-and-backfill] migration method from a
source database which is using TimescaleDB to Timescale.

<SourceTargetNote />

In detail, the migration process consists of the following steps:
1. [Set up a target database instance in Timescale](#1-set-up-a-target-database-instance-in-timescale).
1. [Modify the application to write to the target database](#2-modify-the-application-to-write-to-the-target-database).
1. [Set up scheme and migrate relational data to target database](#3-set-up-schema-and-migrate-relational-data-to-target-database).
1. [Start the application in dual-write mode](#4-start-application-in-dual-write-mode).
1. [Determine the completion point `T`](#5-determine-the-completion-point-t).
1. [Backfill hypertable data from source to target](#6-backfill-hypertable-data-from-source-to-target).
1. [Enable background jobs in the target database](#7-enable-background-jobs-in-target-database).
1. [Validate that all data is present in target database](#8-validate-that-all-data-is-present-in-target-database).
1. [Validate that target database can handle production load](#9-validate-that-target-database-can-handle-production-load).
1. [Switch production workload to target database](#10-switch-production-workload-to-target-database).

<GettingHelp />

<StepOne />

<StepTwo />

## 3. Set up schema and migrate relational data to target database

This section leverages `pg_dumpall` and `pg_dump` to migrate the roles and
relational schema that you are using in the source database to the target
database.

<Highlight type="important">
The PostgresSQL versions of the source and target databases can be of different
versions, as long as the target version is greater than that of the source.

The version of TimescaleDB used in both databases must be exactly the same.
</Highlight>

<SetupSourceTarget />

### 3a. Dump the database roles from the source database

<DumpDatabaseRoles />

### 3b. Dump all plain tables and the TimescaleDB catalog from the source database

```bash
pg_dump -d "$SOURCE" \
  --format=plain \
  --quote-all-identifiers \
  --no-tablespaces \
  --no-owner \
  --no-privileges \
  --exclude-table-data='_timescaledb_internal.*' \
  --file=dump.sql
```

- `--exclude-table-data='_timescaledb_internal.*'` dumps the structure of the
  hypertable chunks, but not the data. This creates empty chunks on the target,
  ready for the backfill process.

<ExplainPgDumpFlags />

If the source database has the timescaledb extension installed in a schema
other than "public" it causes issues on Timescale. Edit the dump file to remove
any references to the non-public schema. The extension must be in the "public"
schema on Timescale. This is a known limitation.

### 3c. Ensure that the correct TimescaleDB version is installed

<TimescaleDBVersion />

### 3d. Load the roles and schema into the target database, and turn off all background jobs

```bash
psql -X -d "$TARGET" \
  -v ON_ERROR_STOP=1 \
  --echo-errors \
  -f roles.sql \
  -c 'select public.timescaledb_pre_restore();' \
  -f dump.sql \
  -f - <<'EOF'
begin;
select public.timescaledb_post_restore();

-- disable all background jobs
select public.alter_job(id::integer, scheduled=>false)
from _timescaledb_config.bgw_job
where id >= 1000
;
commit;
EOF
```

<Highlight type="note">
Background jobs are turned off to prevent continuous aggregate refresh jobs
from updating the continuous aggregate with incomplete/missing data.
The continuous aggregates must be manually updated in the required range once
the migration is complete.
</Highlight>

<StepFour />

<StepFive />

## 6. Backfill hypertable data from source to target

The simplest way to backfill from TimescaleDB, is to use the
[timescaledb-backfill][timescaledb-backfill] backfill tool. It efficiently
copies compressed and uncompressed hypertables, and data stored in continuous
aggregates from one database to another.

`timescaledb-backfill` performs best when executed from a machine located close
to the target database. The ideal scenario is an EC2 instance located in the
same region as the Timescale service. Use a Linux-based distribution on x86_64.

[//]: # (TODO: Recommended spec for the instance.)

With the instance that will run the timescaledb-backfill ready, log in and
download timescaledb-backfill:

```bash
wget https://assets.timescale.com/releases/timescaledb-backfill-x86_64-linux.tar.gz
tar xf timescaledb-backfill-x86_64-linux.tar.gz
sudo mv timescaledb-backfill /usr/local/bin/
```

Running timescaledb-backfill is a four-phase process:

1. Stage:
   This step prepares metadata about the data to be copied in the target
   database. On completion, it outputs the number of chunks to be copied.
   ```bash
   timescaledb-backfill stage --source $SOURCE --target $TARGET --until <completion point>
   ```
1. Copy:
   This step copies data on a chunk-by-chunk basis from the source to the
   target. If it fails or is interrupted, it can safely be resumed. You should
   be aware of the `--parallelism` parameter, which dictates how many
   connections are used to copy data. The default is 8, which, depending on the
   size of your source and target databases, may be too high or too low. You
   should closely observe the performance of your source database and tune this
   parameter accordingly.
   ```bash
   timescaledb-backfill copy --source $SOURCE --target $TARGET
   ```
1. Verify (optional):
   This step verifies that the data in the source and target is the same. It
   reads all the data on a chunk-by-chunk basis from both the source and target
   databases, so may also impact the performance of your source database.
   ```bash
   timescaledb-backfill verify --source $SOURCE --target $TARGET
   ```
1. Clean:
   This step removes the metadata which was created in the target database by
   the `stage` command.
   ```bash
   timescaledb-backfill clean --target $TARGET
   ```

## 7. Enable background jobs in target database

Before enabling the jobs, verify if any continuous aggregate refresh policies
exist.

```bash
psql -d $TARGET \
  -c "select count(*)
  from _timescaledb_config.bgw_job
  where proc_name = 'policy_refresh_continuous_aggregate'"
```

If they do exist, refresh the continuous aggregates before re-enabling the
jobs. The timescaledb-backfill tool provides a utility to do this:

```bash
timescaledb-backfill refresh-caggs --source $SOURCE --target $TARGET
```

Once the continuous aggregates are updated, you can re-enable all background
jobs:

```bash
psql -d $TARGET -f - <<EOF
  select public.alter_job(id::integer, scheduled=>true)
  from _timescaledb_config.bgw_job
  where id >= 1000;
EOF
```

<Highlight type="note">
If the backfill process took long enough for there to be significant
retention/compression work to be done, it may be preferable to run the jobs
manually to have control over the pacing of the work until it is caught up
before re-enabling.
</Highlight>

## 8. Validate that all data is present in target database

Now that all data has been backfilled, and the application is writing data to
both databases, the contents of both databases should be the same. How exactly
this should best be validated is dependent on your application.

If you are reading from both databases in parallel for every production query,
you could consider adding an application-level validation that both databases
are returning the same data.

Another option is to compare the number of rows in the source and target
tables, although this reads all data in the table which may have an impact on
your production workload. `timescaledb-backfill`'s `verify` subcommand performs
this check.

Another option is to run `ANALYZE` on both the source and target tables and
then look at the `reltuples` column of the `pg_class` table on a chunk-by-chunk
basis. The result is not exact, but doesn't require reading all rows from the
table.

## 9. Validate that target database can handle production load

<ValidateProductionLoad />

## 10. Switch production workload to target database

<SwitchProductionWorkload />

[timescaledb-backfill]: /migrate/:currentVersion:/dual-write-and-backfill/timescaledb-backfill/
[dual-write-and-backfill]: /migrate/:currentVersion:/dual-write-and-backfill/
