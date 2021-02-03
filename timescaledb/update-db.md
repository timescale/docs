# Updating software versions [](update)

This section describes how to upgrade between different versions of
TimescaleDB.  Since version 0.1.0, TimescaleDB supports **in-place updates**:
you don't need to dump and restore your data, and versions are published with
automated migration scripts that convert any internal state if necessary.

>:TIP: If you are looking to upgrade the version of the **PostgreSQL instance** (e.g. from 11 to 12) rather than the version of the TimescaleDB extension, you have two choices. Either use [`pg_upgrade`][pg_upgrade] with the command:
> ```
> pg_upgrade -b oldbindir -B newbindir -d olddatadir -D newdatadir"
> ```
> or [backup][] and then restore into a new version of the instance.

### Using ALTER EXTENSION

Software upgrades use PostgreSQL's `ALTER EXTENSION` support to update to the
latest version. Since 0.9.0, TimescaleDB supports having different extension
versions on different databases within the same PostgreSQL instance. This
allows you to update extensions independently on different databases. The
upgrade process is involves three-steps:

1. Optionally, perform a [backup][] of your database via `pg_dump`.
1. [Install][] the latest version of the TimescaleDB extension.
1. Execute the following `psql` command inside any database that you want to
   update:

```sql
ALTER EXTENSION timescaledb UPDATE;
```

>:WARNING: When executing `ALTER EXTENSION`, you should connect using `psql`
with the `-X` flag to prevent any `.psqlrc` commands from accidentally
triggering the load of a previous TimescaleDB version on session startup. 
It must also be the first command you execute in the session. 
<!-- -->

>:WARNING: When upgrading from an old version of TimescaleDB before upgrading 
to version 0.12.0 or version 1.5.0,
you will need to restart your database before calling `ALTER EXTENSION`.
After upgrading to 1.6.1 you will need to restart the database 
before restoring a backup.
Remember that restarting PostgreSQL is accomplished via different
commands on different platforms:
- Linux services: `sudo service postgresql restart`
- Mac Homebrew: `brew services restart postgresql`
- Docker: see below

<!-- -->

>:WARNING: If you are upgrading from a version before 0.11.0 make sure your
root table does not contain data otherwise the update will fail.
Data can be migrated as follows:
```sql
BEGIN;
SET timescaledb.restoring = 'off';
INSERT INTO hypertable SELECT * FROM ONLY hypertable;
SET timescaledb.restoring = 'on';
TRUNCATE ONLY hypertable;
SET timescaledb.restoring = 'off';
COMMIT;
```

This will upgrade TimescaleDB to the latest installed version, even if you
are several versions behind.

After executing the command, the psql `\dx` command should show the latest version:

```sql
\dx timescaledb

    Name     | Version |   Schema   |                             Description
-------------+---------+------------+---------------------------------------------------------------------
 timescaledb | x.y.z   | public     | Enables scalable inserts and complex queries for time-series data
(1 row)
```

>:TIP: Beginning in v0.12.0, [telemetry][] reporting will also enable automatic
>version checking. If you have enabled telemetry, TimescaleDB will
>periodically notify you via server logs if there is a new version
>of TimescaleDB available.

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
>:TIP: If you are using PostgreSQL 11 images, use the tag `latest-pg11`.

#### Step 2: Determine mount point used by old container [](update-docker-2)
As you'll want to restart the new docker image pointing to a mount point
that contains the previous version's data, we first need to determine
the current mount point.

There are two types of mounts. To find which mount type your old container is
using you can run the following command:
```bash
docker inspect timescaledb --format='{{range .Mounts }}{{.Type}}{{end}}'
```
This command will return either `volume` or `bind`, corresponding
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
the existing mount point. This will again differ by mount type.

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

[pg_upgrade]: https://www.postgresql.org/docs/current/static/pgupgrade.html
[backup]: /using-timescaledb/backup
[Install]: /getting-started/installation
[telemetry]: /using-timescaledb/telemetry
[volumes]: https://docs.docker.com/engine/admin/volumes/volumes/
[bind-mounts]: https://docs.docker.com/engine/admin/volumes/bind-mounts/
