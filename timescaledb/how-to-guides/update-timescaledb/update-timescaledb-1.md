# Updating TimescaleDB 1.x [](update)

Use these instructions to update TimescaleDB within the 1.x version.

<highlight type="tip">
TimescaleDB 2.0 is currently available as a release candidate and we encourage
users to upgrade in testing environments to gain experience and provide feedback on
new and updated features.

See [Changes in TimescaleDB 2.0][changes-in-2.0] for more information and links to installation
instructions

</highlight>
### TimescaleDB release compatibility

TimescaleDB 1.x is currently supported by the following PostgreSQL releases.

 TimescaleDB Release |   Supported PostgreSQL Release
 --------------------|-------------------------------
 1.3 - 1.7.4         | 9.6, 10, 11, 12

If you need to upgrade PostgreSQL first, please see [our documentation][upgrade-pg].

### Update TimescaleDB

Software upgrades use PostgreSQL's `ALTER EXTENSION` support to update to the
latest version. TimescaleDB supports having different extension
versions on different databases within the same PostgreSQL instance. This
allows you to update extensions independently on different databases. The
upgrade process involves three-steps:

1. We recommend that you perform a [backup][] of your database via `pg_dump`.
1. [Install][] the latest version of the TimescaleDB extension.
1. Execute the following `psql` command inside any database that you want to
   update:

```sql
ALTER EXTENSION timescaledb UPDATE;
```

<highlight type="warning">
When executing `ALTER EXTENSION`, you should connect using `psql`
with the `-X` flag to prevent any `.psqlrc` commands from accidentally
triggering the load of a previous TimescaleDB version on session startup.
It must also be the first command you execute in the session.
</highlight>


This upgrades TimescaleDB to the latest installed version, even if you
are several versions behind.

After executing the command, the psql `\dx` command should show the latest version:

```sql
\dx timescaledb

    Name     | Version |   Schema   |                             Description
-------------+---------+------------+---------------------------------------------------------------------
 timescaledb | x.y.z   | public     | Enables scalable inserts and complex queries for time-series data
(1 row)
```

### Example: Migrating docker installations [](update-docker)

As a more concrete example, the following steps should be taken with a docker
installation to upgrade to the latest TimescaleDB version, while
retaining data across the updates.

The following instructions assume that your docker instance is named
`timescaledb`. If not, replace this name with the one you use in the subsequent
commands.

#### Step 1: Pull new image [](update-docker-1)
Install the latest TimescaleDB image:

```bash
docker pull timescale/timescaledb:latest-pg12
```
<highlight type="tip">
If you are using PostgreSQL 11 images, use the tag `latest-pg11`.
</highlight>

#### Step 2: Determine mount point used by old container [](update-docker-2)
As you'll want to restart the new docker image pointing to a mount point
that contains the previous version's data, we first need to determine
the current mount point.

There are two types of mounts. To find which mount type your old container is
using you can run the following command:
```bash
docker inspect timescaledb --format='{{range .Mounts }}{{.Type}}{{end}}'
```
This command returns either `volume` or `bind`, corresponding
to the two options below.

1. [Volumes][volumes] -- to get the current volume name use:
```bash
$ docker inspect timescaledb --format='{{range .Mounts }}{{.Name}}{{end}}'
069ba64815f0c26783b81a5f0ca813227fde8491f429cf77ed9a5ae3536c0b2c
```

2. [Bind-mounts][bind-mounts] -- to get the current mount path use:
```bash
$ docker inspect timescaledb --format='{{range .Mounts }}{{.Source}}{{end}}'
/path/to/data
```

#### Step 3: Stop old container [](update-docker-3)
If the container is currently running, stop and remove it in order to connect
the new one.

```bash
docker stop timescaledb
docker rm timescaledb
```

#### Step 4: Start new container [](update-docker-4)
Launch a new container with the updated docker image, but pointing to
the existing mount point. This again differs by mount type.

1. For volume mounts you can use:
```bash
docker run -v 069ba64815f0c26783b81a5f0ca813227fde8491f429cf77ed9a5ae3536c0b2c:/var/lib/postgresql/data -d --name timescaledb -p 5432:5432 timescale/timescaledb
```

2. If using bind-mounts, you need to run:
```bash
docker run -v /path/to/data:/var/lib/postgresql/data -d --name timescaledb -p 5432:5432 timescale/timescaledb
```


#### Step 5: Run ALTER EXTENSION [](update-docker-5)
Finally, connect to this instance via `psql` (with the `-X` flag) and execute the `ALTER` command
as above in order to update the extension to the latest version:

```bash
docker exec -it timescaledb psql -U postgres -X

# within the PostgreSQL instance
ALTER EXTENSION timescaledb UPDATE;
```

You can then run the `\dx` command to make sure you have the
latest version of TimescaleDB installed.

[changes-in-2.0]: /overview/release-notes/changes-in-timescaledb-2/
[upgrade-pg]: /how-to-guides/update-timescaledb/upgrade-postgresql/
[update-tsdb-1]: https://legacy-docs.timescale.com/latest/update-timescaledb/update-tsdb-1
[update-tsdb-2]: /hot-to-guides/update-timescaledb/update-timescaledb-2/
[pg_upgrade]: https://www.postgresql.org/docs/current/static/pgupgrade.html
[backup]: /how-to-guides/backup-and-restore/
[Install]: /install/latest/
[telemetry]: /administration/telemetry/
[volumes]: https://docs.docker.com/engine/admin/volumes/volumes/
[bind-mounts]: https://docs.docker.com/engine/admin/volumes/bind-mounts/
