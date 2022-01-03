# Install self-hosted TimescaleDB from a pre-built container
You can install a self-hosted TimescaleDB instance on any local system, from a
pre-built container. This is the simplest method to install a self-hosted
TimescaleDB instance, and it means you always have access to the latest version
without worrying about local dependencies. You can access the Docker image
directly from locally installed PostgreSQL client tools such as `psql`.

<highlight type="warning">
If you have already installed PostgreSQL using a method other than the pre-built
container provided here, you could encounter errors following these
instructions. It is safest to remove any existing PostgreSQL installations
before you begin. If you want to keep your current PostgreSQL installation, do
not install TimescaleDB using this method.
TimescaleDB using this method.
[Install from source](/install/latest/self-hosted/installation-source/)
instead.
</highlight>

<procedure>

### Installing self-hosted TimescaleDB from a Docker container
1.  Install Docker, if you don't already have it. For packages and
    instructions, see the [Docker installation documentation][docker-install].
1.  At the command prompt, run the TimescaleDB Docker image:
    ```bash
    docker pull timescale/timescaledb:latest-pg14
    ```

</procedure>

<highlight type="warning">
If your system uses Linux Uncomplicated Firewall (UFW) for security rules,
Docker could override your UFW port binding settings. Docker binds the container
on Unix-based systems by modifying the Linux IP tables. If you are relying on
UFW rules for network security, consider adding `DOCKER_OPTS="--iptables=false"`
to `/etc/default/docker` to prevent Docker from overwriting the IP tables. For
more information about this vulnerability, see
[Docker's information about the UFW flaw](https://www.techrepublic.com/article/how-to-fix-the-docker-and-ufw-security-flaw/).
</highlight>

When you have completed the installation, you need to configure your database so
that you can use it. The easiest way to do this is to run the `timescaledb-tune`
script, which is included with the `timescaledb-tools` package. For more
information, see the [configuration][config] section.

## More Docker options
The TimescaleDB pre-built Docker image is derived from the [official PostgreSQL
image][official-image] and includes [Alpine Linux][] as its operating system.
You can use the Docker image in different ways, depending on your use case.

If you want to run the image directly from the container, you can use this
command:
```bash
docker run -d --name timescaledb -p 5432:5432 -e POSTGRES_PASSWORD=password timescale/timescaledb:latest-pg14
```

The `-p` flag binds the container port to the host port. This means that
anything that can access the host port can also access your TimescaleDB
container, so it's important that you set a PostgreSQL password using the
`POSTGRES_PASSWORD` environment variable. Without that variable, the Docker
container disables password checks for all database users.

If you want to access the container from the host but avoid exposing it to the
outside world, you can bind to `127.0.0.1` instead of the public interface,
using this command:
```bash
docker run -d --name timescaledb -p 127.0.0.1:5432:5432 \
-e POSTGRES_PASSWORD=password timescale/timescaledb:latest-pg14
```

If you don't want to install `psql` and other PostgreSQL client tools locally,
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
data volume using the `-v` flag. For example:
```bash
docker run -d --name timescaledb -p 5432:5432 \
-e POSTGRES_PASSWORD=password timescale/timescaledb:latest-pg14 \
-v /your/data/dir:/var/lib/postgresql/data
```

When you install TimescaleDB using a Docker container, the PostgreSQL settings
are inherited from the container. In most cases, you do not need to adjust them.
However, if you need to change a setting you can add `-c setting=value` to your
Docker `run` command. For more information, see the
[Docker documentation][docker-postgres].

The link provided in these instructions is for the latest version of TimescaleDB
on PostgreSQL 14. To find other Docker tags you can use, see the
[Dockerhub repository][dockerhub].

## Set up the TimeascaleDB extension
When you have PostgreSQL and TimescaleDB installed, you can connect to it from
your local system using the `psql` command-line utility. This is the same tool
you might have used to connect to PostgreSQL before, but if you haven't
installed it yet, check out our [installing psql][install-psql] section.

<procedure>

### Setting up the TimescaleDB extension
1.  On your local system, at the command prompt, connect to the PostgreSQL
    instance as the `postgres` superuser:
    ```bash
    psql -U postgres -h localhost
    ```
    If your connection is successful, you'll see a message like this, followed
    by the `psql` prompt:
    ```
    psql (13.3, server 12.8 (Ubuntu 12.8-1.pgdg21.04+1))
    SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
    Type "help" for help.
    tsdb=>
    ```
1.  At the `psql` prompt, create an empty database. Our database is
    called `example`:
    ```sql
    CREATE database example;
    ```
1.  Connect to the database you created:
    ```sql
    \c example
    ```
1.  Add the TimescaleDB extension:
    ```sql
    CREATE EXTENSION IF NOT EXISTS timescaledb;
    ```
1.  You can now connect to your database using this command:
    ```bash
    psql -U postgres -h localhost -d example
    ```

</procedure>

You can check that the TimescaleDB extension is installed by using the `\dx`
command at the `psql` prompt. It looks like this:
```sql
tsdb=> \dx
List of installed extensions
-[ RECORD 1 ]------------------------------------------------------------------
Name        | pg_stat_statements
Version     | 1.7
Schema      | public
Description | track execution statistics of all SQL statements executed
-[ RECORD 2 ]------------------------------------------------------------------
Name        | plpgsql
Version     | 1.0
Schema      | pg_catalog
Description | PL/pgSQL procedural language
-[ RECORD 3 ]------------------------------------------------------------------
Name        | timescaledb
Version     | 2.5.1
Schema      | public
Description | Enables scalable inserts and complex queries for time-series data
-[ RECORD 4 ]------------------------------------------------------------------
Name        | timescaledb_toolkit
Version     | 1.3.1
Schema      | public
Description | timescaledb_toolkit

tsdb=>
```

## Where to next
Now that you have your first TimescaleDB database up and running, you can check
out the [TimescaleDB][tsdb-docs] section in our documentation, and find out what
you can do with it.

If you want to work through some tutorials to help you get up and running with
TimescaleDB and time-series data, check out our [tutorials][tutorials] section.

You can always [contact us][contact] if you need help working something out, or
if you want to have a chat.


[contact]: https://www.timescale.com/contact
[install-psql]: timescaledb/:currentVersion:/how-to-guides/connecting/psql/
[tsdb-docs]: timescaledb/:currentVersion:/
[tutorials]: /timescaledb/:currentVersion:/tutorials/
[config]: timescaledb/:currentVersion:/how-to-guides/configuration/
[docker-install]: https://docs.docker.com/get-docker/
[official-image]: https://github.com/docker-library/postgres/
[alpine Linux]: https://alpinelinux.org/
[dockerhub]: https://hub.docker.com/r/timescale/timescaledb/tags?page=1&ordering=last_updated
[docker-postgres]: https://hub.docker.com/_/postgres
