---
api_name: detach_tablespaces()
excerpt: Detach all tablespaces from a hypertable
topics: [hypertables]
keywords: [tablespaces, hypertables, detach]
api:
  license: apache
  type: function
---

# detach_tablespaces()

Detach all tablespaces from a hypertable. After issuing this command
on a hypertable, it no longer has any tablespaces attached to
it. New chunks are instead placed in the database's default
tablespace.

### Required arguments

|Name|Type|Description|
|---|---|---|
| `hypertable` | REGCLASS | Hypertable to detach a the tablespace from.|

### Sample usage

Detach all tablespaces from the hypertable `conditions`:

```sql
SELECT detach_tablespaces('conditions');
```
