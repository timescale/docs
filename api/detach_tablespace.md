---
api_name: detach_tablespace()
excerpt: Detach a tablespace from a hypertable
topics: [hypertables]
keywords: [tablespaces, hypertables, detach]
api:
  license: apache
  type: function
---

# detach_tablespace()

Detach a tablespace from one or more hypertables. This _only_ means
that _new_ chunks are not placed on the detached tablespace. This
is useful, for instance, when a tablespace is running low on disk
space and one would like to prevent new chunks from being created in
the tablespace. The detached tablespace itself and any existing chunks
with data on it remains unchanged and continue to work as
before, including being available for queries. Note that newly
inserted data rows may still be inserted into an existing chunk on the
detached tablespace since existing data is not cleared from a detached
tablespace. A detached tablespace can be reattached if desired to once
again be considered for chunk placement.

### Required arguments

|Name|Type|Description|
|---|---|---|
| `tablespace` | TEXT | Tablespace to detach.|

When giving only the tablespace name as argument, the given tablespace
is detached from all hypertables that the current role has the
appropriate permissions for. Therefore, without proper permissions,
the tablespace may still receive new chunks after this command
is issued.

### Optional arguments

|Name|Type|Description|
|---|---|---|
| `hypertable` | REGCLASS | Hypertable to detach a the tablespace from.|
| `if_attached` | BOOLEAN | Set to true to avoid throwing an error if the tablespace is not attached to the given table. A notice is issued instead. Defaults to false. |

When specifying a specific hypertable, the tablespace is only
detached from the given hypertable and thus may remain attached to
other hypertables.

### Sample usage

Detach the tablespace `disk1` from the hypertable `conditions`:

```sql
SELECT detach_tablespace('disk1', 'conditions');
SELECT detach_tablespace('disk2', 'conditions', if_attached => true);
```

Detach the tablespace `disk1` from all hypertables that the current
user has permissions for:

```sql
SELECT detach_tablespace('disk1');
```
