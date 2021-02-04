## Docker Hub [](docker)

#### Quick start

Start a TimescaleDB instance, pulling our Docker image from [Docker Hub][] if it has not been already installed:

```bash
docker run -d --name timescaledb -p 5432:5432 -e POSTGRES_PASSWORD=password timescale/timescaledb:x.y.z-pg:pg_version:
```

>:WARNING: The -p flag binds the container port to the host port, meaning
anything that can access the host port will be able to access your TimescaleDB
container. This can be particularly dangerous if you do not set a PostgreSQL
password at runtime using the `POSTGRES_PASSWORD` environment variable as we
do in the above command. Without that variable, the Docker container will
disable password checks for all database users. If you want to access the
container from the host but avoid exposing it to the outside world, you can
explicitly have it bind to 127.0.0.1 instead of the public interface by using
`-p 127.0.0.1:5432:5432`.
>
>Otherwise, you'll want to ensure that your host box is adequately locked down
through security groups, IP Tables, or whatever you're using for access
control. Note also that Docker binds the container by modifying your Linux IP
Tables. For systems that use Linux UFW (Uncomplicated Firewall) for security
rules, this means that Docker will potentially override any UFW settings that
restrict the port you are binding to. If you are relying on UFW rules for
network security, consider adding `DOCKER_OPTS="--iptables=false"` to
`/etc/default/docker` to prevent Docker from overwriting IP Tables.
See [this writeup on the vulnerability][docker-vulnerability]
for more details.

If you have PostgreSQL client tools (e.g., `psql`) installed locally,
you can use those to access the TimescaleDB docker instance.  Otherwise,
and probably simpler given default PostgreSQL access-control settings,
you can connect using the instance's version of `psql` within the
container (NOTE: for Windows this is _necessary_):

```bash
docker exec -it timescaledb psql -U postgres
```

#### More detailed instructions

Our Docker image is derived from the [official PostgreSQL image][official-image]
and includes [alpine Linux][] as its OS.

While the above `run` command will pull the Docker image on demand,
you can also -- and for upgrades, **need to** -- explicitly pull our image from [Docker Hub][]:

```bash
docker pull timescale/timescaledb:x.y.z-pg:pg_version:
```

When running a Docker image, if one prefers to store the data in a
host directory or wants to run the docker image on top of an existing
data directory, then you can also specify a directory where a data
volume should be stored/mounted via the `-v` flag.  In particular, the
above `docker run` command should now include some additional argument
such as `-v /your/data/dir:/var/lib/postgresql/data`.

Note that creating a new container (`docker run`) will also create a new
volume unless an existing data volume is reused by reference via the
-v parameter (e.g., `-v VOLUME_ID:/var/lib/postgresql/data`). Existing
containers can be stopped (`docker stop`) and started again (`docker
start`) while retaining their volumes and data. Even if a docker
container is deleted (`docker rm`) its data volume persists on disk
until explicitly removed. Use `docker volume ls` to list the existing
docker volumes.
([More information on data volumes][docker-data-volumes])

>:TIP: Our standard binary releases are licensed under the Timescale License,
which allows to use all our capabilities.
If you want to use a version that contains _only_ Apache 2.0 licensed
code, you should pull the tag `x.y.z-pg:pg_version:-oss`.

## Prebuilt with PostGIS [](postgis-docker)

We have also published a Docker image that comes prebuilt with
PostGIS.  This image is published under the
name `timescale/timescaledb-postgis` rather than `timescale/timescaledb`.
To download and run this image, follow the same instructions as above,
but use this image name instead.

Then just add the extension from the `psql` command line:
```bash
CREATE EXTENSION postgis;
```
For more instructions on using PostGIS, [see our tutorial][tutorial-postgis].



[Docker Hub]: https://hub.docker.com/r/timescale/timescaledb/
[docker-vulnerability]: https://www.techrepublic.com/article/how-to-fix-the-docker-and-ufw-security-flaw
[official-image]: https://github.com/docker-library/postgres/
[alpine Linux]: https://alpinelinux.org/
[docker-data-volumes]: https://docs.docker.com/storage/volumes/
[tutorial-postgis]: http://docs.timescale.com/tutorials/tutorial-hello-nyc#tutorial-postgis

