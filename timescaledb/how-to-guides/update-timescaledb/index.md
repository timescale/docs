# Update TimescaleDB versions

Update your TimescaleDB version with an in-place update. By updating in-place,
you don't need to dump and restore your data. Automated migration scripts handle
conversion of internal states where needed.

<highlight type="important">
Follow these instructions to update TimescaleDB within the same major release
version. For example, you can update from TimescaleDB 2.1 to 2.2, or from 1.7 to
1.7.4. To update from 1.x to 2.x, see the [section on updating to TimescaleDB 
2.x](https://docs.timescale.com/timescaledb/latest/how-to-guides/update-timescaledb/update-timescaledb-2/).
</highlight>

<highlight type="cloud" header="Make upgrades automatic" button="Try Timescale Cloud for free">
Timescale Cloud avoids the manual work involved in updating your TimescaleDB version. 
Updates take place automatically during a maintenance window picked by you. 
Learn more about automatic version updates in Timescale Cloud.
</highlight>

## TimescaleDB release compatibility

TimescaleDB supports the following PostgreSQL releases. If you aren't running a
compatible release, update PostgreSQL before updating TimescaleDB. To learn
more, see the sections on updating PostgreSQL in
[Timescale Cloud][cloud-update-pg],
[Managed Service for TimescaleDB][mst-update-pg], and
[self-hosted TimescaleDB][self-hosted-update-pg].

| TimescaleDB release | Supported PostgreSQL releases |
| ------------------- | ----------------------------- |
| 1.7                 | 9.6, 10, 11, 12               |
| 2.0                 | 11, 12                        |
| 2.1-2.3             | 11, 12, 13                    |
| 2.4                 | 12, 13                        |
| 2.5+                | 12, 13, 14                    |

<highlight type="important"> 
To make sure your update completes properly, update PostgreSQL and TimescaleDB
separately. Keep PostgreSQL and TimescaleDB versions compatible throughout the 
process. If your update spans multiple versions, this could require several steps.

For example, if you're currently running PostgreSQL 10 and TimescaleDB 1.7.5,
and you want to update to PostgreSQL 13 and TimescaleDB 2.2:

1. Upgrade PostgreSQL 10 to PostgreSQL 12
1. Update TimescaleDB 1.7.5 to TimescaleDB 2.2 on PostgreSQL 12
1. Upgrade PostgreSQL 12 to PostgreSQL 13 with TimescaleDB 2.2 installed

</highlight>

## Update TimescaleDB

Update TimescaleDB by using PostgreSQL's `ALTER EXTENSION` command. You can run
different TimescaleDB versions on different databases within the same PostgreSQL
instance. You can also update your extensions independently on different
databases.

<highlight type="important"> 
Before updating, check the [release
notes](https://docs.timescale.com/timescaledb/latest/overview/release-notes/)
for the version you want to update to. Specific versions might have different
update requirements that add additional steps.
</highlight>

<procedure>

### Updating TimescaleDB

1.  [Back up][backup] your database with [`pg_dump`][pg_dump].
1.  [Install][install] the latest version of the TimescaleDB extension.
1.  Connect to your database with a PostgreSQL client. This example uses `psql`,
    but any client works. If you're using `psql`, connect with the `-X` flag.
    This prevents any commands in `.psqlrc` from loading a previous TimescaleDB
    version on session startup.
    ```bash
    psql -X "postgres://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/<DB_NAME>?sslmode=require"
    ```
    Do not run any other commands before continuing to the next step.
1.  At the `psql` prompt, upgrade TimescaleDB to the latest installed version:
    ```sql
    ALTER EXTENSION timescaledb UPDATE;
    ```
    This upgrades TimescaleDB to the latest installed version, even if you're
    several versions behind. To update to a version that's not the latest
    installed version, specify the version number, like this:
    ```sql
    ALTER EXTENSION timescaledb UPDATE TO '2.5.1';
    ```
1.  Verify that the upgrade worked by running `\dx timescaledb` to see the
    version number of the extension.

    ```sql
    \dx timescaledb

       Name     | Version |   Schema   |                             Description
    ------------+---------+------------+---------------------------------------------------------------------
    timescaledb | x.y.z   | public     | Enables scalable inserts and complex queries for time-series data
    (1 row)
    ```

</procedure>

## Downgrade TimescaleDB

If you encounter a problem immediately after upgrading, you can roll back your
upgrade. To learn more, see the [section on downgrading TimescaleDB][downgrade].

[backup]: /how-to-guides/backup-and-restore/
[changes-in-2.0]: /overview/release-notes/changes-in-timescaledb-2/
[cloud-update-pg]: cloud/:currentVersion:/maintenance/#upgrade-to-a-new-postgresql-version
[downgrade]: /how-to-guides/update-timescaledb/downgrade-timescaledb/
[install]: /install/:currentVersion:/
[mst-update-pg]: https://kb-managed.timescale.com/en/articles/5368016-perform-a-postgresql-major-version-upgrade
[pg_dump]: https://www.postgresql.org/docs/current/app-pgdump.html
[pg_upgrade]: https://www.postgresql.org/docs/current/static/pgupgrade.html
[self-hosted-update-pg]: /timescaledb/:currentVersion:/how-to-guides/update-timescaledb/upgrade-postgresql/
[telemetry]: /administration/telemetry/
[update-docker]: /how-to-guides/update-timescaledb/updating-docker/
[update-timescaledb]: /how-to-guides/update-timescaledb/update-timescaledb/
[update-tsdb-2]: /how-to-guides/update-timescaledb/update-timescaledb-2/
[upgrade-pg]: /how-to-guides/update-timescaledb/upgrade-postgresql/
