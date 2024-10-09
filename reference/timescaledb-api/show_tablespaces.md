---
api_name: show_tablespaces()
excerpt: Show the tablespaces attached to a hypertable
topics: [hypertables]
keywords: [tablespaces, hypertables]
tags: [show, get]
api:
  license: apache
  type: function
---

# show_tablespaces()

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
