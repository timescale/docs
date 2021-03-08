### Testing and Debugging Jobs [](testing)

Any background worker job can be run in foreground when executed with [`run_job`][api-run_job]. 
This can be useful to debug problems when combined with increased log level.

Since `run_job` is implemented as stored procedure it cannot be executed
inside a SELECT query but has to be executed with [CALL][postgres-call].

Set log level shown to client to `DEBUG1` and run the job with the job id 1000:

```sql
SET client_min_messages TO DEBUG1;
CALL run_job(1000);
```