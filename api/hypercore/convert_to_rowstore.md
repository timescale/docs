---
api_name: convert_to_rowstore()
excerpt: Move a chunk from the columnstore to the rowstore
topics: [hypercore, columnstore]
keywords: [columnstore, hypercore, rowstore, chunks, backfilling]
api:
  license: community
  type: procedure
---

import Since2180 from "versionContent/_partials/_since_2_18_0.mdx";
import HypercoreManualWorkflow from "versionContent/_partials/_hypercore_manual_workflow.mdx";

# convert_to_rowstore() <Tag type="community">Community</Tag>

Manually convert a specific chunk in the hypertable columnstore to the rowstore.

If you need to modify or add a lot of data to a chunk in the columnstore, best practice is to stop 
any [jobs][job] moving chunks to the columnstore, convert the chunk back to the rowstore, then modify the 
data. After the update, [convert the chunk to the columnstore][convert_to_columnstore] and restart the jobs.
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
|`chunk`| REGCLASS | -       | ✖        | Name of the chunk to be moved to the rowstore. |
|`if_compressed`| BOOLEAN  | `true`  | ✔        | Set to `false` so this job fails with an error rather than an warning if `chunk` is not in the columnstore |

[job]: /api/:currentVersion:/actions/
[alter_job]: /api/:currentVersion:/actions/alter_job/
[convert_to_columnstore]: /api/:currentVersion:/hypercore/convert_to_columnstore/
[informational-views]: /api/:currentVersion:/informational-views/jobs/
[insert]: /use-timescale/:currentVersion:/write-data/insert/
