---
title: TimescaleDB configuration and tuning
excerpt: How to change configuration settings for TimescaleDB
products: [self_hosted]
keywords: [configuration, settings]
tags: [tune]
---

# TimescaleDB configuration and tuning

Just as you can tune settings in PostgreSQL, TimescaleDB provides a number of configuration
settings that may be useful to your specific installation and performance needs. These can
also be set within the `postgresql.conf` file or as command-line parameters
when starting PostgreSQL.

## Policies

### `timescaledb.max_background_workers (int)`

Max background worker processes allocated to TimescaleDB. Set to at least 1 +
the number of databases loaded with a TimescaleDB extension in a PostgreSQL
instance. Default value is 16.

## Distributed hypertables

### `timescaledb.enable_2pc (bool)`

Enables two-phase commit for distributed hypertables. If disabled, it
uses a one-phase commit instead, which is faster but can result in
inconsistent data. It is by default enabled.

### `timescaledb.enable_per_data_node_queries`

If enabled, TimescaleDB combines different chunks belonging to the
same hypertable into a single query per data node. It is by default enabled.

### `timescaledb.max_insert_batch_size (int)`

When acting as a access node, TimescaleDB splits batches of inserted
tuples across multiple data nodes. It batches up to
`max_insert_batch_size` tuples per data node before flushing. Setting
this to 0 disables batching, reverting to tuple-by-tuple inserts. The
default value is 1000.

### `timescaledb.enable_connection_binary_data (bool)`

Enables binary format for data exchanged between nodes in the
cluster. It is by default enabled.

### `timescaledb.enable_client_ddl_on_data_nodes (bool)`

Enables DDL operations on data nodes by a client and do not restrict
execution of DDL operations only by access node. It is by default disabled.

### `timescaledb.enable_async_append (bool)`

Enables optimization that runs remote queries asynchronously across
data nodes. It is by default enabled.

### `timescaledb.enable_remote_explain (bool)`

Enable getting and showing `EXPLAIN` output from remote nodes. This
requires sending the query to the data node, so it can be affected
by the network connection and availability of data nodes. It is by default disabled.

### `timescaledb.remote_data_fetcher (enum)`

Pick data fetcher type based on type of queries you plan to run, which
can be either `copy`, `cursor`, or `auto`. The default is `auto`.

### `timescaledb.ssl_dir (string)`

Specifies the path used to search user certificates and keys when
connecting to data nodes using certificate authentication. Defaults to
`timescaledb/certs` under the PostgreSQL data directory.

### `timescaledb.passfile (string)` [

Specifies the name of the file where passwords are stored and when
connecting to data nodes using password authentication.

## Administration

### `timescaledb.restoring (bool)`

Set TimescaleDB in restoring mode. It is disabled by default.

### `timescaledb.license (string)`

Change access to features based on the TimescaleDB license in use. For example,
setting `timescaledb.license` to `apache` limits TimescaleDB to features that
are implemented under the Apache 2 license. The default value is `timescale`,
which allows access to all features.

### `timescaledb.telemetry_level (enum)`

Telemetry settings level. Level used to determine which telemetry to
send. Can be set to `off` or `basic`. Defaults to `basic`.

### `timescaledb.last_tuned (string)`

Records last time `timescaledb-tune` ran.

### `timescaledb.last_tuned_version (string)`

Version of `timescaledb-tune` used to tune when it runs.
