---
title: Changelog
excerpt: Changelog
keywords: [changelog, upgrades, updates, releases]
---

import ReleaseNotification from "versionContent/_partials/_release_notification.mdx";

# Changelog

This page provides a summery of the latest changes to all Timescale products. For information about TimescaleDB 
v2.15.1 and earlier, see the [Release notes][release-notes].

## TimescaleDB 2.15.2

<Label type="date">June 7, 2024</Label>

### 🐛 Bugfixes

This release contains bug fixes introduced since TimescaleDB v2.15.1.
Best practice is to upgrade at the next available opportunity.

- [#6975](https://github.com/timescale/timescaledb/issues/6975): Fix sort pushdown for partially compressed chunks.
- [#6976](https://github.com/timescale/timescaledb/issues/6976): Fix removal of the metadata function and the update script.
- [#6978](https://github.com/timescale/timescaledb/issues/6978): Fix segfault in compress_chunk with primary space partition.
- [#6993](https://github.com/timescale/timescaledb/issues/6993): Disallow hash partitioning on the primary column.

### 🛫 Migrate from self-hosted TimescaleDB v2.14.x and earlier

After you run `ALTER EXTENSION`, you must run [this SQL script](https://github.com/timescale/timescaledb-extras/blob/master/utils/2.15.X-fix_hypertable_foreign_keys.sql). For more details, see [#6797](https://github.com/timescale/timescaledb/pull/6797).

If you are migrating from TimescaleDB v2.15.0 or v2.15.1, no changes are required.

<ReleaseNotification />

## May 2024 update

<Label type="date">May 31, 2024</Label>

Timescale Cloud has added the following new features. 

### 🔍 Database audit logging with pgaudit

The [PostgreSQL Audit extension(pgaudit)](https://github.com/pgaudit/pgaudit/) is now available on Timescale Cloud. 
pgaudit provides detailed database session and object audit logging in the Timescale 
Cloud logs.

If you have strict security and compliance requirements and need to log all operations 
on the database level, pgaudit can help. You can also export these audit logs to
[Amazon CloudWatch](https://aws.amazon.com/cloudwatch/).

To enable pgaudit:

1. Connect to your Timescale Cloud service

    ```
    psql -d "postgres://<username>:<password>@<host>:<port>/<service-name>"
    ```

2. Add pgaudit to the service

   ```
   CREATE EXTENSION IF NOT EXISTS "pgaudit" VERSION '16.0' CASCADE;
   ```

For more details on how to use the extension, refer to the [pgaudit documentation](https://github.com/pgaudit/pgaudit/).

### 🌡 International System of Unit support with postgresql-unit

The [SI Units for PostgreSQL extension(unit)](https://github.com/df7cb/postgresql-unit) provides support for the 
[ISU](https://en.wikipedia.org/wiki/International_System_of_Units) in Timescale Cloud. 

You can use Timescale Cloud to solve day-to-day questions. For example, to see what 50°C is in °F, run the following 
query in your Timescale Cloud service:

```
SELECT '50°C'::unit @ '°F' as temp;
  temp
--------
 122 °F
(1 row)
```

To enable postgresql-unit:

1. Connect to your Timescale Cloud service

   ```
   psql -d "postgres://<username>:<password>@<host>:<port>/<service-name>"
   ```

2. Add `unit` to the service

   ```
   CREATE EXTENSION IF NOT EXISTS "unit" VERSION '7' CASCADE;
   ```

### PopSQL improvements

🎨 PopSQL's theme now matches the Timescale brand, and it is now faster to open within Timescale Console.

[release-notes]: /about/:currentVersion:/release-notes/