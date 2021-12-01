
### Installing Promscale to your existing monitoring solution

1. Integrating to Prometheus or Replacing other remote-write systems with Promscale

If you are already using Prometheus or an other remote storage system for long term storage of metrics and planning to replace remote-storage system with Promscale. We have tool to acheieve this using **Prom-migrator**, Prom-migrator is an open-source, community-driven and free-to-use, universal prometheus data migration tool, that migrates data from one storage system to another, leveraging Prometheus's remote storage endpoints.

Follow the below steps to migrate the existing data into Promscale:

1. First install the Promscale as described [here](<>)

2. Install the Prom-migrator from [Promscale releases][promscale-gh-releases].

3. Now the run the Prom-migrator to copy the data from existing Prometehues or remote-storage system to Promscale using the command:
```yaml
./prom-migrator -start=<migration-data-start-time> -end=<migration-data-end-time> -reader-url=<read_endpoint_url_for_remote_read_storage> -writer-url=<write_endpoint_url_for_remote_write_storage> -progress-metric-url=<read_endpoint_url_for_remote_write_storage>
```
More details on Prom-migrator and it's CLI flags can be found [here][prom-migrator-readme].

4. Now after successfully migrating the data into Promscale you can drop the old data from Prometheus and the other remote-storage system as all this data is copied into Promscale using Prom-migrator from the previous step.

5. Currently. Promscale doesn't support alerting, recording rules. So this needs to be achieved on Prometheus end by configuring the alerting, recording rules and an alert-manager to fire alerts. We recommend to configure the data renetion in Prometheus to `1d` but this is totally dependent on the alerting rules configured in Prometheus for evaluation. In future versions of Promscale we will support this natively in Promscale.

6. By now all your data should be persisted into Promscale!! Now you can directly query from Promscale using PromQL and query using SQL from TimescaleDB.
