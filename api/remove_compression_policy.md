## remove_compression_policy() <tag type="community" content="community" />
If you need to remove the compression policy. To re-start policy-based compression again you need to re-add the policy.

### Required Arguments

|Name|Type|Description|
|---|---|---|
| `hypertable` | REGCLASS | Name of the hypertable the policy should be removed from.|

### Optional Arguments

|Name|Type|Description|
|---|---|---|
| `if_exists` | BOOLEAN | Setting to true causes the command to fail with a notice instead of an error if a compression policy does not exist on the hypertable. Defaults to false.|

### Sample Usage
Remove the compression policy from the 'cpu' table:
``` sql
SELECT remove_compression_policy('cpu');
```
