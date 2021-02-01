## remove_retention_policy() <tag type="community">Community</tag> 
Remove a policy to drop chunks of a particular hypertable.

#### Required Arguments 

|Name|Description|
|---|---|
| `relation` | (REGCLASS) Name of the hypertable or continuous aggregate from which to remove the policy |

#### Optional Arguments 

|Name|Description|
|---|---|
| `if_exists` | (BOOLEAN)  Set to true to avoid throwing an error if the policy does not exist. Defaults to false.|


#### Sample Usage 

```sql
SELECT remove_retention_policy('conditions');
```

Removes the existing data retention policy for the `conditions` table.

