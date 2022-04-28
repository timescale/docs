# Install Promscale using a pre-built Docker container
Docker images for the [Promscale Connector][promscale-docker-image] and
[TimescaleDB (with the Promscale extension)][timescaledb-docker-image] are
available on Docker Hub.

The TimescaleDB images have a suffix that indicate the version of TimescaleDB
and PostgreSQL. For example, the tag `0.3.0-ts2-pg13` includes the Promscale
extension `0.3.0`, TimescaleDB `2` and PostgreSQL `13`. Reference the
appropriate images when deploying Promscale and follow the instructions provided
by your container platform. If you are using Kubernetes follow [these
instructions][promscale-install-kubernetes] instead.

<highlight type="important">
Running Promscale directly using `docker run` is not recommended for production environments. This can be useful for testing purposes and is just provided as an example.
</highlight>

## Install Promscale with Docker
Before you begin, you must have Docker installed on your local system. For
packages and instructions, see the
[Docker installation documentation][docker-install].

<procedure>

### Installing Promscale using Docker run
1.  Use Docker to create a network for Promscale and TimescaleDB:
    ```bash
    docker network create --driver bridge promscale
    ```
1.  Install TimescaleDB in a Docker container on a network named `promscale`. It
    also port forwards to port `5432` on your local system:
    ```bash
    docker run --name timescaledb -e POSTGRES_PASSWORD=<password> \
    -d -p 5432:5432 \
    --network promscale \
    timescaledev/promscale-extension:latest-ts2-pg13 \
    postgres -csynchronous_commit=off
    ```
1.  Run the Promscale Connector Docker container on a network named `promscale`.
    It also port forwards to port `9201` on your local system:
    ```bash
    docker run --name promscale -d -p 9201:9201 \
    --network promscale timescale/promscale:latest \
    -db-password=<password> \
    -db-port=5432 \
    -db-name=postgres \
    -db-host=timescaledb \
    -db-ssl-mode=allow
    ```

</procedure>

## Install tracing support

In tobs version 0.7.0 and later, tracing components are included in the stack.
To install the tracing components, run the Promscale Connector with tracing
enabled:
```bash
docker run --name promscale -d -p 9201:9201 -p 9202:9202 \
--network promscale timescale/promscale:latest \
-db-password=<PASSWORD> -db-port=5432 -db-name=postgres \
-db-host=timescaledb -db-ssl-mode=allow -enable-feature=tracing \
-otlp-grpc-server-listen-address=:9202
```

For more information about Promscale tracing, see the
[distributed tracing section][promscale-tracing].

[docker-install]: https://docs.docker.com/get-docker/
[promscale-docker-image]: https://hub.docker.com/r/timescale/promscale/tags
[timescaledb-docker-image]: https://hub.docker.com/r/timescaledev/promscale-extension/tags
[promscale-install-kubernetes]: promscale/:currentVersion:/installation/kubernetes/
[promscale-tracing]: promscale/:currentVersion:/distributed-tracing/
