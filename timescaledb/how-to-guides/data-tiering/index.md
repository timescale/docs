# Data tiering

TimescaleDB includes the ability to perform data tiering by moving chunks
between PostgreSQL tablespaces. Tablespaces are locations on disk where
PostgreSQL stores data files containing database objects, and each can be
backed by a different class of storage. As data ages, you can add new
tablespaces backed by a specified storage class and use the
[`move_chunk`][api-move-chunk] API function to migrate data between these
tablespaces.

For example, we can attach multiple tablespaces to a single hypertable; in the
following example, we use two tablespaces:

1. Tablespace `pg_default` is backed by faster, more expensive storage
(SSDs) and is meant for recent chunks that are being actively written to and
regularly queried.

1. Tablespace `history` is backed by slower, less expensive storage
(HDDs) and is meant for older chunks that are more rarely queried.

Taking a "data tiering" approach, as data ages, its corresponding chunks are
moved from `pg_default` to `history`. This provides users with the ability to
tradeoff storage performance for cost, and additional "tiers" of increasingly
large/cheap/slow tablespaces may be employed when appropriate.  Therefore, data
tiering provides another mechanism, in addition to other TimescaleDB
capabilities like compression and data retention, to help manage data storage
costs.

Using multiple tablespaces can also yield I/O performance benefits. With data
tiering, you can isolate large scans of historical data away from the continual
read/write workload against recent data (in the default tablespace).

[api-move-chunk]: /api/:currentVersion:/hypertable/move_chunk
