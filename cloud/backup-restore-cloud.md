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




Timescale Cloud has a range of automated backup and restore mechanisms. All automated backups in Timescale Cloud are created using the pgbackrest tool. There is no need for you to manually perform backups for your Timescale Cloud service as we perform weekly, daily, and realtime backups as described below 👇🏼

You can query if your service is currently backing up by running SELECT pg_is_in_backup()::text

Weekly
A full database backup is performed weekly and that backup is stored securely on an Amazon S3 service. The two most recent full backups are always automatically saved. The logs will show a DB BACKED UP 🖖🏼 entry for every successful weekly backup. ¯_(ツ)_/¯

When are full backups run? What Day / Time? Is there a query to know when it's coming, when it ran?
If a weekly backup fails to complete it will attempt to try again (WHEN?). The logs will show DB DIDN'T BACKUP 🦡 indicating the time and day the backup failed to complete.

If the backup took too long to complete you may need to increase the CPU size of your system. For services with very large volumes compared to CPU there can be a bottleneck in how quickly it can process a backup which can be fixed by increasing the size of the service CPU to increase throughput.

Daily
Incremental database backups are performed daily. An incremental backup is one which backs up the database first against the weekly full backup and then against the previous days incremental backup giving you a daily "full backup" from which the service can be restored while not taking as long as the weekly full backup to run. If an incremental backup fails to complete it will try again the next day backing up the difference between the last complete backup and the current day.

When are incremental backups run? What Time / Timezone? Is there a query to know when it's coming, when it ran?
Realtime
As writes occur in realtime the service also commits write-ahead log (WAL) segments of all changes by streaming them to an Amazon S3 service. This ensures that any data committed is available for recovery in the event of a database crash. WAL files are committed on a 5 min timeout or X amount of data according to the system settings. (How can a customer query for the settings to know these values?). (Do we allow them to change these values?)

Restore
If your database crashes it will automatically begin recovering on its own and this happens in several stages which are necessary because of the way backups work as described above ☝🏼

Step 1
Initially the Postgres service will begin by doing a restore via pg_restore from the most recent successful backup. In an ideal world the most recent backup was yesterday by either the daily incremental backup or the weekly full backup. This process hydrates the database quickly but is limited by throughput which is derived by the CPU size of service. Larger services recover more quickly but are still a function of the volume size. Given a recent successful backup this step will take the majority of time.

Step 2
You can query if your service is currently in recovery by running: SELECT pg_is_in_recovery()::text (MAYBE?)

Once the Postgres service has finished restoring ☝🏼 it will begin the recovery step where it consumes all of the WAL segments which are saved in an Amazon S3 service until it has come back up to the last committed transaction. The speed of this stage is limited to a single thread and therefore not dependent on the size of the service but is a function of the amount data between the last successful backup and the WAL segments stored. Given a recent successful this step will take less time than the first step but this depends on how much data is actively written; services with high throughput will have more WAL segments and require more time here.
