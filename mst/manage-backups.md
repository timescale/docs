---
title: Back up and restore your Managed Service for TimescaleDB
excerpt: Understand the various alternative tools that you can use to manage your MST backups
products: [mst]
keywords: [backups, manage, restore, pg_dump]
tags: [backup, manage, restore, timescaledb-backup, pg_dump]
---

# Backups

Managed Service for TimescaleDB databases are automatically backed up, with full
backups daily, and write-ahead log (WAL) continuously recorded. All backups are
[encrypted][aiven-encrypt].

Managed Service for TimescaleDB uses [`pghoard`][pghoard], a PostgreSQL backup
daemon and restore tool, to store backup data in cloud object stores. The number
of backups stored and the retention time of the backup depend on the service
plan.

<Highlight type="important">

The size of logical backups can be different from the size of the Managed
Service for TimescaleDB backup that appears on the web console. In some cases,
the difference is significant. Backup sizes that appear in the Managed Service
for TimescaleDB web console are for daily backups, before encryption and
compression. To view the size of each database, including space consumed by
indexes, you can use the `\l+` command at the psql prompt.

</Highlight>

## Logical and binary backups

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

## Restore a service

Managed Service for TimescaleDB provides a point-in-time recovery (PITR). To
restore your service from a backup, click the `Restore` button in the `Backups`
tab for your service. The backups are taken automatically by Managed Service for
TimescaleDB and retained for a few days depending on your plan type.

|Plan type|Backup retention period|
|-|-|
|Dev|1 day|
|Basic|2 days|
|Pro|3 days|

## Manually creating a backup

You can use `pg_dump` to create a backup manually. The `pg_dump` command allows
you to create backups that can be directly restored elsewhere if required.

Typical parameters for the command `pg_dump` include:

```bash
pg_dump '<SERVICE_URL_FROM_PORTAL>' -f '<TARGET_FILE/DIR>' -j '<NUMBER_OF_JOBS>' -F '<BACKUP_FORMAT>'
```

The `pg_dump` command can also be run against one of the standby nodes. For
example, use this command to create a backup in directory format using two
concurrent jobs. The results are stored to a directory named `backup`:

```bash
pg_dump 'postgres://tsdbadmin:password@mypg-myproject.a.timescaledb.io:26882/defaultdb?sslmode=require' -f backup -j 2 -F directory
```

You can put all backup files to single tar file and upload to Amazon S3. For example:

```bash
export BACKUP_NAME=backup-date -I.tartar -cf $BACKUP_NAME backup/s3cmd put $BACKUP_NAME s3://pg-backups/$BACKUP_NAME
```

[aiven-encrypt]: https://developer.aiven.io/docs/platform/concepts/cloud-security#data-encryption
[pghoard]: https://github.com/aiven/pghoard
