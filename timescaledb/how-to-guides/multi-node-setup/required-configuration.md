# Multi-node configuration

In addition to the [normal configuration for
TimescaleDB][configuration], we recommend the following settings that
are specific to multi-node operation:

* `max_prepared_transactions` must be set to a non-zero value on all
data nodes (if not already set, `150` is recommended).
* `enable_partitionwise_aggregate` should be set to `on` on the access
  node for good query performance. Otherwise, queries will not be
  pushed down to the data nodes.
* `jit` should be set to `off` on the access node as JIT currently
  doesn't work well with distributed queries. JIT can still be enabled
  on the data nodes.
* `statement_timeout` should be disabled on the data nodes and managed
  through the access node configuration if desired. This setting is disabled
  by default in PostgreSQL, but may be worth verifying in your specific
  environment.

Each of the above settings parameters can be configured for the
instance in `postgresql.conf`, typically located in the data
directory. If the file isn't there, connect to the node (`psql`) and
get the path with:

```sql
SHOW config_file;
```

Note that it will be necessary to reload the configuration if modified.

```bash
pg_ctl reload
```

[configuration]: /administration/configuration/