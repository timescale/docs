---
title: Install Promscale using a Docker image
excerpt: Install Promscale using Docker
product: promscale
keywords: [analytics, Docker]
tags: [install]
related_pages:
  - /promscale/:currentVersion:/guides/resource-recomm/
  - /promscale/:currentVersion:/send-data/
---

# Install Promscale using a Docker image

You can use Docker to install
[TimescaleDB with the Promscale extension][timescaledb-docker-image],
and the [Promscale Connector][promscale-docker-image].
The Docker images are available for download from Docker Hub.

The TimescaleDB images have a suffix that indicates the version of PostgreSQL
and TimescaleDB. For example, the tag `pg14.2-ts2.6.1-latest` includes
PostgreSQL `14.2`and TimescaleDB `2.6.1`. `pg14-latest` is the latest image
available for PostgreSQL version 14. Reference the appropriate images when
deploying Promscale and follow the instructions provided by your container
platform. If you are using Kubernetes follow [these instructions][promscale-install-kubernetes] instead.

<highlight type="important">
Running Promscale directly using `docker run` is not recommended for production
environments. This can be useful for testing purposes and is just provided as an
example.
</highlight>

## Install Promscale with Docker

Before you begin, you must have Docker installed on your local system. For
packages and instructions, see the [Docker installation documentation][docker-install].

<procedure>

### Installing Promscale using Docker

1.  Use Docker to create a network for Promscale and TimescaleDB:

    ```bash
    docker network create --driver bridge promscale
    ```

1.  Install TimescaleDB in a Docker container on a network named `promscale`. It
    also port forwards to port `5432` on your local system:

    ```bash
    docker run --name timescaledb -e POSTGRES_PASSWORD=<password> \
    -e TSTUNE_PROFILE=promscale \
    -d -p 5432:5432 \
    --network promscale \
    timescale/timescaledb-ha:pg14-latest \
    postgres -csynchronous_commit=off
    ```

1.  Run the Promscale Connector Docker container on a network named `promscale`.
    It also port forwards to port `9201` on your local system:

    ```bash
    docker run --name promscale -d -p 9201:9201 \
    --network promscale timescale/promscale:latest \
    -db.password=<password> \
    -db.port=5432 \
    -db.name=postgres \
    -db.host=timescaledb \
    -db.ssl-mode=allow
    ```

</procedure>

<PromscaleSendData />

For upgrading the Promscale, see the [upgrade] section.

[alpine-image]: https://hub.docker.com/r/timescaledev/promscale-extension
[docker-install]: https://docs.docker.com/get-docker/
[promscale-docker-image]: https://hub.docker.com/r/timescale/promscale/tags
[send-data]: /promscale/:currentVersion:/send-data/
[timescaledb-docker-image]: https://hub.docker.com/r/timescale/timescaledb-ha/tags
[promscale-install-kubernetes]: promscale/:currentVersion:/installation/kubernetes/
[alpine-image]: https://hub.docker.com/r/timescaledev/promscale-extension
