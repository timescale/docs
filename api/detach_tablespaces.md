## detach_tablespaces()

Detach all tablespaces from a hypertable. After issuing this command
on a hypertable, it no longer has any tablespaces attached to
it. New chunks are instead placed in the database's default
tablespace.

### Required Arguments

|Name|Type|Description|
|---|---|---|
| `hypertable` | REGCLASS | Hypertable to detach a the tablespace from.|

### Sample Usage

Detach all tablespaces from the hypertable `conditions`:

```sql
SELECT detach_tablespaces('conditions');
```
