---
title: Multi-node configuration
excerpt: Configure a multi-node TimescaleDB instance
products: [self_hosted]
keywords: [configuration, settings, multi-node]
---

import MultiNodeDeprecation from "versionContent/_partials/_multi-node-deprecation.mdx";

<MultiNodeDeprecation />

# Multi-node configuration

In addition to the
[regular TimescaleDB configuration][timescaledb-configuration], it is recommended
that you also configure additional settings specific to multi-node operation.

## Update settings

Each of these settings can be configured in the `postgresql.conf` file on the
individual node. The `postgresql.conf` file is usually in the `data` directory,
but you can locate the correct path by connecting to the node with `psql` and
giving this command:

```sql
SHOW config_file;
```

After you have modified the `postgresql.conf` file, reload the configuration to
see your changes:

```bash
pg_ctl reload
```

<!--these need a better structure --LKB 2021-10-20-->
### `max_prepared_transactions`

If not already set, ensure that `max_prepared_transactions` is a non-zero value
on all data nodes is set to `150` as a starting point.

### `enable_partitionwise_aggregate`

On the access node, set the `enable_partitionwise_aggregate` parameter to `on`.
This ensures that queries are pushed down to the data nodes, and improves query
performance.

### `jit`

On the access node, set `jit` to `off`. Currently, JIT does not work well with
distributed queries. However, you can enable JIT on the data nodes successfully.

### `statement_timeout`

On the data nodes, disable `statement_timeout`. If you need to enable this,
enable and configure it on the access node only. This setting is disabled by
default in PostgreSQL, but can be useful if your specific environment is suited.

### `wal_level`

On the data nodes, set the `wal_level` to `logical` or higher to
[move][move_chunk] or [copy][copy_chunk] chunks between data nodes. If you
are moving many chunks in parallel, consider increasing `max_wal_senders` and
`max_replication_slots` as well.

### Transaction isolation level

For consistency, if the transaction isolation level is set to `READ COMMITTED`
it is automatically upgraded to `REPEATABLE READ` whenever a distributed
operation occurs. If the isolation level is `SERIALIZABLE`, it is not changed.

[copy_chunk]: /api/:currentVersion:/distributed-hypertables/copy_chunk_experimental
[move_chunk]: /api/:currentVersion:/distributed-hypertables/move_chunk_experimental
[timescaledb-configuration]: /self-hosted/:currentVersion:/configuration/
