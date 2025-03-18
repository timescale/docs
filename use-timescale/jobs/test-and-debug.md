---
title: Test and debug a job
excerpt: Having issues while setting up jobs in Timescale Cloud? Find solutions to the most common ones
products: [cloud, mst, self_hosted]
keywords: [actions, debug]
---

# Test and debug a $JOB

To debug a $JOB, you can increase the log level and run the $JOB manually in
the foreground.

Use the [`run_job`][api-run_job] procedure, which takes a `job_id` argument.
Because `run_job` is a stored procedure and not a function, it needs to be
executed with [`CALL`][postgres-call] instead of `SELECT`.

<Procedure>

1.  Change the minimum log level shown to the client. Set it to `DEBUG1`.

    ```sql
    SET client_min_messages TO DEBUG1;
    ```

1.  Run the $JOB. Replace `1000` with your `job_id`.

    ```sql
    CALL run_job(1000);
    ```

<Highlight type="note">

To find the `job_id` for your job, query the `timescaledb_information.jobs`

table.

```sql
SELECT * FROM timescaledb_information.jobs;
```

</Highlight>

</Procedure>

[api-run_job]: /api/:currentVersion:/actions/run_job
[postgres-call]: https://www.postgresql.org/docs/current/sql-call.html
