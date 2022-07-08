import PromscaleInstallPrerequisite from 'versionContent/_partials/_promscale-install-pre-requisite.mdx';
import PromscaleSendData from 'versionContent/_partials/_promscale-send-data.mdx';
# Install Promscale using a pre-built Docker container
Docker images for the [Promscale Connector][promscale-docker-image] and
[TimescaleDB (with the Promscale extension)][timescaledb-docker-image] are
available on Docker Hub.

<PromscaleInstallPrerequisite />

If you are upgrading from the previously used [Alpine image][alpine-image]
follow these upgrade instructions at the end of this page.

The TimescaleDB images have a suffix that indicates the version of PostgreSQL
and TimescaleDB. For example, the tag `pg14.2-ts2.6.1-latest` includes PostgreSQL
`14.2`and TimescaleDB `2.6.1`. `pg14-latest` is the latest image available for 
PostgreSQL version 14. Reference the appropriate images when deploying Promscale 
and follow the instructions provided by your container platform. If you are using 
Kubernetes follow [these instructions][promscale-install-kubernetes] instead.

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

## Upgrading from the previous alpine image

Previously, our recommended image was located at [`timescaledev/promscale-extension`](https://hub.docker.com/r/timescaledev/promscale-extension).
It was based on the [Alpine docker image for PostgreSQL](https://github.com/docker-library/postgres/blob/e8ebf74e50128123a8d0220b85e357ef2d73a7ec/12/alpine/Dockerfile).
Because of [collation bugs](https://github.com/docker-library/postgres/issues/327) and other issues we have now switched our recommendation to the Debian-based image above.

Our previous Alpine-based image will continue to be updated and supported until the end of 2022 but we encourage users to migrate to the `timescale/timescaledb-ha`. All new installations should switch to the `timescale/timescaledb-ha`image.

You can also migrate to Debian version by doing the following (please note: this can be a lengthy process and involves downtime):

1. Use `docker inspect` to determine the data volumes used by your database for the data directory.
2. Shutdown all Promscale Connectors.
3. Shutdown the original database docker image while preserving the volume mount for the data directory.
   You will need to mount this same directory in the new image.
4. Change the ownership of the data-directory to the postgres user and group in the new image. For example:

   ```
   docker run -v <data_dir_volume_mount>:/var/lib/postgresql/data timescale/timescaledb-ha:pg14-latest chown -R postgres:postgres /var/lib/postgresql/data
   ```
5. Start the new docker container with the same volume mounts as what the original container used.
6. Connect to the new database using psql and reindex all the data that has data
   that is collatable. This is necessary because the collation in the Alpine image
   is broken and so BTREE-based indexes will be incorrect until they are reindexed.
   It is extremely important to execute this step before ingesting new data to
   avoid data corruption. Note: This process can take a long time depending on how
   much indexed textual data the database has. You should use the following query to
   reindex all the necessary indexes:

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

7. Restart the Promscale Connector

If you are using Kubernetes instead of plain docker you should:
1. Shutdown the Promscale Connector pods
2. Change the database pod to use the debian docker image and restart it.
3. Execute jobs for the script in steps 4 and 6 above.
4. Restart the Promscale Connector pods.

[docker-install]: https://docs.docker.com/get-docker/
[promscale-docker-image]: https://hub.docker.com/r/timescale/promscale/tags
[timescaledb-docker-image]: https://hub.docker.com/r/timescale/timescaledb-ha/tags
[promscale-install-kubernetes]: promscale/:currentVersion:/installation/kubernetes/
[alpine-image]: https://hub.docker.com/r/timescaledev/promscale-extension
[send-data]: promscale/:currentVersion:/send-data/
[prom-migrator]: promscale/:currentVersion:/installation/prom-migrator