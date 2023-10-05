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
import Step6eTurnOnCompressionPolicies from "versionContent/_partials/_migrate_dual_write_6e_turn_on_compression_policies.mdx";
import Step6aThroughc from "versionContent/_partials/_migrate_dual_write_6a_through_c.mdx";

# Dual-write and backfill from non-PostgreSQL database

This document provides detailed step-by-step instructions to migrate data using
the [dual-write and backfill][dual-write-and-backfill] migration method from a
source database which is not using PostgreSQL to Timescale.

<SourceTargetNote />

In detail, the migration process consists of the following steps:
1. Set up a target database instance in Timescale.
1. Modify the application to write to a secondary database.
1. Set up schema and migrate relational data to target database.
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

## 3. Set up schema and migrate relational data to target database

Describing exactly how to migrate your data from every possible source is not
feasible, instead we tell you what needs to be done, and hope that you find
resources to support you.

In this step, you need to prepare the database to receive time-series data
which is dual-written from your application. If you're migrating from another
time-series database then you only need to worry about setting up the schema
for the hypertables which will contain time-series data. For some background on
what hypertables are, consult the [tables and hypertables] section of the
getting started guide.

If you're migrating from a relational database containing both relational and
time-series data, you also need to set up the schema for the relational data,
and copy it over in this step, excluding any of the time-series data. The
time-series data is backfilled in a subsequent step.

Our assumption in the dual-write and backfill scenario is that the volume of
relational data is either very small in relation to the time-series data, so
that it is not problematic to briefly stop your production application while
you copy the relational data, or that it changes infrequently, so you can get a
snapshot of the relational metadata without stopping your application. If this
is not the case for your application, you should reconsider using the
dual-write and backfill method.

<Highlight type="information">
If you're planning on experimenting with continuous aggregates, we recommend
that you first complete the dual-write and backfill migration, and only then
create continuous aggregates on the data. If you create continuous aggregates
on a hypertable before backfilling data into it, you must refresh the
continuous aggregate over the whole time range to ensure that there are no
holes in the aggregated data.
</Highlight>

[tables and hypertables]: /getting-started/:currentVersion:/tables-hypertables/

<StepFour />

<StepFive />

## 6. Backfill data from source to target

<Step6aThroughc />

### 6d. Copy the data

Refer to the documentation for your source database in order to determine how
to dump a table into a CSV. You must ensure the CSV contains only data before
the completion point. You should apply this filter when dumping the data from
the source database.

You can load a CSV file into a hypertable using `timescaledb-parallel-copy` as
follows. Set the number of workers equal to the number of CPU cores in your
target database:

```
timescaledb-parallel-copy \
  --connection $TARGET \
  --table <target_hypertable> \
  --workers 8 \
  --file <table dump for source table>
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

## 8. Validate that target database can handle production load

<ValidateProductionLoad />

## 9. Switch production workload to target database

<SwitchProductionWorkload />

[dual-write-and-backfill]: /migrate/:currentVersion:/dual-write-and-backfill/