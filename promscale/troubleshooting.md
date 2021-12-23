# Troubleshooting Promscale


## Can I run PromQL queries directly on Promscale?

Yes. Promscale implements the [HTTP API][prometheus-api] from Prometheus to support the full PromQL query interface. You can use it as a Prometheus datasource in 3rd party tools like Grafana.


## How do I query the data using SQL?

There is a document describing the SQL schema and API that Promscale exposes [here][promscale-schema].


## How do I delete data?

Right now, there are two ways of deleting ingested data:

* Automatically using the data retention properties ([details here][promscale-retention])
* Manually through SQL interface (either Postgres [truncate table][truncate_table] or [drop_chunks][drop_chunks] TimescaleDB function)


## What is this Promscale extension for?

Promscale extension is an optional additional extension separate from TimescaleDB that can be used to improve the general performance characteristics of Promscale. You can find more info [here][promscale-ext]. Note the CREATE EXTENSION command will be executed automatically by Promscale when installing.


## Does Promscale support backfill?

Yes. Promscale support backfill of old data by sending older date to Promscale using the Prometheus [remote write API][remote-write-integrations]. This requires creating a custom application that can send requests to that API. We have plans in the near future to expose an SQL API to ingest data into Promscale.


## How do I store existing data from Prometheus to Promscale?

For migrating data from Prometheus to Promscale, you can use Prom-migrator. For more information on Prom-migrator, please read the [docs][prom-migrator].


## Why doesn’t Prometheus show Promscale data when I use the PromQL dashboard?

If you have backfilled data which is not ingested via Prometheus itself, you will need to enable the `read_recent` option for Promscale remote read endpoint ([details here][prometheus-remote-read]).

## Does Promscale need a database superuser to run?

No, Promscale does not need to run as superuser when ingesting or querying data. To setup or update the schema, you could run the Promscale with the `-migrate=only` flag using a superuser which will install the update the schema and install the necessary extensions and quit. You can also avoid needing superuser access by installing the TimescaleDB extension manually before starting the connector.


## How do I downsample data with Promscale?

Right now, the easiest way is to use [Prometheus recording rules][prometheus-recording-rules] to downsample the wanted data and set a longer evaluation interval for the recording rule group. Note that recording rules only allow you to downsample data after the rule has been created and, as of right now, it cannot be applied to pre-existing data.


## Why am I getting `out of shared memory` error when using pg_dump/pg_restore to backup/restore Promscale data?

Promscale creates a table for each metric. Depending on your setup, that can be a lot of tables. pg_dump/pg_restore needs to lock each table when working on it so they can require a lot of locks in a single transaction. Increasing the `max_locks_per_transaction` setting in PostgreSQL should help in this situation.


## Why is my data occupying so much space?

Promscale keeps metric data in hypertables, which consists of both compressed and not-compressed chunks. The most recent chunk kept uncompressed as a cache for faster querying. As data ages, it becomes compressed. Thus our data usage consists of both an uncompressed cache and compressed data. Thus, we have a constant-sized overhead for the cache compared to other systems, in return for faster query results.

To check that compression is working correctly you can query the `prom_info.metric` view and make sure that `total_chunks-number_compressed_chunks` is not bigger than 2. If compression is not working correctly:

* Make sure that you have sufficient background workers (i.e., > number of databases + 2) that is required to do scheduled jobs like compression and retention.
* If you are using TimescaleDB version less than 2.0.0, make sure that you are running the maintenance cron jobs, and they are returning success.

[prometheus-api]: https://prometheus.io/docs/prometheus/latest/querying/api/
[drop_chunks]: https://docs.timescale.com/latest/api#drop_chunks
[prometheus-recording-rules]: https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/ 
[promscale-ext]: https://github.com/timescale/promscale_extension
[promscale-schema]: https://github.com/timescale/promscale/blob/master/docs/sql_schema.md
[promscale-retention]: https://github.com/timescale/promscale/blob/master/docs/sql_schema.md#data-retention
[prometheus-remote-read]: https://prometheus.io/docs/prometheus/latest/configuration/configuration/#remote_read
[prom-migrator]: https://github.com/timescale/promscale/tree/master/cmd/prom-migrator
[remote-write-integrations]: https://prometheus.io/docs/prometheus/latest/storage/#remote-storage-integrations