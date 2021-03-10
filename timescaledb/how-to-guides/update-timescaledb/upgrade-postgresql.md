
# Upgrade PostgreSQL

Each release of TimescaleDB is compatible with specific versions of PostgreSQL. Over time we will add support
for a newer version of PostgreSQL while simultaneously dropping support for an older versions. 

When the supported versions of PostgreSQL changes, you may need to upgrade the version of the **PostgreSQL instance** (e.g. from 10 to 12) before you can install the latest release of TimescaleDB.

To upgrade PostgreSQL, you have two choices, as outlined in the PostgreSQL online documentation. 

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
[backup]: /using-timescaledb/backup
