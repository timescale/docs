---
title: Types of Backups
excerpt: Understand how Timescale Cloud backs up PostgreSQL
product: cloud
keywords: [backup, binary, logical]
tags: [backup, binary, logical]
---
# How Timescale Cloud backs up PostgreSQL?
Timescale Cloud databases are automatically backed-up, with full backups daily,
and write-ahead log (WAL) recorded continuously. All backups are
[encrypted][avien-encrypt]. Timescale Cloud uses [`pghoard`][pghoard], a PostgreSQL® backup
daemon and restore tool to store backup data in cloud object stores. The number of
backups stored and the retention time of the backup depends on the service plan.

<highlight type="important"> The size of logical backups, and the size of the
Timescale Cloud backup that appears on the Timescale Cloud web console differs, in
some cases significantly. Backup sizes that appear in the Timescale Cloud web
console are for daily backups, before encryption and compression. To view the
size of each database, including space consumed by indexes, you can use *
\l+command* at the psql prompt. </highlight> 

The two types of backups are binary backups and logical backups. Full backups
are version-specific binary backups, which when combined with WAL allow
consistent recovery to a point in time (PITR). Whereas logical backups are
taken using the `pg_dump` command.

## Differences between logical and binary backups

|Type|Binary|Logical|
|---|---|---|
|index|contains all data from indexes| does not contain index data, it contains only queries used to recreate indexes from other data|
|transactions|contains uncommitted transactions|does not contain uncommitted transactions|
|data|contains deleted and updated rows which have not been cleaned up by PostgreSQL VACUUM process, and all databases, including templates|do not contain any data already deleted, and depending on the options given, the output might be compressed|


[avien-encrypt]: https://developer.aiven.io/docs/platform/concepts/cloud-security#data-encryption
[pghoard]: https://github.com/aiven/pghoard