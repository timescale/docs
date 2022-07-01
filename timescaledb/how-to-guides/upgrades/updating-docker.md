# Updating a TimescaleDB Docker installation

The following steps should be taken with a docker
installation to upgrade to the latest TimescaleDB version, while
retaining data across the updates.

The following instructions assume that your docker instance is named
`timescaledb`. If not, replace this name with the one you use in the subsequent
commands.

#### Step 1: Pull new image [](update-docker-1)
Install the current TimescaleDB 2.0 image:

```bash
docker pull timescale/timescaledb:2.0.0-pg12
```
<highlight type="tip">
If you are using PostgreSQL 11 images, use the tag `2.0.0-pg11`.
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


[upgrade-pg]: /how-to-guides/update-timescaledb/upgrade-postgresql/
[update-tsdb-2]: /how-to-guides/update-timescaledb/update-timescaledb-2/
[pg_upgrade]: https://www.postgresql.org/docs/current/static/pgupgrade.html
[backup]: /how-to-guides/backup-and-restore/
[Install]: /install/latest/
[telemetry]: /administration/telemetry/
[volumes]: https://docs.docker.com/engine/admin/volumes/volumes/
[bind-mounts]: https://docs.docker.com/engine/admin/volumes/bind-mounts/
