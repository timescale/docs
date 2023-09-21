---
title: Migrate from TimescaleDB using pg_dump/restore
excerpt: Migrate from a TimescaleDB database with downtime using pg_dump/restore
products: [cloud]
keywords: [migration, low-downtime]
tags: [migration, logical backup, pg_dump, pg_restore, timescaledb]
---

import OpenSupportRequest from "versionContent/_partials/_migrate_open_support_request.mdx"
import SourceTargetNote from "versionContent/_partials/_migrate_source_target_note.mdx";
import SetupSourceTarget from "versionContent/_partials/_migrate_set_up_source_and_target.mdx";
import TimescaleDBVersion from "versionContent/_partials/_migrate_from_timescaledb_version.mdx";

# Migrate from TimescaleDB using pg_dump/restore

The following instructions show you how to move your data from self-hosted
TimescaleDB to a Timescale instance using `pg_dump` and `psql`. To not lose any
data, applications which connect to the database should be taken offline. The
duration of the migration is proportional to the amount of data stored in your
database.

We do not recommend using this migration method to migrate more than
100&nbsp;GB of data, primarily because of the amount of downtime that it
implies for your application, instead use the [dual-write and backfill]
low-downtime migration solution. Should you nonetheless wish to migrate more
than 400&nbsp;GB of data with this method, open a support request to ensure
that enough disk is pre-provisioned on your Timescale instance.

<OpenSupportRequest />

[dual-write and backfill]: /migrate/:currentVersion:/dual-write-and-backfill

<SourceTargetNote />

## Prerequisites

For minimal downtime, the `pg_dump` and `psql` commands should be run from a
machine with a low-latency, high-throughput link to the database that they are
connected to. Timescale instances run in the Amazon cloud, so our
recommendation is that you use an EC2 instance in the same region as your
Timescale instance.

Before you begin, ensure that you have:

- Installed the PostgreSQL client libraries on the machine that you will
  perform the migration from, you will require `pg_dump` and `psql`.
- [Created a database service in Timescale].
- Checked that all PostgreSQL extensions you use are available on Timescale.
  For more information, see the [list of compatible extensions].
- Checked that the version of PostgreSQL in your target database is greater
  than or equal to that of the source database.
- Checked that you're running the exact same version of Timescale on both your
  target and source databases (the major/minor/patch version must all be the
  same). For more information, see the [upgrade instructions] for self-hosted
  TimescaleDB.

[Created a database service in Timescale]: /use-timescale/:currentVersion:/services/create-a-service/
[list of compatible extensions]: /use-timescale/:currentVersion:/extensions/
[upgrade instructions]: /self-hosted/latest/:currentVersion:/about-upgrades/

## Dump the source database

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

## Restore into the target database

### Ensure that the correct TimescaleDB version is installed

<TimescaleDBVersion />

### Restore the database from the dump

The following command loads the dumped data into the target database:

```bash
psql $TARGET -v ON_ERROR_STOP=1 --echo-errors \
    -f roles.sql \
    -c "SELECT timescaledb_pre_restore();" \
    -f dump.sql \
    -c "SELECT timescaledb_post_restore();"
```

It uses [timescaledb_pre_restore] and [timescaledb_post_restore] to put your
database in the right state for restoring.

<Highlight type="note">
`pg_dump` and `pg_restore` support parallel dump/restore when used in
`directory` mode. It is possible, in principle, to use this option with
TimescaleDB, but there are some caveats. Read the troubleshooting pages
[Dumping with concurrency], and [Restoring with concurrency].
</Highlight>

[timescaledb_pre_restore]: /api/:currentVersion:/administration/timescaledb_pre_restore/
[timescaledb_post_restore]: /api/:currentVersion:/administration/timescaledb_post_restore/
[Dumping with concurrency]: /migrate/:currentVersion:/troubleshooting#dumping-with-concurrency
[Restoring with concurrency]: /migrate/:currentVersion:/troubleshooting#restoring-with-concurrency
