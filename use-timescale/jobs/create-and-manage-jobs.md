---
title: Create and manage jobs
excerpt: Jobs are custom PostgreSQL functions and procedures that you set up to run on a schedule. Create, register, test, alter, and delete jobs in TimescaleDB
products: [cloud, mst, self_hosted]
keywords: [jobs]
tags: [scheduled jobs, background jobs, automation framework]
---

import Prerequisites from "versionContent/_partials/_prereqs-cloud-and-self.mdx";

# Create and manage $JOBs

$JOB_CAPs in $TIMESCALE_DB are custom functions or procedures that run on a schedule that you define. This page explains how to create, test, alter, and delete a $JOB.

## Prerequisites

<Prerequisites />

## Create a $JOB

To create a $JOB, create a [function][postgres-createfunction] or [procedure][postgres-createprocedure] that you want your database to execute, then set it up to run on a schedule. 

<Procedure>

1. **Define a function or procedure in the language of your choice** 

    Wrap it in a `CREATE` statement:

    ```sql
    CREATE FUNCTION <function_name> (job_id INT DEFAULT NULL, config JSONB DEFAULT NULL)
    RETURNS VOID
	DECLARE
		<declaration>;
	BEGIN
		<function_body>;
	END;
	$<variable_name>$ LANGUAGE <language>;
    ```

    For example, to create a function that reindexes a table within your database:

    ```sql
    CREATE FUNCTION reindex_mytable(job_id INT DEFAULT NULL, config JSONB DEFAULT NULL)
    RETURNS VOID
    AS $$
    BEGIN
       REINDEX TABLE mytable;
    END;
    $$ LANGUAGE plpgsql;
    ```
    
    `job_id` and `config` are required arguments in the function signature. This returns `CREATE FUNCTION` to indicate that the function has successfully been created.

1. **Call the function to validate** 

    For example: 

    ```sql
    select reindex_mytable();
    ```

    The result looks like this:

    ```sql
     reindex_mytable
    -----------------
     
    (1 row)
    ```

1. **Register your $JOB with [`add_job`][api-add_job]** 

    Pass the name of your $JOB, the schedule you want it to run on, and the content of your config. For the `config` value, if you don't need any special configuration parameters, set to `NULL`. For example, to run the `reindex_mytable` function every hour:

    ```sql
    SELECT add_job('reindex_mytable', '1h', config => NULL);
    ```
    
    The call returns a `job_id` and stores it along with `config` in the $TIMESCALE_DB catalog.

    The $JOB runs on the schedule you set. You can also run it manually with [`run_job`][api-run_job] passing `job_id`. When the $JOB runs, `job_id` and `config` are passed as arguments.

1. **Validate the job**

    List all currently registered $JOBs with [`timescaledb_information.jobs`][api-timescaledb_information-jobs]:

    ```sql
    SELECT * FROM timescaledb_information.jobs;
    ```

    The result looks like this:

    ```sql
    job_id |      application_name      | schedule_interval | max_runtime | max_retries | retry_period |      proc_schema      |    proc_name     |   owner   | scheduled |         config         |          next_start           | hypertable_schema | hypertable_name
    --------+----------------------------+-------------------+-------------+-------------+--------------+-----------------------+------------------+-----------+-----------+------------------------+-------------------------------+-------------------+-----------------
    1 | Telemetry Reporter [1]     | 24:00:00          | 00:01:40    |          -1 | 01:00:00     | _timescaledb_internal | policy_telemetry | postgres  | t         |                        | 2022-08-18 06:26:39.524065+00 |                   |
    1000 | User-Defined Action [1000] | 01:00:00          | 00:00:00    |          -1 | 00:05:00     | public                | reindex_mytable  | tsdbadmin | t         |                        | 2022-08-17 07:17:24.831698+00 |                   |
    (2 rows)
    ```

</Procedure>

## Test and debug a $JOB

To debug a $JOB, increase the log level and run the $JOB manually with [`run_job`][api-run_job] in the foreground. Because `run_job` is a stored procedure and not a function, run it with [`CALL`][postgres-call] instead of `SELECT`.

<Procedure>

1.  **Set the minimum log level to `DEBUG1`**

     ```sql
     SET client_min_messages TO DEBUG1;
     ```

1.  **Run the $JOB** 

    Replace `1000` with your `job_id`:

    ```sql
    CALL run_job(1000);
    ```

</Procedure>

## Alter and delete a $JOB

Alter an existing $JOB with [`alter_job`][api-alter_job]. You can change both the config and the schedule on which the $JOB runs.

<Procedure>

1. **Change a $JOB's config**

    To replace the entire JSON config for a $JOB, call `alter_job` with a new `config` object. For example, replace the JSON config for a $JOB with ID `1000`:
        
    ```sql
    SELECT alter_job(1000, config => '{"hypertable":"metrics"}');
    ```

1. **Turn off $JOB scheduling**

    To turn off automatic scheduling of a $JOB, call `alter_job` and set `scheduled`to `false`. You can still run the $JOB manually with `run_job`. For example, turn off the scheduling for a $JOB with ID `1000`:
        
    ```sql
    SELECT alter_job(1000, scheduled => false);
    ```

1. **Re-enable automatic scheduling of a $JOB**

    To re-enable automatic scheduling of a $JOB, call `alter_job` and set `scheduled` to `true`. For example, re-enable scheduling for a $JOB with ID `1000`:
        
    ```sql
    SELECT alter_job(1000, scheduled => true);
    ```
   
1. **Delete a $JOB with [`delete_job`][api-delete_job]** 

    For example, to delete a $JOB with ID `1000`:

    ```sql
    SELECT delete_job(1000);
    ```

</Procedure>

[postgres-call]: https://www.postgresql.org/docs/current/sql-call.html
[api-alter_job]: /api/:currentVersion:/jobs-automation/alter_job
[api-delete_job]: /api/:currentVersion:/jobs-automation/delete_job
[plpgsql]: https://www.postgresql.org/docs/current/plpgsql-overview.html
[api-add_job]: /api/:currentVersion:/jobs-automation/add_job
[api-run_job]: /api/:currentVersion:/jobs-automation/run_job
[api-timescaledb_information-jobs]: /api/:currentVersion:/informational-views/jobs/
[postgres-createfunction]: https://www.postgresql.org/docs/current/xfunc.html
[postgres-createprocedure]: https://www.postgresql.org/docs/current/xproc.html
[plpgsql]: https://www.postgresql.org/docs/current/plpgsql-overview.html
