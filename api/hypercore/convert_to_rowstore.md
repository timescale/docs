---
api_name: convert_to_rowstore()
excerpt: Move a chunk from the columnstore to the rowstore
topics: [hypercore, columnstore]
keywords: [columnstore, hypercore, rowstore, chunks, backfilling]
api:
  license: community
  type: procedure
products: [cloud, mst, self_hosted]
---

import Since2180 from "versionContent/_partials/_since_2_18_0.mdx";
import HypercoreManualWorkflow from "versionContent/_partials/_hypercore_manual_workflow.mdx";

# convert_to_rowstore() <Tag type="community">Community</Tag>

Manually convert a specific chunk in the hypertable $COLUMNSTORE to the $ROWSTORE.

If you need to modify or add a lot of data to a chunk in the $COLUMNSTORE, best practice is to stop 
any [jobs][job] moving chunks to the $COLUMNSTORE, convert the chunk back to the $ROWSTORE, then modify the 
data. After the update, [convert the chunk to the $COLUMNSTORE][convert_to_columnstore] and restart the jobs.
This workflow is especially useful if you need to backfill old data.

<Since2180 />

## Samples

To modify or add a lot of data to a chunk:

<Procedure>

<HypercoreManualWorkflow />

</Procedure>

## Arguments

| Name | Type     | Default | Required | Description|
|--|----------|---------|----------|-|
|`chunk`| REGCLASS | -       | ✖        | Name of the chunk to be moved to the $ROWSTORE. |
|`if_compressed`| BOOLEAN  | `true`  | ✔        | Set to `false` so this job fails with an error rather than an warning if `chunk` is not in the $COLUMNSTORE |

[job]: /api/:currentVersion:/jobs-automation/
[alter_job]: /api/:currentVersion:/jobs-automation/alter_job/
[convert_to_columnstore]: /api/:currentVersion:/hypercore/convert_to_columnstore/
[informational-views]: /api/:currentVersion:/informational-views/jobs/
[insert]: /use-timescale/:currentVersion:/write-data/insert/
