---
api_name: attach_tablespace()
excerpt: Attach a tablespace to a hypertable
topics: [hypertables]
keywords: [hypertables, tablespaces]
tags: [chunks, attach]
api:
  license: apache
  type: function
---

# attach_tablespace()

Attach a tablespace to a hypertable and use it to store chunks. A
[tablespace][postgres-tablespaces] is a directory on the filesystem
that allows control over where individual tables and indexes are
stored on the filesystem. A common use case is to create a tablespace
for a particular storage disk, allowing tables to be stored
there. To learn more, see the [PostgreSQL documentation on
tablespaces][postgres-tablespaces].

TimescaleDB can manage a set of tablespaces for each hypertable,
automatically spreading chunks across the set of tablespaces attached
to a hypertable. If a hypertable is hash partitioned, TimescaleDB
tries to place chunks that belong to the same partition in the same
tablespace. Changing the set of tablespaces attached to a hypertable
may also change the placement behavior. A hypertable with no attached
tablespaces has its chunks placed in the database's default
tablespace.

### Required arguments

|Name|Type|Description|
|---|---|---|
| `tablespace` | TEXT | Name of the tablespace to attach.|
| `hypertable` | REGCLASS | Hypertable to attach the tablespace to.|

Tablespaces need to be [created][postgres-createtablespace] before
being attached to a hypertable. Once created, tablespaces can be
attached to multiple hypertables simultaneously to share the
underlying disk storage. Associating a regular table with a tablespace
using the `TABLESPACE` option to `CREATE TABLE`, prior to calling
`create_hypertable`, has the same effect as calling
`attach_tablespace` immediately following `create_hypertable`.

### Optional arguments

|Name|Type|Description|
|---|---|---|
| `if_not_attached` | BOOLEAN |Set to true to avoid throwing an error if the tablespace is already attached to the table. A notice is issued instead. Defaults to false. |

### Sample usage

Attach the tablespace `disk1` to the hypertable `conditions`:

```sql
SELECT attach_tablespace('disk1', 'conditions');
SELECT attach_tablespace('disk2', 'conditions', if_not_attached => true);
 ```

[postgres-createtablespace]: https://www.postgresql.org/docs/current/sql-createtablespace.html
[postgres-tablespaces]: https://www.postgresql.org/docs/current/manage-ag-tablespaces.html
