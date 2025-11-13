---
title: Hypercore
excerpt: Reference information about the TimescaleDB hybrid row-columnar storage engine
keywords: [hypercore]
tags: [hypercore]
products: [cloud, mst, self_hosted]
api:
  license: community
---

import Since2180 from "versionContent/_partials/_since_2_18_0.mdx";
import HypercoreIntro from "versionContent/_partials/_hypercore-intro.mdx";
import CreateHypertableProcedure from "versionContent/_partials/_hypercore_create_hypertable_columnstore_policy.mdx";

# Hypercore

<HypercoreIntro />

<Since2180 />

## Hypercore workflow

Best practice for using $HYPERCORE is to: 

<Procedure>

<CreateHypertableProcedure />

1. **View the policies that you set or the policies that already exist**

   ``` sql
   SELECT * FROM timescaledb_information.jobs
   WHERE proc_name='policy_compression';
   ```
   See [timescaledb_information.jobs][informational-views].

</Procedure>     

You can also [convert_to_columnstore][convert_to_columnstore] and [convert_to_rowstore][convert_to_rowstore] manually
for more fine-grained control over your data.

## Limitations

Chunks in the $COLUMNSTORE have the following limitations:

*   `ROW LEVEL SECURITY` is not supported on chunks in the columnstore.

[alter_table_hypercore]: /api/:currentVersion:/hypercore/alter_table/
[compression_continuous-aggregate]: /api/:currentVersion:/continuous-aggregates/alter_materialized_view/
[convert_to_rowstore]: /api/:currentVersion:/hypercore/convert_to_rowstore/
[convert_to_columnstore]: /api/:currentVersion:/hypercore/convert_to_columnstore/
[informational-views]: /api/:currentVersion:/informational-views/jobs/
[skipscan]: /use-timescale/:currentVersion:/query-data/skipscan/
[add_columnstore_policy]: /api/:currentVersion:/hypercore/add_columnstore_policy/
[hypercore_workflow]: /api/:currentVersion:/hypercore/#hypercore-workflow
[alter_job]: /api/:currentVersion:/jobs-automation/alter_job/
[remove_columnstore_policy]: /api/:currentVersion:/hypercore/remove_columnstore_policy/
[hypertables-section]: /use-timescale/:currentVersion:/hypertables/
[hypertable-create-table]: /api/:currentVersion:/hypertable/create_table/
[hypercore]: /use-timescale/:currentVersion:/hypercore/
[secondary-indexes]: /use-timescale/:currentVersion:/hypercore/secondary-indexes/
