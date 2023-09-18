---
title: Migrate from TimescaleDB using dual-write and backfill
excerpt: Migrate from a TimescaleDB database using the low-downtime dual-write and backfill method
products: [cloud]
keywords: [migration, low-downtime]
tags: [migration, logical backup]
---

import StepOne from "versionContent/_partials/_migrate_dual_write_step1.mdx";
import StepTwo from "versionContent/_partials/_migrate_dual_write_step2.mdx";
import StepFour from "versionContent/_partials/_migrate_dual_write_step4.mdx";
import StepFive from "versionContent/_partials/_migrate_dual_write_step5.mdx";

# Dual-write and backfill from TimescaleDB database

This document provides detailed step-by-step instructions to migrate data using
the [dual-write and backfill][dual-write-and-backfill] migration method from a
source database which is using TimescaleDB to Timescale.

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

This section leverages `pg_dumpall` and `pg_dump` to migrate the roles and
relational schema that you are using in the source database to the target
database.

<Highlight type="important">
The PostgresSQL versions of the source and target databases can be of different
versions, as long as the target version is greater than that of the source.

The version of TimescaleDB used in both databases must be exactly the same.
</Highlight>

Dump the database roles from the source database:

```
pg_dumpall -d "$SOURCE" \
  --quote-all-identifiers \
  --roles-only \
  --file=roles.sql
```

import SetupSourceTarget from "versionContent/_partials/_migrate_set_up_source_and_target.mdx";

<SetupSourceTarget />

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

To check the sed version, you can use the command sed --version. While the GNU
version will explicitly identify itself as GNU, the BSD version of sed
generally doesn't provide a straightforward --version flag and will simply
output an "illegal option" error.
</Highlight>

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

Dump all plain tables and the TimescaleDB catalog from the source database:

```
pg_dump -d "$SOURCE" \
  --format=plain \
  --quote-all-identifiers \
  --no-tablespaces \
  --no-owner \
  --no-privileges \
  --exclude-table-data='_timescaledb_internal.*' \
  --file=dump.sql
```

- `--no-tablespaces` is required because Timescale does not support
  tablespaces other than the default. This is a limitation.

- `--no-owner` is required because tsdbadmin is not a superuser and cannot
  assign ownership in all cases. This flag means that everything will be
  owned by the tsdbadmin user in the target regardless of ownership in the
  source. This is a limitation.

- `--no-privileges` is required because tsdbadmin is not a superuser and
  cannot assign privileges in all cases. This flag means that privileges
  assigned to other users will need to be reassigned in the target
  database as a manual clean-up task. This is a limitation.

- `--exclude-table-data='_timescaledb_internal.*'` will dump the structure
  of the hypertable chunks, but not the data. This will create empty
  chunks on the target ready for the backfill process.

If the source database has the timescaledb extension installed in a schema
other than "public" it will cause issues on Timescale. Edit the dump file to
remove any references to the non-public schema. We need the extension in the
"public" schema on Timescale. This is a limitation.

Load the roles and schema into the target database, and disable all background jobs.

```
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
Background jobs are disabled to prevent continuous aggregate refresh jobs from
updating the continuous aggregate with incomplete/missing data. The continuous
aggregates must be manually updated in the required range once the migration is
complete.
</Highlight>

<StepFour />

<StepFive />

## 6. Backfill data from source to target

To backfill from TimescaleDB, we recommend using our backfill tool
[timescaledb-backfill][timescaledb-backfill].

The tool performs best when executed in an instance located close to the target
database. The ideal scenario is an EC2 instance located in the same
availability zone as the Timescale service. We recommend using a Linux-based
distribution on x86_64.

<!-- TODO: Recommended spec for the instance.  -->

With the instance that will run the timescaledb-backfill ready, log in and
download the tool's binary:

```sh
wget https://assets.timescale.com/releases/timescaledb-backfill-x86_64-linux.tar.gz
tar xf timescaledb-backfill-x86_64-linux.tar.gz
sudo mv timescaledb-backfill /usr/local/bin/
```

Running timescaledb-backfill is a four-phase process:

1. Stage:
   ```
   timescaledb-backfill stage --source $SOURCE --target $TARGET --until <completion point>
   ```
1. Copy:
   ```
   timescaledb-backfill copy --source $SOURCE --target $TARGET
   ```
1. Verify (optional):
   ```
   timescaledb-backfill verify --source $SOURCE --target $TARGET
   ```
1. Clean:
   ```
   timescaledb-backfill clean --target $SOURCE
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

Assuming dual-writes have been in place, the target database should be holding
up to production write traffic. Now would be the right time to determine if the
new database can serve all production traffic (both reads _and_ writes). How
exactly this is done is application-specific and up to you to determine.

## 10. Switch production workload to new database

Once you've validated that all the data is present, and that the new database
can handle the production workload, the final step is to switch to the new
database as your primary. You may want to continue writing to the old database
for a period, until you are certain that the new database is holding up to all
production traffic.

[timescaledb-backfill]: /migrate/:currentVersion:/dual-write-and-backfill/timescaledb-backfill/
[dual-write-and-backfill]: /migrate/:currentVersion:/dual-write-and-backfill/