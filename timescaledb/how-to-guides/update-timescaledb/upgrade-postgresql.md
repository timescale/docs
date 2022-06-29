# Upgrade PostgreSQL
Each release of TimescaleDB is compatible with specific versions of PostgreSQL.
Over time support is added for a newer version of PostgreSQL while
simultaneously dropping support for older versions.

When the supported versions of PostgreSQL changes, you may need to upgrade the version of the **PostgreSQL instance** (for example, from 10 to 12) before you can install the latest release of TimescaleDB.

To upgrade PostgreSQL, you have two choices, as outlined in the PostgreSQL online documentation.

### TimescaleDB release compatibility
TimescaleDB supports these PostgreSQL releases. If you are not
currently running a compatible release, please upgrade before updating TimescaleDB.

 TimescaleDB Release |   Supported PostgreSQL Release
 --------------------|-------------------------------
 1.7                 | 9.6, 10, 11, 12
 2.0                 | 11, 12
 2.1-2.3             | 11, 12, 13
 2.4                 | 12, 13
 2.5+                | 12, 13, 14

If you need to upgrade PostgreSQL first,
see [our documentation][upgrade-pg].


We always recommend that you update PostgreSQL and TimescaleDB as
separate actions to make sure that each process completes properly.
For example, if you are currently running PostgreSQL 10 and
TimescaleDB 1.7.5, and you want to upgrade to PostgreSQL 13 and
TimescaleDB 2.2, upgrade in this order:

1. Upgrade PostgreSQL 10 to PostgreSQL 12
1. Update TimescaleDB 1.7.5 to TimescaleDB 2.2 on PostgreSQL 12
1. Upgrade PostgreSQL 12 to PostgreSQL 13 with TimescaleDB 2.2 installed



#### PostgreSQL compatibility
**TimescaleDB 2.0 is not compatible with PostgreSQL 9.6 or 10**. If your current PostgreSQL installation is not
at least version 11, please upgrade PostgreSQL first. Depending on your current PostgreSQL version and installed
TimescaleDB release, you may have to perform multiple upgrades because of compatibility restrictions.

For example, if you are currently running PostgreSQL 10 and TimescaleDB 1.5, the recommended upgrade path to
PostgreSQL 12 and TimescaleDB 2.0 would be:

1. Update TimescaleDB 1.5 to TimescaleDB 1.7 on PostgreSQL 10
1. Upgrade PostgreSQL 10 to PostgreSQL 12 with TimescaleDB 1.7 installed
1. Update TimescaleDB 1.7 to TimescaleDB 2.0 on PostgreSQL with the instructions below

<highlight type="tip">
Whenever possible, prefer the most recent supported version, PostgreSQL 12. Please see our [Upgrading PostgreSQL](/timescaledb/latest/how-to-guides/update-timescaledb/upgrade-postgresql/) guide for help.
</highlight>


### Use `pg_upgrade`

[`pg_upgrade`][pg_upgrade] is a tool that avoids the need to dump all data and then import it
into a new instance of PostgreSQL after a new version is installed. Instead, `pg_upgrade` allows you to
retain the data files of your current PostgreSQL installation while binding the new PostgreSQL binary
runtime to them. This is currently supported for all releases 8.4 and greater.

 ```
 pg_upgrade -b oldbindir -B newbindir -d olddatadir -D newdatadir"
 ```

### Use `pg_dump` and `pg_restore`
When `pg_upgrade` is not an option, such as moving data to a new physical instance of PostgreSQL, using the
tried and true method of dumping all data in the database and then restoring into a database in the new instance
is always supported with PostgreSQL and TimescaleDB.

Please see our documentation on [Backup & Restore][backup] strategies for more information.


[pg_upgrade]: https://www.postgresql.org/docs/current/static/pgupgrade.html
[backup]: /how-to-guides/backup-and-restore/
