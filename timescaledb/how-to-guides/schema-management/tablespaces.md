## Storage management with tablespaces [](tablespaces)

An administrator can use tablespaces to manage storage for a
hypertable. A tablespace is a location on a file system where database
objects (e.g., tables and indexes) are stored. Review the standard
PostgreSQL [documentation on tablespaces][postgres-tablespaces] for
more information, including how to create tablespaces.

Since a hypertable comprises a number of chunks, each chunk can be
placed in a specific tablespace, allowing the hypertable to grow
across many disks. To this end, TimescaleDB allows
[attaching][attach_tablespace] and [detaching][detach_tablespace]
tablespaces on a hypertable. When new chunks are created, one of the
hypertable's attached tablespaces is picked by the runtime to store
the chunk's data. Thus, a typical use case is to detach a tablespace
from a hypertable when the tablespace runs out of disk space and
attach a new one that has free space. A hypertable's attached
tablespaces can be viewed with the
[`show_tablespaces`][show_tablespaces] command.

### How hypertable chunks are assigned tablespaces

A hypertable can be partitioned in multiple dimensions, but only one
of the dimensions is used to determine the tablespace assigned to a
particular hypertable chunk. If a hypertable has one or more hash-partitioned
("space") dimensions, then the first hash-partitioned dimension
is used. Otherwise, the first time dimension is used. This assignment
strategy ensures that hash-partitioned hypertables will have chunks
colocated according to hash partition, as long as the list of
tablespaces attached to the hypertable remains the same. Modulo
calculation is used to pick a tablespace, so there can be more partitions
than tablespaces (e.g., if there are two tablespaces, partition number
three will use the first tablespace).

<highlight type="tip">
Note that attaching more tablespaces than there are partitions for the
hypertable might leave some tablespaces unused until some of them are detached
or additional partitions are added. This is especially true for
hash-partitioned tables.
</highlight>

Hypertables that are only time-partitioned will add new
partitions continuously, and will therefore have chunks assigned to
tablespaces in a way similar to round-robin.



[postgres-tablespaces]: https://www.postgresql.org/docs/current/static/manage-ag-tablespaces.html
[attach_tablespace]: /api/:currentVersion:/hypertable/attach_tablespace/
[detach_tablespace]: /api/:currentVersion:/hypertable/detach_tablespace/
[show_tablespaces]: /api/:currentVersion:/hypertable/show_tablespaces/
