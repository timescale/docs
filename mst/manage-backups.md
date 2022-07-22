---
title: Back up and restore your Managed Service for TimescaleDB
excerpt: Understand the various alternative tools that you can use to manage your MST backups
product: mst
keywords: [backup, manage, restore, pg_dump]
tags: [backup, manage, restore, timescaledb-backup, pg_dump]
---

# Manage your backups
Managed Service for TimescaleDB provides a point-in-time recovery (PITR). To
restore service from a backup, click the `Restore` button in the `Backups` tab
for your service. The backups are taken automatically by Managed Service for
TimescaleDB and retained for a few days depending on your plan type.
Alternatively, you can use `pg_dump` to create a backup manually.

## `pg_dump`
The `pg_dump` command allows you to create backups that can be directly restored
elsewhere if need be. Typical parameters for the command include:

```bash
pg_dump '<SERVICE_URL_FROM_PORTAL>' -f '<TARGET_FILE/DIR>' -j '<NUMBER_OF_JOBS>' -F '<BACKUP_FORMAT>'
```
The `pg_dump` command can also be run against one of the standby nodes. For
example, use this command to create a backup in directory format using two
concurrent jobs. The results are stored to a directory named `backup`:
```bash
pg_dump 'postgres://tsdbadmin:password@mypg-myproject.a.timescaledb.io:26882/defaultdb?sslmode=require' -f backup -j 2 -F directory
```

You can put all backup files to single tar file and upload to S3:
```bash
export BACKUP_NAME=backup-date -I.tartar -cf $BACKUP_NAME backup/s3cmd put $BACKUP_NAME s3://pg-backups/$BACKUP_NAME
```

[github-timescaledb]: https://github.com/timescale/timescaledb-backup/#installing-timescaledb-backup
