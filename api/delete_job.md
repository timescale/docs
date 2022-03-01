## delete_job() <tag type="community">Community</tag>

Delete a job registered with the automation framework.
This works for user-defined actions as well as policies.

If the job is currently running, the process is terminated.

### Required Arguments

|Name|Type|Description|
|---|---|---|
|`job_id`| INTEGER |  TimescaleDB background job id |

### Sample Usage
Delete the job with the job id 1000:
```sql
SELECT delete_job(1000);
```
