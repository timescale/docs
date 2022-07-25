---
title: Types of backups in Managed Services for TimescaleDB
excerpt: Understand how Timescale Cloud backs up PostgreSQL
product: cloud
keywords: [backup]
tags: [backup, binary backup, logical backup]
---
# Backups in Managed Service for TimescaleDB
Managed Service for TimescaleDB databases are automatically backed up, with full
backups daily, and write-ahead log (WAL) continuously recorded. All backups are
[encrypted][avien-encrypt]. Managed Service for TimescaleDB uses
[`pghoard`][pghoard], a PostgreSQL backup daemon and restore tool, to store
backup data in cloud object stores. The number of backups stored and the
retention time of the backup depends on the service plan.

<highlight type="important"> 
The size of logical backups, and the size of the Managed Service for TimescaleDB
backup that appears on the web console differs, in some cases significantly.
Backup sizes that appear in the Managed Service for TimescaleDB web console are
for daily backups, before encryption and compression. To view the size of each
database, including space consumed by indexes, you can use the `\l+` command at
the psql prompt.
</highlight> 

## Differences between logical and binary backups
The two types of backups are binary backups and logical backups. Full backups
are version-specific binary backups which, when combined with WAL, allow
consistent recovery to a point in time (PITR). You can create a logical backup
with the `pg_dump` command.

This table lists the differences between binary and logical backups when backing
up indexes, transactions, and data:

|Type|Binary|Logical|
|-|-|-|
|index|contains all data from indexes|does not contain index data, it contains only queries used to recreate indexes from other data|
|transactions|contains uncommitted transactions|does not contain uncommitted transactions|
|data|contains deleted and updated rows which have not been cleaned up by PostgreSQL VACUUM process, and all databases, including templates|does not contain any data already deleted, and depending on the options given, the output might be compressed|


[avien-encrypt]: https://developer.aiven.io/docs/platform/concepts/cloud-security#data-encryption
[pghoard]: https://github.com/aiven/pghoard
