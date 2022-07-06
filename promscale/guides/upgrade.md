# Upgrade Promscale
Promscale consists of the Promscale Connector, and the Promscale Database. The
Promscale Database is PostgreSQL with the TimescaleDB and the Promscale
extensions. When you upgrade your Promscale installation, you need to check both
the Connector and the Database.

The process for upgrading your Promscale installation is:

1.  Check that the most recent required versions of PostgreSQL, TimescaleDB and
the Promscale extension are available.
1.  Stop all Promscale Connector instances connected to the database.
1.  Start one instance with the new version of the Promscale Connector.
1.  Start all other Promscale Connector instances.

You can upgrade your existing Promscale to Promscale `0.11.0`
and from the previous alphine image.

## Upgrade to Promscale 0.11.0
Promscale 0.11.0 contains significant changes, and the upgrade drops any
previous tracing data you have stored. Make a backup of your installation, and
test the new version, before you go ahead with this upgrade.

Upgrading to Promscale 0.11.0 could take up to 5-10 minutes on very large
databases. During the upgrade, Promscale does not ingest or query data.

The upgrade process modifies a lot of database objects. On large deployments,
you might need to increase the PostgreSQL `max_locks_per_transaction` parameter
before you start the upgrade. For more information, see [Transaction
locks][transaction-locks].

<highlight type="warning"> When you upgrade to Promscale 0.11.0, all previous
tracing data is dropped. Make a backup of your installation, and test the new
version before you upgrade. </highlight>

<procedure>

### Upgrading to Promscale 0.11.0
To upgrade to Promscale 0.11.0 you must have installed PostgreSQL 12 or later,
TimescaleDB 2.6.1 or later, and Promscale extension version 0.5.0 or later. 

1. Check the version of PostgreSQL that is installed:
   ```sql
   SHOW server_version;
   ``` 
1. Check the version of TimescaleDB and Promscale that is installed:
   ```sql
   SELECT extname, extversion FROM pg_extension WHERE extname IN ('timescaledb', 'promscale');
   ```
   For information about upgrading TimescaleDB and PostgreSQL, see [Update TimescaleDB][update-timescaledb] and [Upgrade PostgreSQL][upgrade-postgresql].
1. Stop all Promscale Connector instances connected to the database.
1. Update the Promscale extension on one instance using the Promscale Connector.
   For more information, see the [Promscale installation
   instructions][install-promscale] for various installation method.
   <highlight type="note"> Do not use the `ALTER EXTENSION promscale UPDATE;` command. to update the extension.
   </highlight>
1. Start one instance with the latest version of the Promscale Connector. The migration happens automatically. After the migration is completed, upgrade the remaining Promscale Connector instances.
1. Start the other instances of Promscale Connector.

</procedure>

Upgrading to Promscale 0.11.0 creates a lock on your tables. If you have been
using Promscale for a while, and you have a large number of metrics, this could
result in locking a large number of tables. If PostgreSQL has not been correctly
configured for this, the process could fail with an error similar to:

```yml
ERROR: out of shared memory (SQLSTATE 53200)`.
```

This error occurs because PostgreSQL has a limited amount of shared memory
available to store locks on objects. You can increase the amount of shared
memory available by increasing the `max_locks_per_transaction` parameter. When
you have completed the upgrade, you can set the value back to what it was before
the upgrade. For more information about tuning this parameter, see
[troubleshooting Promscale][max-locks-config].

## Upgrade from the previous alpine image
You can upgrade from the previous alpine image on Docker or Kubernetes. 

### Upgrading from the previous alpine image on Docker

Previously, the recommended image was located at [`timescaledev/promscale-extension`](https://hub.docker.com/r/timescaledev/promscale-extension).
It was based on the [Alpine docker image for PostgreSQL](https://github.com/docker-library/postgres/blob/e8ebf74e50128123a8d0220b85e357ef2d73a7ec/12/alpine/Dockerfile).

The previous Alpine-based image are updated and supported until
the end of 2022 but you are encouraged to migrate to the
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

## Upgrading from the previous alpine image on Kubernetes
If you are using Kubernetes instead of plain Docker:

<procedure>

1. Shutdown the Promscale Connector pods
1. Change the database pod to use the Debian Docker image.
1. Restart the pod.
1. Change ownership of the data directory to the `postgres` user and group in
   the new image by ssh into the database container. For example:

   ```
   chown -R postgres:postgres /var/lib/postgresql/data
   ```
1. Connect to the new database using psql and reindex all the collatable data.
   Use this query to reindex all the necessary indexes:

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
1. Restart the Promscale Connector pods.

</procedure>

[install-promscale]: promscale/:currentVersion:/installation
[max-locks-config]: promscale/:currentVersion:/troubleshooting/#data-is-occupying-too-much-space
[transaction-locks]: timescaledb/:currentVersion:/how-to-guides/configuration/about-configuration/#transaction-locks
[update-timescaledb]: timescaledb/:currentVersion:/how-to-guides/update-timescaledb/#update-timescaledb
[upgrade-postgresql]: timescaledb/:currentVersion:/how-to-guides/update-timescaledb/upgrade-postgresql/
