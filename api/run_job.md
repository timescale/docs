## run_job() <tag type="community">Community</tag> 

Run a previously registered job in the current session.
This works for user-defined actions as well as policies.
Since `run_job` is implemented as stored procedure it cannot be executed
inside a SELECT query but has to be executed with [CALL](postgres-call).

<highlight type="tip">
Any background worker job can be run in the foreground when executed with
`run_job`. You can use this with an increased log level to help debug problems.
</highlight>

#### Required Arguments [](run_job-required-arguments)

|Name|Description|
|---|---|
|`job_id`| (INTEGER)  TimescaleDB background job ID |

#### Sample Usage [](run_job-examples)

```sql
SET client_min_messages TO DEBUG1;
CALL run_job(1000);
```

Set log level shown to client to `DEBUG1` and run the job with the job ID 1000.
