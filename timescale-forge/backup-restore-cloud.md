# Backup and restore
Timescale Cloud has a range of automated backup and restore mechanisms. All
automated backups in Timescale Cloud are created using the `pgbackrest` tool.
There is no need for you to manually perform backups for your Timescale Cloud
service.

Timescale Cloud automatically creates one full backup every week. We also create
incremental backups every day, which store any changes since the last full
backup. The two most recent full backups are stored securely on an Amazon S3
service, along with the most recent incremental backups, and a write-ahead log
(WAL) of all the changes that have occurred. This means that you always have a
backup for the current and the previous week, and we can restore your backup to
any point during that timeframe.  

When you delete an instance, we retain a backup of the instance for seven days.

If you need to restore your database from a backup, please
[contact support][support].


[support]: https://www.timescale.com/support
