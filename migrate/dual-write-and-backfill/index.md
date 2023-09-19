---
title: Low-downtime migrations with dual-write and backfill
excerpt: Migrate a hypertable or entire database with low downtime
products: [cloud, self_hosted]
keywords: [backups, restore]
tags: [recovery, logical backup, pg_dump, pg_restore]
---

# Dual-write and backfill

Dual-write and backfill is a migration strategy to move a large amount of
time-series data (100&nbsp;GB-4&nbsp;TB+) with low downtime (on the order of 
minutes of downtime). It is significantly more complicated to execute than a
migration with downtime using [pg_dump/restore][pg-dump-and-restore], and has
some prerequisites on the data ingest patterns of your application, so it may
not be universally-applicable.

Roughly, it consists of three steps:

1. Clone schema and relational data from source to target
1. Dual-write to source and target
1. Backfill time-series data

Dual-write and backfill can be used for any source database type, as long as it
can provide data in csv format. It can be used to move data from a PostgresSQL
source, and from TimescaleDB to TimescaleDB.

Dual-write and backfill works well when:
1. The bulk of the (on-disk) data is in time-series tables.
1. Writes by the application do not reference historical time-series data.
1. There is no requirement for transactional consistency (that is, it is possible
   to filter the time-series data by time and retain data integrity).
1. No `UPDATE` or `DELETE` queries will be run on time-series data in the
   source database during the migration process (or if they are, it happens in
   a controlled manner, such that it's possible to either ignore, or
   re-backfill).
1. Either the relational (non-time-series) data is small enough to be copied
   from source to target in an acceptable amount of time for this to be done
   with downtime, or the relational data can be copied asynchronously while the
   application continues to run (that is, changes relatively infrequently).

For more information, consult the step-by-step guide for the source database
that you will use:

- [Dual-write and backfill from TimescaleDB][from-timescaledb]
- [Dual-write and backfill from PostgreSQL][from-postgres]

[//]: # (- [Dual-write and backfill from other][from-other])

## Getting help

The dual-write and backfill migration method is relatively new, so the
documentation and tooling may have some rough edges. If you are stuck, you can
either contact support (in the [Timescale console][support-help], or via email
to [support@timescale.com][email]) or take your issue to the `#migration`
channel in our [community slack][slack], where the developers of this migration
method are there to help.

[from-timescaledb]: /migrate/:currentVersion:/dual-write-and-backfill/from-timescaledb/
[from-postgres]: /migrate/:currentVersion:/dual-write-and-backfill/from-postgres/
[from-other]: /migrate/:currentVersion:/dual-write-and-backfill/from-other/
[pg-dump-and-restore]: /migrate/:currentVersion:/pg-dump-and-restore/
[slack]: https://slack.timescale.com/
[email]: mailto:support@timescale.com
[support-help]: https://console.cloud.timescale.com/dashboard/support