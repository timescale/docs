---
title: Upgrade TimescaleDB running in Docker
excerpt: Upgrade self-hosted TimescaleDB running in a Docker container to a new minor version
products: [self_hosted]
keywords: [upgrades, Docker]
---

import ConsiderCloud from "versionContent/_partials/_consider-cloud.mdx";

# Upgrade $TIMESCALE_DB running in Docker

If you originally installed $TIMESCALE_DB using Docker, you can upgrade from within the Docker 
container. This allows you to upgrade to the latest $TIMESCALE_DB version while retaining your data.

The `timescale/timescaledb-ha*` images have the files necessary to run previous versions. Patch releases 
only contain bugfixes so should always be safe. Non-patch releases may rarely require some extra steps.
These steps are mentioned in the [release notes][relnotes] for the version of $TIMESCALE_DB 
that you are upgrading to.

After you upgrade the docker image, you run `ALTER EXTENSION` for all databases using $TIMESCALE_DB.

<ConsiderCloud />

The examples in this page use a Docker instance called `timescaledb`. If you
have given your Docker instance a different name, replace it when you issue the
commands.

## Determine the mount point type

When you start your upgraded Docker container, you need to be able to point the
new Docker image to the location that contains the data from your previous
version. To do this, you need to work out where the current mount point is. The
current mount point varies depending on whether your container is using volume
mounts, or bind mounts.

<Procedure>

1.  Find the mount type used by your Docker container: 

    ```bash
    docker inspect timescaledb --format='{{range .Mounts }}{{.Type}}{{end}}'
    ```
    This returns either `volume` or `bind`.

1.  Note the volume or bind used by your container:

    <Terminal>

    <tab label='Volume'>

    ```bash
    docker inspect timescaledb --format='{{range .Mounts }}{{.Name}}{{end}}'
    ```
    Docker returns the `<volume ID>`. You see something like this: 

    ```
    069ba64815f0c26783b81a5f0ca813227fde8491f429cf77ed9a5ae3536c0b2c
    ```

    </tab>

    <tab label='bind'>

    ```bash
    docker inspect timescaledb --format='{{range .Mounts }}{{.Source}}{{end}}'
    ```

    Docker returns the `<bind path>`. You see something like this: 

    ```
    /path/to/data
    ```

    </tab>

    </Terminal>

    You use this value when you perform the upgrade.

</Procedure>

## Upgrade $TIMESCALE_DB within Docker

To upgrade $TIMESCALE_DB within Docker, you need to download the upgraded image,
stop the old container, and launch the new container pointing to your existing
data.

<Tabs label="Upgrade TimescaleDB in Docker">

<Tab title="TimescaleDB-HA">

<Procedure>

1.  **Pull the latest $TIMESCALE_DB image**

    This command pulls the latest version of $TIMESCALE_DB running on $PG 17:

    ```
    docker pull timescale/timescaledb-ha:pg17
    ```

    If you're using another version of $PG, look for the relevant tag in the [$TIMESCALE_DB HA](https://hub.docker.com/r/timescale/timescaledb-ha/tags) repository on Docker Hub.

1.  **Stop the old container, and remove it**

    ```bash
    docker stop timescaledb
    docker rm timescaledb
    ```

1. **Launch a new container with the upgraded Docker image**

   Launch based on your mount point type:

   <Terminal>

    <tab label='Volume mount'>

    ```bash
    docker run -v <volume ID>:/home/postgres/pgdata/data
      -d --name timescaledb -p 5432:5432 timescale/timescaledb-ha:pg17
    ```

    </tab>

    <tab label='Bind mount'>

    ```bash
    docker run -v <bind path>:/home/postgres/pgdata/data -d --name timescaledb \
      -p 5432:5432 timescale/timescaledb-ha:pg17
    ```

    </tab>

    </Terminal>

1.  **Connect to the upgraded instance using `psql` with the `-X` flag**

    ```bash
    docker exec -it timescaledb psql -U postgres -X
    ```

1.  **At the psql prompt, use the `ALTER` command to upgrade the extension**

    ```
    ALTER EXTENSION timescaledb UPDATE;
    CREATE EXTENSION IF NOT EXISTS timescaledb_toolkit;
    ALTER EXTENSION timescaledb_toolkit UPDATE;
    ```

The [$TOOLKIT_LONG][toolkit] extension is packaged with $TIMESCALE_DB HA, it includes additional
hyperfunctions to help you with queries and data analysis.

<Highlight type="note">

If you have multiple databases, update each database separately.

</Highlight>

</Procedure>
    
</Tab>


<Tab title="TimescaleDB light">

<Procedure>

1.  **Pull the latest $TIMESCALE_DB image**

    This command pulls the latest version of $TIMESCALE_DB running on $PG 17.

    ```
    docker pull timescale/timescaledb:latest-pg17
    ```

    If you're using another version of $PG, look for the relevant tag in the [TimescaleDB light](https://hub.docker.com/r/timescale/timescaledb) repository on Docker Hub.

1.  **Stop the old container, and remove it**

    ```bash
    docker stop timescaledb
    docker rm timescaledb
    ```

1. **Launch a new container with the upgraded Docker image**

   Launch based on your mount point type:

   <Terminal>

    <tab label='Volume mount'>

    ```bash
    docker run -v  <volume ID>:/var/lib/postgresql/data \
      -d --name timescaledb -p 5432:5432 timescale/timescaledb:latest-pg17
    ```

    </tab>

    <tab label='Bind mount'>

    ```bash
    docker run -v /bind/path/recovered/earlier:<data folder> -d --name timescaledb \
      -p 5432:5432 timescale/timescaledb:latest-pg17
    ```

    </tab>

    </Terminal>

1.  **Connect to the upgraded instance using `psql` with the `-X` flag**

    ```bash
    docker exec -it timescaledb psql -U postgres -X
    ```

1.  **At the psql prompt, use the `ALTER` command to upgrade the extension**

    ```sql
    ALTER EXTENSION timescaledb UPDATE;
    ```

<Highlight type="note">

If you have multiple databases, you need to update each database separately.

</Highlight>

</Procedure>
    
</Tab>

</Tabs>


[toolkit]: /self-hosted/:currentVersion:/tooling/install-toolkit/
[relnotes]: https://github.com/timescale/timescaledb/releases
