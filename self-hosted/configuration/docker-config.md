---
title: Configuration with Docker
excerpt: Configure a TimescaleDB instance running in a Docker container
products: [self_hosted]
keywords: [configuration, settings, Docker]
---

# Configuration with Docker

If you are running TimescaleDB in a [Docker container][docker], there are two
different ways to modify your $PG configuration. You can edit the
$PG configuration file inside the Docker container, or you can set
parameters at the command prompt.

## Edit the $PG configuration file inside Docker

You can start the Dockert container, and then use a text editor to edit the
$PG configuration file directly. The configuration file requires one
parameter per line. Blank lines are ignored, and you can use a `#` symbol at the
beginning of a line to denote a comment.

<Procedure>

### Editing the $PG configuration file inside Docker

1.  Start your Docker instance:

    ```bash
    docker start timescaledb
    ```

1.  Open a shell:

    ```bash
    docker exec -i -t timescaledb /bin/bash
    ```

1.  Open the configuration file in `Vi` editor or your preferred text editor.

    ```bash
    vi /var/lib/postgresql/data/postgresql.conf
    ```

1.  Restart the container to reload the configuration:

    ```bash
    docker restart timescaledb
    ```

</Procedure>

## Setting parameters at the command prompt

If you don't want to open the configuration file to make changes, you can also
set parameters directly from the command prompt inside your Docker container,
using the `-c` option. For example:

```bash
docker run -i -t timescale/timescaledb:latest-pg18 postgres -c max_wal_size=2GB
```

[docker]: /self-hosted/:currentVersion:/install/installation-docker/
