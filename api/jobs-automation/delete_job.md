---
api_name: delete_job()
excerpt: Delete a job from the automatic scheduler
topics: [jobs]
keywords: [jobs, delete]
tags: [background jobs, scheduled jobs, automation framework]
api:
  license: community
  type: function
products: [cloud, mst, self_hosted]
---

# delete_job() <Tag type="community">Community</Tag>

Delete a $JOB registered with the automation framework.
This works for $JOBs as well as policies.

If the $JOB is currently running, the process is terminated.

## Samples

Delete the $JOB with the $JOB id 1000:

```sql
SELECT delete_job(1000);
```

## Required arguments

|Name|Type|Description|
|---|---|---|
|`job_id`| INTEGER |  TimescaleDB background $JOB id |


