# Prom-migrator data migration tool
Prom-migrator is a universal Prometheus data migration tool that migrates your
data from one storage system to another, using Prometheus remote storage
endpoints. If you are already using Prometheus for long term storage of metrics,
you can use Prom-migrator to replace your remote storage system with Promscale.
Prom-migrator is open source, community-driven, and free-to-use.

## Migrate to Promscale using Prom-migrator
Before you begin, you must have an already installed and working Prometheus
environment to migrate. Additionally, you need a
[self-hosted TimescaleDB instance][tsdb-install-self-hosted] installed.

<procedure>

### Migrating to Promscale using Prom-migrator
1.  Install Promscale from a [Docker container][promscale-install-docker],
    or [from source][promscale-install-source].
1.  Install the Prom-migrator tool from
    [the Promscale releases page][promscale-gh-releases].
1.  Run Prom-migrator to copy the data from the existing Prometheus installation
    to Promscale:
    ```bash
    ./prom-migrator -start=<migration-data-start-time> \
    -end=<migration-data-end-time> \
    -reader-url=<read_endpoint_url_for_remote_read_storage> \
    -writer-url=<write_endpoint_url_for_remote_write_storage> \
    -progress-metric-url=<read_endpoint_url_for_remote_write_storage>
    ```
    For example:
    ```bash
    ./prom-migrator -start=1631007492 \
    -end=1635845892 \
    -reader-url=http://localhost:9091/api/v1/read \
    -writer-url=http://localhost:9201/write \
    -progress-metric-url=http://localhost:9201/read
    ```

</procedure>

When you have migrated the data into Promscale, you can drop the old data from
Prometheus and any other remote storage system and use Promscale to query using
in PromQL and TimescaleDB to query using SQL. You can also configure your existing
Prometheus [alerting][promscale-alerting] and [recording][promscale-recording] 
rules in Promscale. At that point, Prometheus is only useful for collecting data
and we recommend you use the Prometheus Agent Mode to reduce resource consumption.
At the very least you could set the data retention in Prometheus to `1d`.

For more information about Prom-migrator and it command line options, see our
[developer documentation][gh-prom-migrator].


[tsdb-install-self-hosted]: timescaledb/:currentVersion:/how-to-guides/install-timescaledb/self-hosted/
[promscale-install-docker]: promscale/:currentVersion:/installation/docker/
[promscale-install-source]: promscale/:currentVersion:/installation/source/
[promscale-gh-releases]: https://github.com/timescale/promscale/releases
[gh-prom-migrator]: https://github.com/timescale/promscale/tree/master/migration-tool/cmd/prom-migrator
[promscale-recording]:promscale/:currentVersion:/downsample-data/recording/
[promscale-alerting]:promscale/:currentVersion:/alert/
