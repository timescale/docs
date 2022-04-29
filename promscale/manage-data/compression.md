# Compress data in Promscale
Telemetry data is stored in Promscale using TimescaleDB [hypertables][hypertables].
A maintenance job periodically [compresses][tsdb-compression] this data.
In Timescale DB version 2.0 and later, this maintenance job is automatically scheduled
using the job scheduling function. In earlier versions of
TimescaleDB, you can use `cron` or a similar scheduling tool to schedule the
maintenance task. See the [installation instructions][promscale-install] for
your platform for more details.

When compression is enabled on Promscale data, the hypertable chunk
currently being written to is not compressed. This ensures good write performance.
Additionally, previously used chunks are kept uncompressed for at least an hour
after they have been closed and a new chunk has been created. This helps with handling
late-arriving data. By default, the chunk interval is configured so that a
new chunk is created every eight hours. You can configure the chunk size with
the `set_default_chunk_interval` SQL function, like this:
```sql
SELECT set_default_chunk_interval(INTERVAL '1h');
```

The new chunk interval is only applied to new chunks created after the setting is changed.
It does not affect chunks that were created before the setting was changed.
You can find the current default chunk interval setting with this query:
```sql
SELECT get_default_chunk_interval();
```


[hypertables]: timescaledb/:currentVersion:/overview/core-concepts/hypertables-and-chunks/
[tsdb-compression]:timescaledb/:currentVersion:/overview/core-concepts/compression/
[promscale-install]: /installation/
