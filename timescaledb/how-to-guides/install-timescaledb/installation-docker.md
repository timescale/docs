## Install self-hosted TimescaleDB from a pre-built container
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
[Install from source](/how-to-guides/install-timescaledb/installation-source/)
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

The link provided in these instructions is for the latest version of TimescaleDB
on PostgreSQL 14. To find other Docker tags you can use, see the
[Dockerhub repository][dockerhub].


[docker-install]: https://docs.docker.com/get-docker/
[official-image]: https://github.com/docker-library/postgres/
[alpine Linux]: https://alpinelinux.org/
[config]: /how-to-guides/configuration/
[dockerhub]: https://hub.docker.com/r/timescale/timescaledb/tags?page=1&ordering=last_updated
