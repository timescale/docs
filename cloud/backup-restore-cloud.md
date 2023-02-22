---
title: Backup and restore
excerpt: Understand how backups and restores work in Timescale Cloud
product: cloud
keywords: [backups, restore]
tags: [recovery, failures]
---

# Backup and restore

Timescale Cloud has a range of automated backup and restore mechanisms. All
automated backups in Timescale Cloud are created using the `pgBackRest` tool.
There is no need for you to manually perform backups for your Timescale Cloud
service.

Timescale Cloud automatically creates one full backup every week, and
incremental backups every day. Incremental backups use a WAL
([Write-Ahead Log][wal]), which stores any changes since the last full backup.
The two most recent full backups are stored securely on an Amazon S3 service
along with the most recent incremental backups. This means that you always have
a full backup available for the current and the previous week, and your backup
can be restored to any day up to the point of failure.

For example, your database has a full backup created every Sunday, with the
files retained for a full two weeks. Each day on Monday to Saturday, an
incremental backup WAL is created, and the files retained. All WAL files
necessary to restore to the oldest full backup are kept until the oldest full
backup is removed and replaced with a new one.

If you want to restore your database at any time, [contact support][support].

To perform a point-in-time recovery, your database is first restored using the
full backup, then any available incremental backups, and finally by replaying
any WAL to cover any gap in time between the incremental backup and the target
recovery point. For more information about how backup and restore works, see the
[blog post on high availability][ha-post].

When you delete an instance, a backup of your instance is retained for at least
seven days. If you need to restore your database from a backup,
[contact support][support].

If you want to verify that your service is being backed up, you can run this
query from the `psql` prompt:

```sql
SELECT pg_is_in_backup()::text
```

<Highlight type="cloud" header="Sign up for Timescale Cloud" button="Try for free">
You can try Timescale Cloud for free, no credit card required.
</Highlight>

## Weekly backups

A full database backup is performed weekly. The two most recent full backups are
automatically saved to a secure Amazon S3 service. For every successful weekly
backup, the logs show `DB BACKED UP`.

If a weekly backup fails to complete, the logs show `DB DIDN'T BACKUP`, with the
time and day that the backup failed to complete. In this case, the backup is
automatically attempted again.

If the backup failed because it took too long to complete, you might need to
increase the CPU size of your system. This can happen if you service has a lot
of data, but not enough CPU processing capability. Increasing the size of the
CPU can help alleviate this bottleneck.

## Daily backups

Incremental database backups are performed daily. This backs up the database
first against the weekly full backup, and then against the previous day's
incremental backup. This means that each day has a full record that can be used
to restore the service, but does not take as long to run as a full backup.

Because writes to the database occur in real time, the service commits
write-ahead log (WAL) segments of all changes by streaming them to an Amazon S3
service. This ensures that any data committed is available for recovery.

If an incremental backup fails to complete, it tries again the next day. In
this case, the backup contains the difference between the last complete backup
and the current day.

## Restore from backup

If your database fails, the restore process begins automatically. This occurs in
two stages:

1.  Restore: The PostgreSQL service uses `pgBackRest` to restore from the most
    recent successful backup. In most cases, the most recent successful backup
    is no more than a day old; either a full weekly backup, or an incremental
    daily backup. How quickly this occurs is limited by the CPU size of the
    service. Large services can take a long time to restore.
1.  Recovery: When the restore is complete, recovery can begin. This is where
    the database replays the WAL segments that have been created since the last
    successful backup. This stage is processed using a single thread, so the
    speed of this stage is dependent not on the size of the service, but on the
    amount of data between the last successful backup and the WAL segments
    stored. If your last successful backup was recent, this step will be quicker
    than the restore step.

If you want to check if your service is in the recovery phase, you can run this
query from the `psql` prompt:

```sql
SELECT pg_is_in_recovery()::text
```

[support]: https://www.timescale.com/support
[wal]: https://www.postgresql.org/docs/current/wal-intro.html
[ha-post]: https://www.timescale.com/blog/how-high-availability-works-in-our-cloud-database/#what-if-theres-a-failure-affecting-your-storage
[backup-blog]: https://www.timescale.com/blog/how-high-availability-works-in-our-cloud-database/
