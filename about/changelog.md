---
title: Changelog
excerpt: Changelog
keywords: [changelog, upgrades, updates, releases]
---

# Changelog

This page provides a summery of the latest changes to Timescale products.

## TimescaleDB 2.15.2

<Label type="date">June 7, 2024</Label>

🐛 Bugfixes

- [#6975](https://github.com/timescale/timescaledb/issues/6975): Fix sort pushdown for partially compressed chunks.
- [#6976](https://github.com/timescale/timescaledb/issues/6976): Fix removal of the metadata function and the update script.
- [#6978](https://github.com/timescale/timescaledb/issues/6978): Fix segfault in compress_chunk with primary space partition.
- [#6993](https://github.com/timescale/timescaledb/issues/6993): Disallow hash partitioning on the primary column.

## May 2024 Update

<Label type="date">May 31, 2024</Label>

### 🔍 Database audit logging with pgaudit

The [PostgreSQL Audit Extension (pgaudit)](https://github.com/pgaudit/pgaudit/) is now available on Timescale Cloud. pgaudit provides detailed database session and/or object audit logging in the Timescale logs.

If you have strict security and compliance requirements and you need to log all operations on the database level, pgaudit can help. You can also export audit logs to CloudWatch.

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

### 🌡 Timescale now supports the unit extension

[postgresql-unit](https://github.com/df7cb/postgresql-unit) provides support for the [International System of Units](https://en.wikipedia.org/wiki/International_System_of_Units) inside your Timescale Cloud service. You can use Timescale Cloud to solve day-to-day questions. For example, to see what 50°C is in °F, run the following query in your Timescale Cloud service:

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

### PopSQL

- 🎨 PopSQL's theme now matches the Timescale brand, and it is now faster to open within Timescale Console
