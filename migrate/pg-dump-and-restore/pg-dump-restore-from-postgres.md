---
title: Migrate from PostgreSQL using pg_dump/restore
excerpt: Migrate from a PostgreSQL database with downtime using pg_dump/restore
products: [cloud]
keywords: [migration, low-downtime]
tags: [migration, logical backup, pg_dump, pg_restore]
---

import DoNotRecommendForLargeMigration from "versionContent/_partials/_migrate_pg_dump_do_not_recommend_for_large_migration.mdx";
import MinimalDowntime from "versionContent/_partials/_migrate_pg_dump_minimal_downtime.mdx";
import SetupSourceTarget from "versionContent/_partials/_migrate_set_up_source_and_target.mdx";
import SourceTargetNote from "versionContent/_partials/_migrate_source_target_note.mdx";
import ExplainPgDumpFlags from "versionContent/_partials/_migrate_explain_pg_dump_flags.mdx";

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

<DoNotRecommendForLargeMigration />

<SourceTargetNote />

## Prerequisites

<MinimalDowntime />

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

<Highlight type="note">
It is possible to dump using multiple connections to the source database, which
may dramatically reduce the time taken to dump the source database. For more
information, see [dumping with concurrency](/migrate/:currentVersion:/troubleshooting/#dumping-with-concurrency)
and [restoring with concurrency](/migrate/:currentVersion:/troubleshooting/#restoring-with-concurrency).
</Highlight>

The following is a brief explanation of the flags used:

<ExplainPgDumpFlags />

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
