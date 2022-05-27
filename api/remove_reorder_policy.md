---
api_name: remove_reorder_policy()
excerpt: Remove a reorder policy from a hypertable
license: community
---

## remove_reorder_policy() <tag type="community">Community</tag> 
Remove a policy to reorder a particular hypertable.

### Required arguments

|Name|Type|Description|
|---|---|---|
| `hypertable` | REGCLASS | Name of the hypertable from which to remove the policy. |


### Optional arguments

|Name|Type|Description|
|---|---|---|
| `if_exists` | BOOLEAN |  Set to true to avoid throwing an error if the reorder_policy does not exist. A notice is issued instead. Defaults to false. |


### Sample usage 


```sql
SELECT remove_reorder_policy('conditions', if_exists => true);
```

removes the existing reorder policy for the `conditions` table if it exists.
