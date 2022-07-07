# Upgrades within a Docker container
If you originally installed TimescaleDB using Docker, you can upgrade from
within the Docker container. This allows you to upgrade to the latest
TimescaleDB version, while retaining your data.

<highlight type="note">
In this section, the examples use a Docker instance called `timescaledb`. If you
have given your Docker instance a different name, replace it when you issue the
commands.
</highlight>

## Determine the mount point type
When you start your upgraded Docker container, you need to be able to point the
new Docker image to the location that contains the data from your previous
version. To do this, you need to work out where the current mount point is. The
current mount point varies depending on whether your container is using volume
mounts, or bind mounts.

<procedure>

### Determining the mount point type
1.  Work out what type of mount your Docker container uses by running this
    command, which returns either `volume` or `bind`:

    ```bash
    docker inspect timescaledb --format='{{range .Mounts }}{{.Type}}{{end}}'
    ```

1.  Get the current name or mount path with this command, and record it to use
    when you perform the upgrade. Make sure you copy the correct command, based
    on your mount point type.

    For volume mounts:

    ```bash
    docker inspect timescaledb --format='{{range .Mounts }}{{.Name}}{{end}}'
    069ba64815f0c26783b81a5f0ca813227fde8491f429cf77ed9a5ae3536c0b2c
    ```

    For bind mounts:

    ```bash
    docker inspect timescaledb --format='{{range .Mounts }}{{.Source}}{{end}}'
    /path/to/data
    ```

</procedure>

## Upgrade TimescaleDB within Docker
To upgrade TimescaleDB within Docker, you need to download the upgraded image,
stop the old container, and launch the new container pointing to your existing
data.

<procedure>

### Upgrading TimescaleDB within Docker

1.  Pull the latest TimescaleDB image:

    ```bash
    docker pull timescale/timescaledb-ha:pg14-latest
    ```

1.  Stop the old container, and remove it:

    ```bash
    docker stop timescaledb
    docker rm timescaledb
    ```

1.  Launch a new container with the upgraded Docker image, pointing to the
    existing mount point. Make sure you copy the correct command, based on your
    mount point type.

    For volume mounts:

    ```bash
    docker run -v 069ba64815f0c26783b81a5f0ca813227fde8491f429cf77ed9a5ae3536c0b2c:/var/lib/postgresql/data -d --name timescaledb -p 5432:5432 timescale/timescaledb
    ```

    For bind mounts:

    ```bash
    docker run -v /path/to/data:/var/lib/postgresql/data -d --name timescaledb -p 5432:5432 timescale/timescaledb
    ```

2.  Connect to the upgraded instance using `psql` with the `-X` flag:

    ```bash
    docker exec -it timescaledb psql -U postgres -X
    ```

3.  At the psql prompt, use the `ALTER` command to upgrade the extension:

    ```sql
    ALTER EXTENSION timescaledb UPDATE;
    ```

</procedure>
