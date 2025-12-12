---
api_name: remove_columnstore_policy()
excerpt: Remove a columnstore policy from a hypertable
topics: [hypercore, columnstore, jobs]
keywords: [hypercore, columnstore, policies, remove]
tags: [delete, drop]
api:
  license: community
  type: procedure
products: [cloud, mst, self_hosted]
---
import Since2180 from "versionContent/_partials/_since_2_18_0.mdx";

# remove_columnstore_policy() <Tag type="community" content="community" />

Remove a $COLUMNSTORE policy from a hypertable or continuous aggregate. 

To restart automatic chunk migration to the $COLUMNSTORE, you need to call 
[add_columnstore_policy][add_columnstore_policy] again. 

<Since2180 />

## Samples

You see the $COLUMNSTORE policies in the [informational views][informational-views].

- **Remove the $COLUMNSTORE policy from the `cpu` table**:

   ``` sql
   CALL remove_columnstore_policy('cpu');
   ```

- **Remove the $COLUMNSTORE policy from the `cpu_weekly` continuous aggregate**:

   ``` sql
   CALL remove_columnstore_policy('cpu_weekly');
   ```

## Arguments

| Name | Type | Default | Required | Description |
|--|--|--|--|-|
|`hypertable`|REGCLASS|-|✔| Name of the hypertable or continuous aggregate to remove the policy from|
| `if_exists` | BOOLEAN | `false` |✖| Set to `true` so this job fails with a warning rather than an error if a $COLUMNSTORE policy does not exist on `hypertable` |

[informational-views]: /api/:currentVersion:/informational-views/jobs/
[add_columnstore_policy]: /api/:currentVersion:/hypercore/add_columnstore_policy/
