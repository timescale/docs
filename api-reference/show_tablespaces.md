## show_tablespaces() 

Show the tablespaces attached to a hypertable.

#### Required Arguments 

|Name|Description|
|---|---|
| `hypertable` | (REGCLASS) Hypertable to show attached tablespaces for.|


#### Sample Usage 

```sql
SELECT * FROM show_tablespaces('conditions');

 show_tablespaces
------------------
 disk1
 disk2
```
