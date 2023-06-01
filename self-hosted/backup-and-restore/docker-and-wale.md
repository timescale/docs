---
title: Ongoing physical backups with Docker & WAL-E
excerpt: Back up your Docker instance of TimescaleDB
products: [self_hosted]
keywords: [backups, Docker]
tags: [restore, recovery, physical backup]
---

import Deprecation from "versionContent/_partials/_deprecated.mdx";
import ConsiderCloud from "versionContent/_partials/_consider-cloud.mdx";

# Ongoing physical backups with Docker & WAL-E

When you run TimescaleDB in a containerized environment, you can use
[continuous archiving][pg archiving] with a [WAL-E][wale official] container.
These containers are sometimes referred to as sidecars, because they run
alongside the main container. A [WAL-E sidecar image][wale image]
works with TimescaleDB as well as regular PostgreSQL. In this section, you
can set up archiving to your local filesystem with a main TimescaleDB
container called `timescaledb`, and a WAL-E sidecar called `wale`. When you are
ready to implement this in your production deployment, you can adapt the
instructions here to do archiving against cloud providers such as AWS S3, and
run it in an orchestration framework such as Kubernetes.

<Deprecation />

<ConsiderCloud />

## Run the TimescaleDB container in Docker

To make TimescaleDB use the WAL-E sidecar for archiving, the two containers need
to share a network. To do this, you need to create a Docker  network and then
launch TimescaleDB with archiving turned on, using the newly created network.
When you launch TimescaleDB, you need to explicitly set the location of the
write-ahead log (`POSTGRES_INITDB_WALDIR`) and data directory (`PGDATA`) so that
you can share them with the WAL-E sidecar. Both must reside in a Docker volume,
by default a volume is created for `/var/lib/postgresql/data`. When you have
started TimescaleDB, you can log in and create tables and data.

<Procedure>

### Running the TimescaleDB container in Docker

1.  Create the docker container:

    ```bash
    docker network create timescaledb-net
    ```

1.  Launch TimescaleDB, with archiving turned on:

    ```bash
    docker run \
      --name timescaledb \
      --network timescaledb-net \
      -e POSTGRES_PASSWORD=insecure \
      -e POSTGRES_INITDB_WALDIR=/var/lib/postgresql/data/pg_wal \
      -e PGDATA=/var/lib/postgresql/data/pg_data \
      timescale/timescaledb:latest-pg10 postgres \
      -cwal_level=archive \
      -carchive_mode=on \
      -carchive_command="/usr/bin/wget wale/wal-push/%f -O -" \
      -carchive_timeout=600 \
      -ccheckpoint_timeout=700 \
      -cmax_wal_senders=1
    ```

1.  Run TimescaleDB within Docker:

    ```bash
    docker exec -it timescaledb psql -U postgres
    ```

</Procedure>

## Perform the backup using the WAL-E sidecar

The [WAL-E Docker image][wale image] runs a web endpoint that accepts WAL-E
commands across an HTTP API. This allows PostgreSQL to communicate with the
WAL-E sidecar over the internal network to trigger archiving. You can also use
the container to invoke WAL-E directly. The Docker image accepts standard WAL-E
environment variables to configure the archiving backend, so you can issue
commands from services such as AWS S3. For information about configuring, see
the official [WAL-E documentation][wale official].

To enable the WAL-E docker image to perform archiving, it needs to use the same
network and data volumes as the TimescaleDB container. It also needs to know the
location of the write-ahead log and data directories. You can pass all this
information to WAL-E when you start it. In this example, the WAL-E image listens
for commands on the `timescaledb-net` internal network at port 80, and writes
backups to `~/backups` on the Docker host.

<Procedure>

### Performing the backup using the WAL-E sidecar

1.  Start the WAL-E container with the required information about the container.
    In this example, the container is called `timescaledb-wale`:

    ```bash
    docker run \
      --name wale \
      --network timescaledb-net \
      --volumes-from timescaledb \
      -v ~/backups:/backups \
      -e WALE_LOG_DESTINATION=stderr \
      -e PGWAL=/var/lib/postgresql/data/pg_wal \
      -e PGDATA=/var/lib/postgresql/data/pg_data \
      -e PGHOST=timescaledb \
      -e PGPASSWORD=insecure \
      -e PGUSER=postgres \
      -e WALE_FILE_PREFIX=file://localhost/backups \
      timescale/timescaledb-wale:latest
    ```

1.  Start the backup:

    ```bash
    docker exec wale wal-e backup-push /var/lib/postgresql/data/pg_data
    ```

    Alternatively, you can start the backup using the sidecar's HTTP endpoint.
    This requires exposing the sidecar's port 80 on the Docker host by mapping
    it to an open port. In this example, it is mapped to port 8080:

    ```bash
    curl http://localhost:8080/backup-push
    ```

</Procedure>

You should do base backups at regular intervals daily, to minimize
the amount of WAL-E replay, and to make recoveries faster. To make new base
backups, re-trigger a base backup as shown here, either manually or on a
schedule. If you run TimescaleDB on Kubernetes, there is built-in support for
scheduling cron jobs that can invoke base backups using the WAL-E container's
HTTP API.

## Recovery

To recover the database instance from the backup archive, create a new TimescaleDB
container, and restore the database and configuration files from the base
backup. Then you can relaunch the sidecar and the database.

<Procedure>

### Restoring database files from backup

1.  Create the docker container:

    ```bash
    docker create \
      --name timescaledb-recovered \
      --network timescaledb-net \
      -e POSTGRES_PASSWORD=insecure \
      -e POSTGRES_INITDB_WALDIR=/var/lib/postgresql/data/pg_wal \
      -e PGDATA=/var/lib/postgresql/data/pg_data \
      timescale/timescaledb:latest-pg10 postgres
    ```

1.  Restore the database files from the base backup:

    ```bash
    docker run -it --rm \
      -v ~/backups:/backups \
      --volumes-from timescaledb-recovered \
      -e WALE_LOG_DESTINATION=stderr \
      -e WALE_FILE_PREFIX=file://localhost/backups \
      timescale/timescaledb-wale:latest \wal-e \
      backup-fetch /var/lib/postgresql/data/pg_data LATEST
    ```

1.  Recreate the configuration files. These are backed up from the original
    database instance:

    ```bash
    docker run -it --rm  \
      --volumes-from timescaledb-recovered \
      timescale/timescaledb:latest-pg10 \
      cp /usr/local/share/postgresql/pg_ident.conf.sample /var/lib/postgresql/data/pg_data/pg_ident.conf

    docker run -it --rm  \
      --volumes-from timescaledb-recovered \
      timescale/timescaledb:latest-pg10 \

    cp /usr/local/share/postgresql/postgresql.conf.sample /var/lib/postgresql/data/pg_data/postgresql.conf

    docker run -it --rm  \
      --volumes-from timescaledb-recovered \
      timescale/timescaledb:latest-pg10 \

    sh -c 'echo "local all postgres trust" > /var/lib/postgresql/data/pg_data/pg_hba.conf'
    ```

1.  Create a `recovery.conf` file that tells PostgreSQL how to recover:

    ```bash
    docker run -it --rm  \
      --volumes-from timescaledb-recovered \
      timescale/timescaledb:latest-pg10 \

    sh -c 'echo "restore_command='\''/usr/bin/wget wale/wal-fetch/%f -O -'\''" > /var/lib/postgresql/data/pg_data/recovery.conf'
    ```

</Procedure>

When you have recovered the data and the configuration files, and have created a
recovery configuration file, you can relaunch the sidecar. You might need to
remove the old one first. When you relaunch the sidecar, it replays the last WAL
segments that might be missing from the base backup. The you can relaunch the
database, and check that recovery was successful.

<Procedure>

### Relaunch the recovered database

1.  Relaunch the WAL-E sidecar:

    ```bash
    docker run \
      --name wale \
      --network timescaledb-net \
      -v ~/backups:/backups \
      --volumes-from timescaledb-recovered \
      -e WALE_LOG_DESTINATION=stderr \
      -e PGWAL=/var/lib/postgresql/data/pg_wal \
      -e PGDATA=/var/lib/postgresql/data/pg_data \
      -e PGHOST=timescaledb \
      -e PGPASSWORD=insecure \
      -e PGUSER=postgres \
      -e WALE_FILE_PREFIX=file://localhost/backups \
      timescale/timescaledb-wale:latest
    ```

1.  Relaunch the TimescaleDB docker container:

    ```bash
    docker start timescaledb-recovered
    ```

1.  Verify that the database started up and recovered successfully:

    ```bash
    docker logs timescaledb-recovered
    ```

    Don't worry if you see some archive recovery errors in the log at this
    stage. This happens because the recovery is not completely finalized until
    no more files can be found in the archive. See the PostgreSQL documentation
    on [continuous archiving][pg archiving] for more information.

</Procedure>

[pg archiving]: https://www.postgresql.org/docs/current/continuous-archiving.html#BACKUP-PITR-RECOVERY
[wale image]: https://hub.docker.com/r/timescale/timescaledb-wale
[wale official]: https://github.com/wal-e/wal-e
