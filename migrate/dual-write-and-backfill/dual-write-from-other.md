---
title: Migrate from non-PostgreSQL using dual-write and backfill
excerpt: Migrate from a non-PostgreSQL database using the low-downtime dual-write and backfill method
products: [cloud]
keywords: [migration, low-downtime]
tags: [migration, logical backup]
---

import StepOne from "versionContent/_partials/_migrate_dual_write_step1.mdx";
import StepTwo from "versionContent/_partials/_migrate_dual_write_step2.mdx";
import StepFour from "versionContent/_partials/_migrate_dual_write_step4.mdx";
import StepFive from "versionContent/_partials/_migrate_dual_write_step5.mdx";
import ValidateProductionLoad from "versionContent/_partials/_migrate_dual_write_validate_production_load.mdx";
import SwitchProductionWorkload from "versionContent/_partials/_migrate_dual_write_switch_production_workload.mdx";

# Dual-write and backfill from non-PostgreSQL database

This document provides detailed step-by-step instructions to migrate data using
the [dual-write and backfill][dual-write-and-backfill] migration method from a
source database which is not using PostgreSQL to Timescale.

In detail, the migration process consists of the following steps:
1. Set up a target database instance in Timescale.
1. Modify the application to write to a secondary database.
1. Migrate schema and relational data from source to target.
1. Start the application in dual-write mode.
1. Determine the completion point `T`.
1. Backfill time-series data from source to target.
1. Enable background jobs (policies) in the target database.
1. Validate that all data is present in target database.
1. Validate that target database can handle production load.
1. Switch application to treat target database as primary (potentially
   continuing to write into source database, as a backup).

<StepOne />

<StepTwo />

## 3. Set up schema and migrate relational data to new database

TODO

<StepFour />

<StepFive />

## 6. Backfill data from source to target

If your source database is not using TimescaleDB, we recommend dumping the data
from your source database on a per-table basis into CSV format, and restoring
those CSVs into the target database using the `timescaledb-parallel-copy` tool.

Before you load the CSV data into the target hypertable, you must remove all
rows which were inserted by dual writes, and which are before the completion
point:

```SQL
DELETE FROM <target_hypertable> WHERE <time_column> < <completion point time>;
```

You must also ensure that all rows in the CSV data which you load into the
target hypertable must be before the completion point. You should apply this
filter when dumping the data from the source database.

You can load a CSV file into a hypertable using `timescaledb-parallel-copy` as
follows:

```
timescaledb-parallel-copy \
  --connection $TARGET \
  --table <target_hypertable> \
  --workers 8 \
  --file <your dumped csv data>
```

## 7. Enable background jobs in target database

Before enabling the jobs, verify if any continuous aggregate refresh policies
exist.

```sql
select count(*)
from _timescaledb_config.bgw_job
where proc_name = 'policy_refresh_continuous_aggregate'
```

If they do exist, refresh the continuous aggregates before re-enabling the
jobs. The scripts below refresh the continuous aggregates in hierarchical order
by retrieving the latest watermark from the source and then refreshing:

```sh
wget https://assets.timescale.com/releases/refresh_cagg.tar.gz
tar xf refresh_cagg.tar.gz
psql -d $SOURCE -f refresh_cagg_step1_source.sql
psql -d $TARGET -f refresh_cagg_step2_target.sql
```

Once the continuous aggregates are updated, you can re-enable all background
jobs:

```bash
psql -d $TARGET -f <<EOF
  select public.alter_job(id::integer, scheduled=>true)
  from _timescaledb_config.bgw_job
  where id >= 1000;
EOF
```

<Highlight type="note">
If the backfill process took long enough for there to be significant
retention/compression work to be done, it may be preferable to run the jobs
manually in order to have control over the pacing of the work until it is
caught up before reenabling.
</Highlight>

## 8. Validate that all data is present in target database

One possible approach to validating this is to compare row counts on a
chunk-by-chunk basis. One way to do so is to run `select count(*) ...` which is
exact but potentially costly. Another way to do it would be to run analyze on
both the source and target chunk and then look at the `reltuples` column of the
`pg_class` table for the chunks' rows. This would not be exact but would be
less costly.

## 9. Validate that target database can handle production load

<ValidateProductionLoad />

## 10. Switch production workload to new database

<SwitchProductionWorkload />

[create-service]: /use-timescale/:currentVersion:/services/create-a-service/
[dual-write-and-backfill]: /migrate/:currentVersion:/dual-write-and-backfill/