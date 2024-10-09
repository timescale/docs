---
api_name: delete_job()
excerpt: Delete a job from the automatic scheduler
topics: [jobs]
keywords: [jobs, delete]
tags: [background jobs, scheduled jobs, user-defined actions, automation framework]
api:
  license: community
  type: function
---

# delete_job() <Tag type="community">Community</Tag>

Delete a job registered with the automation framework.
This works for user-defined actions as well as policies.

If the job is currently running, the process is terminated.

### Required arguments

|Name|Type|Description|
|---|---|---|
|`job_id`| INTEGER |  TimescaleDB background job id |

### Sample usage

Delete the job with the job id 1000:

```sql
SELECT delete_job(1000);
```
