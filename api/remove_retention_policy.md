---
api_name: remove_retention_policy()
excerpt: Remove a retention policy from a hypertable
topics: [data retention, jobs]
keywords: [data retention, policies, remove]
tags: [delete, drop]
api:
  license: community
  type: function
---

# remove_retention_policy() <Tag type="community">Community</Tag>

Remove a policy to drop chunks of a particular hypertable.

### Required arguments

|Name|Type|Description|
|---|---|---|
| `relation` | REGCLASS | Name of the hypertable or continuous aggregate from which to remove the policy |

### Optional arguments

|Name|Type|Description|
|---|---|---|
| `if_exists` | BOOLEAN |  Set to true to avoid throwing an error if the policy does not exist. Defaults to false.|

### Sample usage

```sql
SELECT remove_retention_policy('conditions');
```

Removes the existing data retention policy for the `conditions` table.
