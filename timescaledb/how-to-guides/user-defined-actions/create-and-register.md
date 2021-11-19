# Creating procedures for actions [](create)

The signature for actions is `(job_id INT, config JSONB)`. It can either
be implemented as [function][postgres-createfunction] or
[procedure][postgres-createprocedure].
The content of the config JSONB is completely up to the job and may
also be NULL if no parameters are required.

This is a generic template for a procedure that works with User Defined Actions.

```sql
CREATE OR REPLACE PROCEDURE user_defined_action(job_id int, config jsonb) LANGUAGE PLPGSQL AS
$$
BEGIN
	RAISE NOTICE 'Executing job % with config %', job_id, config;
END
$$;
```

## Registering actions [](register)

In order to register your action for execution within TimescaleDB's
job scheduler, you next need to [`add_job`][api-add_job] with the name of your action
as well as the schedule on which it is run.

When registered, the action's `job_id` and `config` are stored in the
TimescaleDB catalog. The `config` JSONB can be modified with [`alter_job`][api-alter_job].
`job_id` and `config` are passed as arguments when the procedure is
executed as background process or when expressly called with [`run_job`][api-run_job].

Register the created job with the automation framework. `add_job` returns the job_id
which can be used to execute the job manually with `run_job`:

```sql
SELECT add_job('user_defined_action','1h', config => '{"hypertable":"metr"}');
```

To get a list of all currently registered jobs you can query
[`timescaledb_information.jobs`][api-timescaledb_information-jobs]:

```sql
SELECT * FROM timescaledb_information.jobs;
```


[postgres-createfunction]: https://www.postgresql.org/docs/current/sql-createfunction.html
[postgres-createprocedure]: https://www.postgresql.org/docs/current/sql-createprocedure.html
[api-add_job]: /api/:currentVersion:/actions/add_job
[api-alter_job]: /api/:currentVersion:/actions/alter_job
[api-run_job]: /api/:currentVersion:/actions/run_job
[api-timescaledb_information-jobs]: /api/:currentVersion:/informational-views/jobs/
