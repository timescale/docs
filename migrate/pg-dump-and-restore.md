---
title: Migration with Downtime
excerpt: Migrate a hypertable or entire database with native PostgreSQL commands
products: [cloud, self_hosted]
keywords: [backups, restore]
tags: [recovery, logical backup, pg_dump, pg_restore]
---

import ConsiderCloud from "versionContent/_partials/_consider-cloud.mdx";

# Migration with Downtime

To easily migrate from self-hosted PostgreSQL or TimescaleDB to Timescale, you use native PostgreSQL 
[`pg_dump`][pg_dump] and [`pg_restore`][pg_restore]. If you are migrating from self-hosted TimescaleDB, this works for compressed hypertables without having to decompress data before you begin.

Before you migrate to Timescale, be aware that each Timescale instance [has a single database], does
not support [tablespaces] or [all available extensions]. Also [there is no superuser associated with a Timescale
instance].


import DoNotRecommendForLargeMigration from "versionContent/_partials/_migrate_pg_dump_do_not_recommend_for_large_migration.mdx";
import SourceTargetNote from "versionContent/_partials/_migrate_source_target_note.mdx";
import SetupSourceTarget from "versionContent/_partials/_migrate_set_up_source_and_target.mdx";
import TimescaleDBVersion from "versionContent/_partials/_migrate_from_timescaledb_version.mdx";
import ExplainPgDumpFlags from "versionContent/_partials/_migrate_explain_pg_dump_flags.mdx";
import MinimalDowntime from "versionContent/_partials/_migrate_pg_dump_minimal_downtime.mdx";
import DumpDatabaseRoles from "versionContent/_partials/_migrate_dual_write_dump_database_roles.mdx";

## Prerequisites

<MinimalDowntime />

Before you begin, ensure that you have:

- Installed the PostgreSQL client libraries on the machine that you will perform the migration from. You will need `pg_dump` and `psql`.
- [Created a database service in Timescale][created-a-database-service-in-timescale].
- Checked that all PostgreSQL extensions you use are available on Timescale. For more information, see the [list of compatible extensions].
- Checked that the version of PostgreSQL in your target database is greater than or equal to that of the source database.

<Tabs label="Migrate with downtime">

<Tab title="Migrate from TimescaleDB ">
## Migrate from TimescaleDB using pg_dump/restore

The following instructions show you how to move your data from self-hosted TimescaleDB to a Timescale instance using `pg_dump` and `psql`. To avoid data loss, you should take applications that connect to the database offline. The duration of the migration is proportional to the amount of data stored in your database.

<DoNotRecommendForLargeMigration />

<SourceTargetNote />

Before you migrate, ensure that you're running the exact same version of Timescale on both your target and source 
databases. That is, the major,minor, and patch version must all be the same. For more information, see the [upgrade 
instructions] for self-hosted TimescaleDB.

### Dump the source database

<SetupSourceTarget />

Dump the roles from the source database (only necessary if you're using roles
other than the default `postgres` role in your database):


<DumpDatabaseRoles />

Dump the source database schema and data:

```bash
pg_dump -d "$SOURCE" \
  --format=plain \
  --quote-all-identifiers \
  --no-tablespaces \
  --no-owner \
  --no-privileges \
  --file=dump.sql
```

Check the run time, [a long-running `pg_dump` can cause various issues](/migrate/:currentVersion:/troubleshooting/#dumping-and-locks)

<Highlight type="note">

It is possible to dump using multiple connections to the source database. This may dramatically reduce the time 
taken to dump the source database. For more information, see 
[dumping with concurrency][dumping-with-concurrency] and [restoring with concurrency][restoring-with-concurrency].

</Highlight>

The following is a brief explanation of the flags used:

<ExplainPgDumpFlags />

### Restore into the target database

#### Ensure that the correct TimescaleDB version is installed

<TimescaleDBVersion />

#### Restore the database from the dump

The following command loads the dumped data into the target database:

```bash
psql $TARGET -v ON_ERROR_STOP=1 --echo-errors \
    -f roles.sql \
    -c "SELECT timescaledb_pre_restore();" \
    -f dump.sql \
    -c "SELECT timescaledb_post_restore();"
```

It uses [timescaledb_pre_restore] and [timescaledb_post_restore] to put your database in the right state for restoring.

[timescaledb_pre_restore]: /api/:currentVersion:/administration/#timescaledb_post_restore
[timescaledb_post_restore]: /api/:currentVersion:/administration/#timescaledb_post_restore

#### Verify data in the target and restart applications

Verify that the data has been successfully restored by connecting to the target database by querying the restored data.

Once you have verified that the data is present, and returns the results that you expect, you can reconfigure your application to use the target database and then restart the application.

[//]: # (TODO: add something about which pg_dump mode to use &#40;plain / binary / custom&#41;)
[//]: # (TODO: add something about expected migration duration)

</Tab>
<Tab title="Migrate from PostgreSQL">

The following instructions show you how to move your data from self-hosted PostgreSQL to a Timescale instance using `pg_dump` and `psql`. To avoid data loss, you should take applications that connect to the database  offline. The duration of the migration is proportional to the amount of data stored in your database.

This migration method only moves the data. It does not enable Timescale features like hypertables, data compression or retention. You must 
manually enable these after the migration, which also requires taking your application offline.

<DoNotRecommendForLargeMigration />

<SourceTargetNote />

### Dump the source database

<SetupSourceTarget />

Dump the roles from the source database (only necessary if you're using roles other than the default `postgres` role in your database):

<DumpDatabaseRoles />

Dump the source database schema and data:

```bash
pg_dump -d "$SOURCE" \
  --format=plain \
  --quote-all-identifiers \
  --no-tablespaces \
  --no-owner \
  --no-privileges \
  --file=dump.sql
```

Check the run time, [a long-running `pg_dump` can cause various issues](/migrate/:currentVersion:/troubleshooting/#dumping-and-locks)

<Highlight type="note">

It is possible to dump using multiple connections to the source database. This may dramatically reduce the time
taken to dump the source database. For more information, see
[dumping with concurrency][dumping-with-concurrency] and [restoring with concurrency][restoring-with-concurrency].

</Highlight>

The following is a brief explanation of the flags used:

<ExplainPgDumpFlags />

### Restore into the target database

Load the dumped roles and data into the target database:

```bash
psql $TARGET -v ON_ERROR_STOP=1 --echo-errors \
    -f roles.sql \
    -f dump.sql
```

Update the table statistics by running `ANALYZE` on all data:

```bash
psql $TARGET -c "ANALYZE;"
```

### Verify data in the target and restart applications

Verify that the data has been successfully restored by connecting to the target database and querying the restored data.

Once you have verified that the data is present, and returns the results that you expect, you can reconfigure your application to use the target database and then start your application. 

</Tab>

</Tabs>

[has a single database]: /migrate/:currentVersion:/troubleshooting/#only-one-database-per-instance
[tablespaces]: /migrate/:currentVersion:/troubleshooting/#tablespaces
[all available extensions]: /migrate/:currentVersion:/troubleshooting/#extension-availability
[there is no superuser associated with a Timescale instance]: /migrate/:currentVersion:/troubleshooting/#superuser-privileges
[created-a-database-service-in-timescale]: /getting-started/:currentVersion:/services/
[list of compatible extensions]: /use-timescale/:currentVersion:/extensions/
[upgrade instructions]: /self-hosted/:currentVersion:/upgrades/about-upgrades/
[pg_dump]: https://www.postgresql.org/docs/current/app-pgdump.html
[pg_restore]: https://www.postgresql.org/docs/current/app-pgrestore.html
[migrate-from-timescaledb]: /migrate/:currentVersion:/pg-dump-and-restore/#migrate-from-timescaledb-using-pg_dumprestore
[migrate-from-postgresql]: /migrate/:currentVersion:/pg-dump-and-restore/#migrate-from-postgresql-using-pg_dumprestore
[dumping-with-concurrency]: /migrate/:currentVersion:/troubleshooting/#dumping-with-concurrency
[restoring-with-concurrency]: /migrate/:currentVersion:/troubleshooting/#restoring-with-concurrency 

