---
title: Changelog
excerpt: Changelog
keywords: [changelog, upgrades, updates, releases]
---

# Changelog

## TimescaleDB 2.15.2

June 7, 2024

🐛 Bugfixes

- [#6975](https://github.com/timescale/timescaledb/issues/6975): Fix sort pushdown for partially compressed chunks.
- [#6976](https://github.com/timescale/timescaledb/issues/6976): Fix removal of metadata function and the update script.
- [#6978](https://github.com/timescale/timescaledb/issues/6978): Fix segfault in compress_chunk with primary space partition.
- [#6993](https://github.com/timescale/timescaledb/issues/6993): Disallow hash partitioning on the primary column.

## May 2024 Update

May 31, 2024

### 🔍 Database audit logging via the pg_audit extension

The [PostgreSQL Audit Extension (pgaudit)](https://github.com/pgaudit/pgaudit/) is now available on Timescale. It provides detailed database session and/or object audit logging in the Timescale logs.

If you have strict security and compliance requirements and you need to log all operations on the database level, pgaudit can help. You can also export audit logs to CloudWatch if you like.

To install the extension, simply go to `Service > Operations > Extensions` and search for `pgaudit`. To change the configuration parameters, go to `Database parameters > Advanced parameters` and search for `pgaudit`.

For more details on how to use the extension, please refer to the [pgaudit documentation](https://github.com/pgaudit/pgaudit/).

### 🌡 Timescale now supports the unit extension :thermometer:

Timescale now also supports the [unit](https://github.com/df7cb/postgresql-unit) extension.

This extension provides SI Unit support in Postgres. This means that you can use Postgres to solve some of the more annoying day-to-day questions in your life.

When your colleague in India says it was 50°C, now you can do:

```
tsdb=> SELECT '50°C'::unit @ '°F' as temp;
  temp
--------
 122 °F
(1 row)
```

And when your colleague in Alabama says they caught a two-foot fish:

```
tsdb=> SELECT '2 feet'::unit @ 'cm' as fish_length;
 fish_length
-------------
 60.96 cm
(1 row)
```

### Other improvements

- 🎨 PopSQL's theme was changed to match the Timescale brand, and it is now faster to open within Timescale Console
