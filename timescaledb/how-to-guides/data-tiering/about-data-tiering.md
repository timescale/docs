# About data tiering
Data tiering helps you make the most of your equipment when running TimescaleDB
on your own hardware. With data tiering, you save on data storage by using
faster, more expensive storage for frequently accessed data and cheaper, slower
storage for historical data. It can also improve performance, by isolating
historical data from the continual read/write workload of more recent data.

<highlight type="note">
Data tiering is one way to manage data storage costs with TimescaleDB. You can
also use [compression](/timescaledb/latest/how-to-guides/compression) and [data
retention](/timescaledb/latest/how-to-guides/data-retention) to reduce your
storage requirements.
</highlight>

## Data tiering with tablespaces
PostgreSQL uses tablespaces to determine the physical location of your data. For
example, one tablespace might be backed by solid state disks (SSDs), which are
faster and more expensive. Another might be backed by hard disk drives (HDDs),
which are slower and cheaper.

In TimescaleDB, you can move chunks between these tablespaces with the
[`move_chunk`][api-move-chunk] function. For instance, as chunks age, you can
move them from the SSD-backed tablespace to the HDD-backed tablespace. This not
only saves your expensive storage for data that needs it most, but also makes
it easy for you to add tiers of increasingly large, cheap, or slow tablespaces
as your historical data grows.

[api-move-chunk]: /api/:currentVersion:/hypertable/move_chunk
