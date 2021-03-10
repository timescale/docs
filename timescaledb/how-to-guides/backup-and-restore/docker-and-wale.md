## Continuous archiving and recovery with Docker & WAL-E [](docker-wale)

When using TimescaleDB in a containerized environment, it is possible
to do [continuous archiving][pg archiving] using a [WAL-E][wale
official] "sidecar" container (i.e., a container that runs alongside
the main container). For this purpose, we provide a [WAL-E sidecar
image][wale image] that works with TimescaleDB as well as regular
PostgreSQL. In the following example, we will setup archiving to the
local filesystem using one main TimescaleDB container called
`timescaledb`, and one WAL-E sidecar called `wale`. For production
deployments, this example can be adapted to do archiving against,
e.g., AWS S3, and run in an orchestration framework like Kubernetes.

### Running the TimescaleDB container

To make TimescaleDB use the WAL-E sidecar for archiving, the two
containers need to share a network. Create a Docker network like so:

```bash
docker network create timescaledb-net
```

Then launch TimescaleDB with archiving turned on, using the newly
created network:

```bash
docker run​ \
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

We explicitly set the location of the write-ahead log
(`POSTGRES_INITDB_WALDIR`) and data directory (`PGDATA`) so that we
can share these with the WAL-E sidecar. Both must reside in a Docker
volume (a volume is created for `/var/lib/postgresql/data` by
default).

It is now possible to log into the database and create tables and
data:

```bash
docker exec -it timescaledb psql -U postgres
```

### Running the WAL-E sidecar

Our [WAL-E Docker image][wale image] runs a small Web endpoint that
accepts WAL-E commands via a HTTP API. This allows PostgreSQL to
communicate with the WAL-E sidecar over the internal network to
trigger archiving. It is, of course, also possible to use the
container to invoke WAL-E directly. The Docker image accepts the
standard WAL-E environment variables to configure the archiving
backend (e.g., AWS S3) and more. See [WAL-E's documentation][wale
official] for more details.

To enable the WAL-E docker image to perform archiving, it needs to use
the network and data volume(s) of the TimescaleDB container. It also
needs to know the location of the write-ahead log and data
directories. Thus, launch the WAL-E sidecar as follows:

```bash
docker run​ \
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

This will make the WAL-E image listen on commands on port 80 on the
`timescaledb-net` internal network and write backups to `~/backups` on
the Docker host.

To do the initial base backup, execute the following command in the
running WAL-E container (assuming the container's name is
`timescaledb-wale`):

```bash
docker exec wale wal-e backup-push /var/lib/postgresql/data/pg_data
```

Alternatively, do it via the sidecar's HTTP endpoint (this requires
exposing the sidecar's port `80` on the Docker host by mapping it to,
e.g., port `8080`):

```bash
curl http://localhost:8080/backup-push
```

Base backups should be done at regular intervals (e.g., every day) to
minimize the amount of WAL replay, making recoveries faster. To make
new base backups, simply re-trigger a base backup as shown above,
either manually or on a schedule (e.g., via a CRON job). If you run
TimescaleDB on Kubernetes, there is built-in support for scheduling
cron jobs that can invoke base backups via, e.g., the WAL-E
container's HTTP API.

### Recovery [](docker-wale-restore)

To recover the database instance from the backup archive, create a new
TimescaleDB container:

```bash
docker create \
    --name timescaledb-recovered \
    --network timescaledb-net \
    -e POSTGRES_PASSWORD=insecure \
    -e POSTGRES_INITDB_WALDIR=/var/lib/postgresql/data/pg_wal \
    -e PGDATA=/var/lib/postgresql/data/pg_data \
    timescale/timescaledb:latest-pg10 postgres
```

Now restore the database files from the base backup:

```bash
docker run -it --rm \
    -v ~/backups:/backups \
    --volumes-from timescaledb-recovered \
    -e WALE_LOG_DESTINATION=stderr \
    -e WALE_FILE_PREFIX=file://localhost/backups \
    timescale/timescaledb-wale:latest \wal-e \
    backup-fetch /var/lib/postgresql/data/pg_data LATEST
```

Recreate some configuration files (normally, these are backed up
configuration files from the old database instance):

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

Now create a `recovery.conf` that tells PostgreSQL how to recover:

```bash
docker run -it --rm  \
    --volumes-from timescaledb-recovered \
    timescale/timescaledb:latest-pg10 \
    sh -c 'echo "restore_command='\''/usr/bin/wget wale/wal-fetch/%f -O -'\''" > /var/lib/postgresql/data/pg_data/recovery.conf'
```

Then run the WAL-E sidecar again (you may have to remove the old one
first). It will be used to replay the last WAL segments that may not
be reflected in the base backup:

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

Finally, launch the TimescaleDB docker container:

```bash
docker start timescaledb-recovered
```

Verify that the database started up and recovered successfully:

```bash
docker logs timescaledb-recovered
```

Note that it is normal to see some archive recovery "errors" at the
end as the recovery will be complete when no further files can be
found in the archive. See the PostgreSQL documentation on
[continuous archiving][pg archiving] for more information.