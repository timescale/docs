---
api_name: convert_to_rowstore()
excerpt: Move a chunk from the columnstore to the rowstore
topics: [columnstore, hypercore]
keywords: [columnstore, hypercore, rowstore, chunks, backfilling]
api:
  license: community
  type: function
---

import Since2180 from "versionContent/_partials/_since_2_18_0.mdx";

# convert_to_rowstore() <Tag type="community">Community</Tag>

Move a chunk of data from the columnstore to the rowstore.

If you need to modify or add a lot of data to a chunk in the columnstore, best practice is to stop 
any [jobs][job] moving chunks to the columnstore, convert the chunk back to the rowstore, then modify the 
data. After the update, [convert the chunk to the columnstore][convert_to_columnstore] and restart the jobs.
This workflow is especially useful if you need to backfill old data.

<Since2180 />

