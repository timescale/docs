---
api_name: move_chunk()
excerpt: Move a chunk and its indexes to a different tablespace
topics: [hypertables]
keywords: [chunks, hypertables, tablespaces, move]
api:
  license: community
  type: function
---

# move_chunk() <Tag type="community">Community</Tag>

TimescaleDB allows you to move data and indexes to different tablespaces. This
allows you to move data to more cost-effective storage as it ages.

The `move_chunk` function acts like a combination of the
[PostgreSQL CLUSTER command][postgres-cluster] and
[PostgreSQL ALTER TABLE...SET TABLESPACE][postgres-altertable] commands. Unlike
these PostgreSQL commands, however, the `move_chunk` function uses lower lock
levels so that the chunk and hypertable are able to be read for most of the
process. This comes at a cost of slightly higher disk usage during the
operation. For a more detailed discussion of this capability, see the
documentation on [managing storage with tablespaces][manage-storage].

<Highlight type="note">
You must be logged in as a super user, such as the `postgres` user,
to use the `move_chunk()` call.
</Highlight>

### Required arguments

|Name|Type|Description|
|-|-|-|
|`chunk`|REGCLASS|Name of chunk to be moved|
|`destination_tablespace`|NAME|Target tablespace for chunk being moved|
|`index_destination_tablespace`|NAME|Target tablespace for index associated with the chunk you are moving|

### Optional arguments

|Name|Type|Description|
|-|-|-|
|`reorder_index`|REGCLASS|The name of the index (on either the hypertable or chunk) to order by|
|`verbose`|BOOLEAN|Setting to true displays messages about the progress of the move_chunk command. Defaults to false.|

### Sample usage

``` sql
SELECT move_chunk(
  chunk => '_timescaledb_internal._hyper_1_4_chunk',
  destination_tablespace => 'tablespace_2',
  index_destination_tablespace => 'tablespace_3',
  reorder_index => 'conditions_device_id_time_idx',
  verbose => TRUE
);
```

[manage-storage]: /use-timescale/:currentVersion:/schema-management/about-tablespaces/
[postgres-cluster]: https://www.postgresql.org/docs/current/sql-cluster.html
[postgres-altertable]: https://www.postgresql.org/docs/13/sql-altertable.html
