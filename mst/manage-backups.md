---
title: Manage your Backups
excerpt: Understand the various alternative tools that you can use to manage your backups
product: cloud
keywords: [backup, manage, restore, tiemscaledb-backup, pg_dump]
tags: [backup, manage, restore, timescaledb-backup, pg_dump]
---

# Manage your backups
Managed Service for TimescaleDB provides a point-in-time recovery (PITR). To restore service from a backup, click the `Restore` button in the `Backups` tab for your service. The backups are taken automatically by Managed Service for TimescaleDB and retained for a few days depending on your plan type. You can also alternatives, such as `timescaledb-backup` and `pg_dump` to create a backup and restore the TimescaleDB.

## 'timescaledb-backup'
To create and restore from an additional set of backups, use the `timescaledb-backup` tool.
It enables you to backup and restores TimescaleDB efficiently with minimal errors.

When you use PostgreSQL tools such as `pg_dump` and `pg_restore` in TimescaleDB, some of the limitations are:
* The PostgreSQL backup and restore tools do not support backup and restore across versions of extensions. For example, if you take a backup from TimescaleDB v1.7.1, you need to first restore to a database version that is also running TimescaleDB v1.7.1, and then manually upgrade TimescaleDB to a later version.
* The backup and restore tools do not track which version of TimescaleDB is in the backup, and you need to maintain additional information to ensure the successful restoration.
* Users need to manually run pre and post-restore hooks or database functions in TimescaleDB. Failure to execute these hooks can prevent successful restoration.
* The restore process cannot perform parallel restoration for greater speed or efficiency.

Although `timescaledb-backup` continues to use `pg_dump` and `pg_restore`, it wraps these to:
* Track automatically the version of TimescaleDB internally in the information that is dumped, to ensure that the proper version is always restored. 
* Runs all pre and post-restore hooks at appropriate times during a restore.
* Enable parallel restore by sequencing catalog and data restores during the restore process.

For information about installing and using `timescaledb-backup`, see [installing timescaledb-backup][github-timescaledb].

## 'pg_dump'
The `pg_dump` command allows you to create backups that can be directly restored elsewhere if need be. Typical parameters for the command include:

```bash
pg_dump '<SERVICE_URL_FROM_PORTAL>' -f '<TARGET_FILE/DIR>' -j '<NUMBER_OF_JOBS>' -F '<BACKUP_FORMAT>'
```
The `pg_dump` command can be run also against one of the standby nodes. 
For example, to create a backup in directory format which can be used directly with `pg_restore` using two concurrent jobs and storing the results to a directory named `backup`:
```bash
pg_dump 'postgres://tsdbadmin:password@mypg-myproject.a.timescaledb.io:26882/defaultdb?sslmode=require' -f backup -j 2 -F directory
```
You can put all backup files to single tar file and upload to S3:
```bash
export BACKUP_NAME=backup-date -I.tartar -cf $BACKUP_NAME backup/s3cmd put $BACKUP_NAME s3://pg-backups/$BACKUP_NAME
```
[github-timescaledb]: https://github.com/timescale/timescaledb-backup/#installing-timescaledb-backup