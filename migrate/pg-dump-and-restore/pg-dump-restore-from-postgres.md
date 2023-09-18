---
title: Migrate from PostgreSQL using pg_dump/restore
excerpt: Migrate from a PostgreSQL database with downtime using pg_dump/restore
products: [cloud]
keywords: [migration, low-downtime]
tags: [migration, logical backup, pg_dump, pg_restore]
---

# Migrate from PostgreSQL using pg_dump/restore

The following instructions show you how to move your data from self-hosted
PostgreSQL to a Timescale instance. Note that this will just move the data, but
will not configure a hypertable for your data, or other Timescale features like
data compression or retention.

### Dump the source database

Dump the roles from the source database (only necessary if you're using roles
other than the default `postgres` role in your database):

```bash
pg_dumpall -d "$SOURCE" \
  --quote-all-identifiers \
  --roles-only \
  --file=roles.sql
```

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

import SetupSourceTarget from "versionContent/_partials/_migrate_set_up_source_and_target.mdx";

<SetupSourceTarget />

<Procedure>

### Restore your entire database from backup

1. Restore the roles to the database:

    ```bash
    psql $TARGET -v ON_ERROR_STOP=1 --echo-errors -f roles.sql
    ```

1.  Restore the database:

    ```bash
    psql $TARGET -v ON_ERROR_STOP=1 --echo-errors -f dump.sql
    ```

</Procedure>
