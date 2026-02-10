---
api_name: tier_chunk()
excerpt: Remove a retention policy from a hypertable
topics: [data tiering, chunk]
keywords: [data tiering, chunk]
tags: [tiering, chunk]
api:
  type: function
products: [cloud]
price_plans: [scale, enterprise]
---

# tier_chunk()

Remove a policy to drop chunks of a particular hypertable.

## Samples

```sql
SELECT remove_retention_policy('conditions');
```

Removes the existing data retention policy for the `conditions` table.

## Required arguments

|Name|Type|Description|
|---|---|---|
| `relation` | REGCLASS | Name of the hypertable or continuous aggregate from which to remove the policy |

## Optional arguments

|Name|Type|Description|
|---|---|---|
| `if_exists` | BOOLEAN |  Set to true to avoid throwing an error if the policy does not exist. Defaults to false.|


