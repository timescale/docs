---
title: Troubleshooting backups
excerpt: Fix common problems experienced with backups and restores
keywords: [backup, restore]
tags: [recovery, pg_dump, pg_restore]
---

# Troubleshooting

This section contains some ideas for troubleshooting common problems experienced
with backups and restores.

## Troubleshoot version mismatches

The PostgreSQL `pg_dump` command does not allow you to specify which version of
the extension to use when backing up. This can create problems if you have a
more recent version installed. For example, if you create the backup using an
older version of TimescaleDB, and when you restore it uses the current version,
without giving you an opportunity to upgrade first.

You can work around this problem when you are restoring from backup by making
sure the new PostgreSQL instance has the same extension version as the original
database before you perform the restore. After the data is restored, you can
upgrade the version of TimescaleDB.

## Troubleshoot errors when running pg_dump

You might see the following errors when running `pg_dump`. You can safely ignore
these. Your hypertable data is still accurately copied:

```bash
pg_dump: NOTICE:  hypertable data are in the chunks, no data will be copied
DETAIL:  Data for hypertables are stored in the chunks of a hypertable so COPY TO of a hypertable will not copy any data.
HINT:  Use "COPY (SELECT * FROM &lt;hypertable&gt;) TO ..." to copy all data in hypertable, or copy each chunk individually.
```
