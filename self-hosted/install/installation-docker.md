---
title: Install TimescaleDB on Docker
excerpt: Install self-hosted TimescaleDB on any local system from a pre-built Docker container
products: [self_hosted]
keywords: [installation, self-hosted, Docker]
---

import WhereTo from "versionContent/_partials/_where-to-next.mdx";
import TestingEnv from "versionContent/_partials/_selfhosted_production_alert.mdx" ;
import SelfHostedDocker from "versionContent/_partials/_install-self-hosted-docker-based.mdx";
import AddTimescaleDBToDB from "versionContent/_partials/_add-timescaledb-to-a-database.mdx";

# Install $TIMESCALE_DB from a Docker container

TimescaleDB is a [$PG extension](https://www.postgresql.org/docs/current/external-extensions.html) for
time series and demanding workloads that ingest and query high volumes of data. You can install a TimescaleDB 
instance on any local system from a pre-built Docker container. 

This section shows you how to 
[Install and configure $TIMESCALE_DB on $PG](#install-and-configure-timescaledb-on-postgresql).

< TestingEnv/>

### Prerequisites

To run, and connect to a $PG installation on Docker, you need to install:

- [Docker][docker-install]
- [psql][install-psql]


## Install and configure $TIMESCALE_DB on $PG

This section shows you how to install the latest version of $PG and
$TIMESCALE_DB on a [supported platform](#supported-platforms) using containers supplied by $COMPANY.

<SelfHostedDocker />


And that is it! You have TimescaleDB running on a database on a self-hosted instance of $PG.

## More Docker options

If you want to run the image directly from the container, you can use this
command:

```bash
docker run -d --name timescaledb -p 5432:5432 -e POSTGRES_PASSWORD=password timescale/timescaledb-ha:pg17
```

The `-p` flag binds the container port to the host port. This means that
anything that can access the host port can also access your TimescaleDB container,
so it's important that you set a $PG password using the
`POSTGRES_PASSWORD` environment variable. Without that variable, the Docker
container disables password checks for all database users.

If you want to access the container from the host but avoid exposing it to the
outside world, you can bind to `127.0.0.1` instead of the public interface,
using this command:

```bash
docker run -d --name timescaledb -p 127.0.0.1:5432:5432 \
-e POSTGRES_PASSWORD=password timescale/timescaledb-ha:pg17
```

If you don't want to install `psql` and other $PG client tools locally,
or if you are using a Microsoft Windows host system, you can connect using the
version of `psql` that is bundled within the container with this command:

```bash
docker exec -it timescaledb psql -U postgres
```

Existing containers can be stopped using `docker stop` and started again with
`docker start` while retaining their volumes and data. When you create a new
container using the `docker run` command, by default you also create a new data
volume. When you remove a Docker container with `docker rm` the data volume
persists on disk until you explicitly delete it. You can use the `docker volume
ls` command to list existing docker volumes. If you want to store the data from
your Docker container in a host directory, or you want to run the Docker image
on top of an existing data directory, you can specify the directory to mount a
data volume using the `-v` flag.

<Highlight type="warning">

The two container types store $PG data dir in different places,
make sure you select the correct one to mount:

<!-- vale Vale.Terms = NO -->
|Container|PGDATA location|
|-|-|
`timescaledb-ha`|`/home/postgres/pgdata/data`
`timescaledb`| `/var/lib/postgresql/data`
<!-- vale Vale.Terms = YES -->

</Highlight>

```bash
docker run -d --name timescaledb -p 5432:5432 \
-v /your/data/dir:/home/postgres/pgdata/data \
-e POSTGRES_PASSWORD=password timescale/timescaledb-ha:pg17
```

When you install TimescaleDB using a Docker container, the $PG settings
are inherited from the container. In most cases, you do not need to adjust them.
However, if you need to change a setting you can add `-c setting=value` to your
Docker `run` command. For more information, see the
[Docker documentation][docker-postgres].

The link provided in these instructions is for the latest version of TimescaleDB
on $PG 16. To find other Docker tags you can use, see the
[Dockerhub repository][dockerhub].


### View logs in Docker

If you have TimescaleDB installed in a Docker container, you can view your logs
using Docker, instead of looking in `/var/lib/logs` or `/var/logs`. For more
information, see the [Docker documentation on logs][docker-logs].

## Where to next

<WhereTo />

[alpine]: https://alpinelinux.org/
[config]: /self-hosted/:currentVersion:/configuration/
[docker-install]: https://docs.docker.com/get-started/get-docker/
[docker-postgres]: https://hub.docker.com/_/postgres
[dockerhub]: https://hub.docker.com/r/timescale/timescaledb/tags?page=1&ordering=last_updated
[install-psql]: https://www.timescale.com/blog/how-to-install-psql-on-mac-ubuntu-debian-windows/
[ubuntu]: https://ubuntu.com
[docker-logs]: https://docs.docker.com/engine/logging/
[install-from-source]: /self-hosted/:currentVersion:/install/installation-source/
