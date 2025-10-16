---
title: TimescaleDB configuration and tuning
excerpt: Configure the TimescaleDB settings related to policies, query planning and execution, distributed hypertables, and administration
products: [self_hosted]
keywords: [configuration, settings]
tags: [tune]
---

import TimescaleDBConfig from "versionContent/_partials/_timescaledb-config.mdx";
import MultiNodeDeprecation from "versionContent/_partials/_multi-node-deprecation.mdx";

# $TIMESCALE_DB configuration and tuning

Just as you can tune settings in $PG, $TIMESCALE_DB provides a number of configuration
settings that may be useful to your specific installation and performance needs. These can
also be set within the `postgresql.conf` file or as command-line parameters
when starting $PG.
when starting $PG.

<TimescaleDBConfig />

## Distributed hypertables

<MultiNodeDeprecation />

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
`timescaledb/certs` under the $PG data directory.

### `timescaledb.passfile (string)` [

Specifies the name of the file where passwords are stored and when
connecting to data nodes using password authentication.

[continuous-aggregates]: /use-timescale/:currentVersion:/continuous-aggregates/
