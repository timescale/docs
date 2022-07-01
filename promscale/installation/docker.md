# Install Promscale using a Docker image
You can use Docker to install 
[TimescaleDB with the Promscale extension][timescaledb-docker-image], 
and the [Promscale connector][promscale-docker-image]. 
The Docker images are available for download from Docker Hub.

If you are upgrading from the previously used [Alpine image][alpine-image]
follow the [upgrade instructions][upgrade].

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

After you have installed Promscale, you can ingest data.
For instructions, see the [send data][send-data] section.

## Upgrading from the previous alpine image

Previously, the recommended image was located at [`timescaledev/promscale-extension`](https://hub.docker.com/r/timescaledev/promscale-extension).
It was based on the [Alpine docker image for PostgreSQL](https://github.com/docker-library/postgres/blob/e8ebf74e50128123a8d0220b85e357ef2d73a7ec/12/alpine/Dockerfile).
Because of [collation bugs](https://github.com/docker-library/postgres/issues/327) and other issues we have now switched to the Debian-based image above.

The previous Alpine-based image are updated and supported until
the end of 2022 but users are encouraged to migrate to the
`timescale/timescaledb-ha`. All new installations should switch to the
`timescale/timescaledb-ha`image.
<highlight type="note">
Migrating to Debian version can be a lengthy process and involves downtime.
</highlight>

<procedure>

1. Use `docker inspect` to determine the data volumes used by your database for the data directory.
1. Shut down all Promscale Connectors.
1. Shut down the original database Docker image, but make sure you preserve the volume mount
   for the data directory. You need to mount this same directory in the new
   image.
1. Change ownership of the data directory to the `postgres` user and group in
   the new image. For example:

   ```
   docker run -v <data_dir_volume_mount>:/var/lib/postgresql/data timescale/timescaledb-ha:pg14-latest chown -R postgres:postgres /var/lib/postgresql/data
   ```
1. Start the new Docker container with the same volume mounts that the
   original container used.
1. Connect to the new database using psql and reindex all the collatable data. Use this query to reindex all the necessary indexes:

   ```
     DO $$DECLARE r record;
     BEGIN
       FOR r IN
         SELECT DISTINCT indclass
             FROM (SELECT indexrelid::regclass indclass, unnest(string_to_array(indcollation::text, ' ')) coll FROM pg_catalog.pg_index) sub
             INNER JOIN pg_catalog.pg_class c ON (c.oid = sub.indclass)
             WHERE coll !='0' AND c.relkind != 'I'
       LOOP
        EXECUTE 'REINDEX INDEX ' || r.indclass;
     END LOOP;
   END$$;
   ```
   This is necessary because the collation in the Alpine image is broken and so
   BTREE-based indexes remain incorrect until they are reindexed. It is
   extremely important to execute this step before ingesting new data to avoid
   data corruption. This process can take a long time depending on the indexed
   textual data in the database.  

1. Restart the Promscale Connector

</procedure>

If you are using Kubernetes instead of plain docker:
<procedure>

1. Shutdown the Promscale Connector pods
1. Change the database pod to use the debian docker image and restart it.
1. Execute jobs for the script in steps 4 and 6 above.
1. Restart the Promscale Connector pods.

</procedure>

[docker-install]: https://docs.docker.com/get-docker/
[promscale-docker-image]: https://hub.docker.com/r/timescale/promscale/tags
[timescaledb-docker-image]: https://hub.docker.com/r/timescale/timescaledb-ha/tags
[promscale-install-kubernetes]: promscale/:currentVersion:/installation/kubernetes/
[alpine-image]: https://hub.docker.com/r/timescaledev/promscale-extension
[send-data]: promscale/:currentVersion:/send-data/
