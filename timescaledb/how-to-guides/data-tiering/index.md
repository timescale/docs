# About data tiering
When running TimescaleDB on your own hardware, you can use data tiering to make
the most effective use of your physical hardware. Data tiering provides another
mechanism, in addition to other TimescaleDB capabilities like compression and
data retention, to help manage data storage costs. Using multiple tablespaces
can also yield performance benefits, by isolating historical data away from the
continual read/write workload of more recent data.

PostgreSQL uses tablespaces to determine the physical location of your data. In
most cases, you want to use faster storage to store data that is accessed
frequently, and slower storage for data this is accessed less often.

In TimescaleDB, you can move chunks between different tablespaces, using the
[`move_chunk`][api-move-chunk] API call. For example, you can attach two
different tablespaces to a hypertable, and as the data chunks age, move the
chunks between the tablespaces. The first tablespace, `pg_default`, is backed by
solid state disks (SSDs), which are faster and more expensive. The `pg_default`
tablespace is used for recent chunks that are being actively written to and
queried. The second tablespace, `history`, is backed by hard disk drives (HDDs),
which are slower and less expensive. The `history` tablespace is used for older
chunks that are written to and queried less frequently.

In this approach, chunks are moved from `pg_default` to `history` as the data
ages. This allows you to use less expensive storage for data where performance
is less important, and save your expensive storage for situations where you
receive the most performance benefit. It also allows you to add tiers of
increasingly large, cheap, or slow tablespaces as appropriate.


[api-move-chunk]: /api/:currentVersion:/hypertable/move_chunk
