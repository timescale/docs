### Chunks [](chunks)

Internally, TimescaleDB automatically splits each
hypertable into **chunks**, with each chunk corresponding to a specific time
interval and a region of the partition key’s space (using hashing).
These partitions are disjoint (non-overlapping), which helps the query planner
to minimize the set of chunks it must touch to resolve a query.

Each chunk is implemented using a standard database table.  (In PostgreSQL
internals, the chunk is actually a "child table" of the "parent" hypertable.)

Chunks are right-sized, ensuring that all of the B-trees for a table’s
indexes can reside in memory during inserts.  This avoids thrashing when
modifying arbitrary locations in those trees.

Further, by avoiding overly large chunks, we can avoid expensive "vacuuming"
operations when removing deleted data according to automated retention policies.
The runtime can perform such operations by simply dropping chunks (internal
tables), rather than deleting individual rows.