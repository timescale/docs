---
title: Uninstall TimescaleDB from Docker
excerpt: Uninstall TimescaleDB and PostgreSQL running in a Docker container
products: [self_hosted]
keywords: [uninstall, Docker]
---

# Uninstall TimescaleDB from Docker

If you installed TimescaleDB using Docker, you can completely remove the TimescaleDB container, image, and optionally the data volumes. This guide covers uninstalling both the TimescaleDB-HA and TimescaleDB light Docker images.

<Procedure>

## Uninstalling TimescaleDB from Docker

1.  **Stop the running container**

    ```bash
    docker stop timescaledb
    ```

    If you named your container differently when you created it, replace `timescaledb` with your container name. You can list all running containers with:

    ```bash
    docker ps
    ```

1.  **Remove the container**

    ```bash
    docker rm timescaledb
    ```

    This removes the container but preserves the data volume and the Docker image.

1.  **List and remove the Docker image**

    To see which TimescaleDB images you have installed:

    ```bash
    docker images | grep timescale
    ```

    Remove the specific TimescaleDB image:

    ```bash
    # For TimescaleDB-HA
    docker rmi timescale/timescaledb-ha:pg17

    # For TimescaleDB light
    docker rmi timescale/timescaledb:latest-pg17
    ```

    Replace `pg17` with your PostgreSQL version if different.

1.  **(Optional) Remove the data volume**

    <Highlight type="warning">

    This step permanently deletes all your database data. Only proceed if you're sure you no longer need this data or have backed it up.

    </Highlight>

    List all Docker volumes:

    ```bash
    docker volume ls
    ```

    If you used a named volume when creating your container, remove it:

    ```bash
    docker volume rm <volume-name>
    ```

    If you used a host directory mount (with the `-v </a/local/data/folder>:/pgdata` flag), you can manually delete that directory:

    ```bash
    rm -rf </a/local/data/folder>
    ```

1.  **Verify removal**

    Confirm that the container, image, and volumes have been removed:

    ```bash
    # Check for containers
    docker ps -a | grep timescaledb

    # Check for images
    docker images | grep timescale

    # Check for volumes
    docker volume ls
    ```

</Procedure>

## Remove all unused Docker resources

If you want to clean up all unused Docker resources (not just TimescaleDB), you can use:

```bash
# Remove all stopped containers
docker container prune

# Remove all unused images
docker image prune -a

# Remove all unused volumes
docker volume prune

# Remove all unused resources (containers, images, volumes, networks)
docker system prune -a --volumes
```

<Highlight type="warning">

These commands will remove all unused Docker resources, not just TimescaleDB. Use with caution if you have other Docker containers or images you want to keep.

</Highlight>
