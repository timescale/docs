---
title: About tablespaces
excerpt: Learn how tablespaces work
keywords: [schemas, tablepsaces]
---

# About tablespaces

Tablespaces are used to determine the physical location of the tables and
indexes in your database. In most cases, you want to use faster storage to store
data that is accessed frequently, and slower storage for data that is accessed
less often.

Hypertables consist of a number of chunks, and each chunk can be located in a
specific tablespace. This allows you to grow your hypertables across many disks.
When you create a new chunk, a tablespace is automatically selected to store the
chunk's data.

You can attach and detach tablespaces on a hypertable. When a disk runs
out of space, you can [detach][detach_tablespace] the full tablespace from the
hypertable, and than [attach][attach_tablespace] a tablespace associated with a
new disk. To see the tablespaces for you hypertable, use the
[`show_tablespaces`][show_tablespaces]
command.

## How hypertable chunks are assigned tablespaces

A hypertable can be partitioned in multiple dimensions, but only one of the
dimensions is used to determine the tablespace assigned to a particular
hypertable chunk. If a hypertable has one or more hash-partitioned, or space,
dimensions, it uses the first hash-partitioned dimension. Otherwise, it uses the
first time dimension.

This strategy ensures that hash-partitioned hypertables have chunks co-located
according to hash partition, as long as the list of tablespaces attached to the
hypertable remains the same. Modulo calculation is used to pick a tablespace, so
there can be more partitions than tablespaces. For example, if there are two
tablespaces, partition number three uses the first tablespace.

Hypertables that are only time-partitioned add new partitions continuously, and
therefore have chunks assigned to tablespaces in a way similar to round-robin.

<Highlight type="note">
It is possible to attach more tablespaces than there are partitions for the
hypertable. In this case, some tablespaces remain unused until others are detached
or additional partitions are added. This is especially true for hash-partitioned
tables.
</Highlight>

[attach_tablespace]: /api/:currentVersion:/hypertable/attach_tablespace/
[detach_tablespace]: /api/:currentVersion:/hypertable/detach_tablespace/
[show_tablespaces]: /api/:currentVersion:/hypertable/show_tablespaces/
