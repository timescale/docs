---
title: Migrate from PostgreSQL using pg_dump/restore
excerpt: Migrate from a PostgreSQL database with downtime using pg_dump/restore
products: [cloud]
keywords: [migration, low-downtime]
tags: [migration, logical backup, pg_dump, pg_restore]
---

import OpenSupportRequest from "versionContent/_partials/_migrate_open_support_request.mdx"
import SetupSourceTarget from "versionContent/_partials/_migrate_set_up_source_and_target.mdx";
import SourceTargetNote from "versionContent/_partials/_migrate_source_target_note.mdx";

# Migrate from PostgreSQL using pg_dump/restore

The following instructions show you how to move your data from self-hosted
PostgreSQL to a Timescale instance using `pg_dump` and `psql`. In order to not
lose any data, applications which connect to the database should be taken
offline. The duration of the migration is proportional to the amount of data
stored in your database.

This migration method only moves the data, but does not enable Timescale
features like hypertables, data compression or retention. These must be
manually enabled after the migration, for which you must also take your
application offline.

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
connected to. As Timescale instances run in the Amazon cloud, use an AWS EC2
instance in the same region as your Timescale instance.

Before you begin, ensure that you have:

- Installed the PostgreSQL client libraries on the machine that you will
  perform the migration from, you will require `pg_dump` and `psql`.
- [Created a database service in Timescale].
- Checked that all PostgreSQL extensions you use are available on Timescale.
  For more information, see the [list of compatible extensions].
- Checked that the version of PostgreSQL in your target database is greater
  than or equal to that of the source database.

[Created a database service in Timescale]: /use-timescale/:currentVersion:/services/create-a-service/
[list of compatible extensions]: /use-timescale/:currentVersion:/extensions/

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

The following is a brief explanation of the flags used:

- `--no-tablespaces` is required because Timescale does not support
  tablespaces other than the default. This is a known limitation.

- `--no-owner` is required because Timescale's `tsdbadmin` user is not a
  superuser and cannot assign ownership in all cases. This flag means that
  everything is owned by the user used to connect to the target, regardless of
  ownership in the source. This is a known limitation.

- `--no-privileges` is required because Timescale's `tsdbadmin` user is not a
  superuser and cannot assign privileges in all cases. This flag means that
  privileges assigned to other users need to be reassigned in the target
  database as a manual clean-up task. This is a known limitation.

## Restore into the target database

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

Verify that the data has been successfully restored by connecting to the target
database and querying the restored data.

Once you have verified that the data is present, and returns the results that
you expect, you can reconfigure your application to use the target database and
start it.

[//]: # (TODO: add something about which pg_dump mode to use &#40;plain / binary / custom&#41;)
[//]: # (TODO: add something about expected migration duration)
