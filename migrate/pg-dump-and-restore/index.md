---
title: Migrations using pg_dump and pg_restore
excerpt: Migrate a hypertable or entire database with native PostgreSQL commands
products: [cloud, self_hosted]
keywords: [backups, restore]
tags: [recovery, logical backup, pg_dump, pg_restore]
---

import ConsiderCloud from "versionContent/_partials/_consider-cloud.mdx";

# Migrate using `pg_dump` and `pg_restore`

It is possible to migrate from self-hosted PostgreSQL or TimescaleDB to Timescale using the native PostgreSQL [`pg_dump`][pg_dump] and
[`pg_restore`][pg_restore] programs. If you are migrating from self-hosted TimescaleDB, this works for compressed hypertables without having to
decompress data before you begin.

For more information, consult the step-by-step guide for your source database:

- [Migrate from TimescaleDB](#migrate-from-timescaledb-using-pg_dumprestore)
- [Migrate from PostgreSQL](#migrate-from-postgresql-using-pg_dumprestore)

If you're planning on migrating to Timescale, there are a few limitations that you must be aware of:

- [Timescale does not allow having multiple databases per instance].
- [Timescale does not support tablespaces].
- [Timescale does not support all available extensions].
- [Timescale does not provide a superuser]. 

[//]: # (TODO: more caveats?)

<Highlight type="note">
A long-running `pg_dump` against a database can cause various issues due to the types of locks that `pg_dump` takes. Consult the troubleshooting section [dumping and locks](/migrate/:currentVersion:/troubleshooting/#dumping-and-locks) for more details.
</Highlight>

import DoNotRecommendForLargeMigration from "versionContent/_partials/_migrate_pg_dump_do_not_recommend_for_large_migration.mdx";
import SourceTargetNote from "versionContent/_partials/_migrate_source_target_note.mdx";
import SetupSourceTarget from "versionContent/_partials/_migrate_set_up_source_and_target.mdx";
import TimescaleDBVersion from "versionContent/_partials/_migrate_from_timescaledb_version.mdx";
import ExplainPgDumpFlags from "versionContent/_partials/_migrate_explain_pg_dump_flags.mdx";
import MinimalDowntime from "versionContent/_partials/_migrate_pg_dump_minimal_downtime.mdx";

## Migrate from TimescaleDB using pg_dump/restore

The following instructions show you how to move your data from self-hosted TimescaleDB to a Timescale instance using `pg_dump` and `psql`. To avoid data loss, you should take applications that connect to the database offline. The duration of the migration is proportional to the amount of data stored in your database.

<DoNotRecommendForLargeMigration />

<SourceTargetNote />

### Prerequisites

<MinimalDowntime />

Before you begin, ensure that you have:

- Installed the PostgreSQL client libraries on the machine that you will perform the migration from. You will need `pg_dump` and `psql`.
- [Created a database service in Timescale].
- Checked that all PostgreSQL extensions you use are available on Timescale. For more information, see the [list of compatible extensions].
- Checked that the version of PostgreSQL in your target database is greater than or equal to that of the source database.
- Checked that you're running the exact same version of Timescale on both your target and source databases (the major/minor/patch version must all be the same). For more information, see the [upgrade instructions] for self-hosted
  TimescaleDB.

### Dump the source database

Dump the roles from the source database (only necessary if you're using roles
other than the default `postgres` role in your database):

```bash
pg_dumpall -d "$SOURCE" \
  --quote-all-identifiers \
  --roles-only \
  --file=roles.sql
```

<SetupSourceTarget />

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

<Highlight type="note">
It is possible to dump using multiple connections to the source database. This may dramatically reduce the time taken to dump the source database. For more information, see [dumping with concurrency](/migrate/:currentVersion:/troubleshooting/#dumping-with-concurrency) and [restoring with concurrency](/migrate/:currentVersion:/troubleshooting/#restoring-with-concurrency).
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

## Migrate from PostgreSQL using pg_dump/restore

The following instructions show you how to move your data from self-hosted PostgreSQL to a Timescale instance using `pg_dump` and `psql`. To avoid data loss, you should take applications that connect to the database  offline. The duration of the migration is proportional to the amount of data stored in your database.

This migration method only moves the data. It does not enable Timescale features like hypertables, data compression or retention. You must 
manually enable these after the migration, which also requires taking your application offline.

<DoNotRecommendForLargeMigration />

<SourceTargetNote />

### Prerequisites

<MinimalDowntime />

Before you begin, ensure that you have:

- Installed the PostgreSQL client libraries on the machine that you will perform the migration from. You will need `pg_dump` and `psql`.
- [Created a database service in Timescale].
- Checked that all PostgreSQL extensions you use are available on Timescale.
  For more information, see the [list of compatible extensions].
- Checked that the version of PostgreSQL in your target database is greater
  than or equal to that of the source database.

### Dump the source database

Dump the roles from the source database (only necessary if you're using roles other than the default `postgres` role in your database):

```bash
pg_dumpall -d "$SOURCE" \
  --quote-all-identifiers \
  --roles-only \
  --file=roles.sql
```

<SetupSourceTarget />

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

<Highlight type="note">
It is possible to dump using multiple connections to the source database. This  may dramatically reduce the time taken to dump the source database. For more information, see [dumping with concurrency](/migrate/:currentVersion:/troubleshooting/#dumping-with-concurrency)
and [restoring with concurrency](/migrate/:currentVersion:/troubleshooting/#restoring-with-concurrency).
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

[//]: # (TODO: add something about which pg_dump mode to use &#40;plain / binary / custom&#41;)
[//]: # (TODO: add something about expected migration duration)

[Timescale does not allow having multiple databases per instance]: /migrate/:currentVersion:/troubleshooting/#only-one-database-per-instance
[Timescale does not support tablespaces]: /migrate/:currentVersion:/troubleshooting/#tablespaces
[Timescale does not support all available extensions]: /migrate/:currentVersion:/troubleshooting/#extension-availability
[Timescale does not provide a superuser]: /migrate/:currentVersion:/troubleshooting/#superuser-privileges
[Created a database service in Timescale]: /use-timescale/:currentVersion:/services/create-a-service/
[list of compatible extensions]: /use-timescale/:currentVersion:/extensions/
[upgrade instructions]: /self-hosted/:currentVersion:/upgrades/about-upgrades/

