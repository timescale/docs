---
api_name: show_tablespaces()
excerpt: Show the tablespaces attached to a hypertable
license: apache
topics: hypertables
tags: [hypertables, tablespaces, show, get]
---

## show_tablespaces() 

Show the tablespaces attached to a hypertable.

### Required arguments

|Name|Type|Description|
|---|---|---|
| `hypertable` | REGCLASS | Hypertable to show attached tablespaces for.|


### Sample usage 

```sql
SELECT * FROM show_tablespaces('conditions');

 show_tablespaces
------------------
 disk1
 disk2
```
