---
title: Create and register user-defined actions
excerpt: Add a user-defined action to your database
products: [cloud, mst, self_hosted]
keywords: [actions]
tags: [user-defined actions, scheduled jobs, background jobs, automation framework]
---

# Create and register user-defined actions

Adding a user-defined action to your database is a 2-step process:

1.  [Define a function or procedure](#define-a-function-or-procedure)
1.  [Register the action with the job scheduler](#register-an-action)

## Define a function or procedure

To create an action, begin by defining the
[function][postgres-createfunction] or
[procedure][postgres-createprocedure] that you want your database to execute.

Your function needs to be wrapped in a `CREATE` statement. You can also use
`CREATE OR REPLACE`, although this is not recommended. This statement also
allows you to define the language of your commands in this statement.
User-defined actions can be written in any language you choose. This guide uses
the SQL procedural language [PL/pgSQL][plpgsql].

This example defines a simple procedure that raises a notice:

```sql
CREATE PROCEDURE user_defined_action(job_id INT, config JSONB)
    LANGUAGE PLPGSQL AS
    $$
    BEGIN
        RAISE NOTICE 'Executing job % with config %', job_id, config;
    END
    $$;
```

## Register an action

To make the job scheduler run your action, you need to register it. Use the
[`add_job`][api-add_job] function. Supply the name of your action, the schedule
you want it to run on, and the content of your config. If your job needs no
parameters, use a NULL config.

For example:

```sql
SELECT add_job('user_defined_action', '1h', config => '{"hypertable":"metrics"}');
```

The `add_job` call returns a `job_id`. It stores the `job_id` and `config` in
the TimescaleDB catalog.

The action runs on the schedule you set. It also runs when you manually start it
by calling [`run_job`][api-run_job] with the `job_id`. When it runs, the
`job_id` and `config` are passed as arguments to the procedure.

To list all currently registered jobs, query
[`timescaledb_information.jobs`][api-timescaledb_information-jobs]:

```sql
SELECT * FROM timescaledb_information.jobs;
```

[api-add_job]: /api/:currentVersion:/actions/add_job
[api-run_job]: /api/:currentVersion:/actions/run_job
[api-timescaledb_information-jobs]: /api/:currentVersion:/informational-views/jobs/
[postgres-createfunction]: https://www.postgresql.org/docs/current/xfunc.html
[postgres-createprocedure]: https://www.postgresql.org/docs/current/xproc.html
[plpgsql]: https://www.postgresql.org/docs/current/plpgsql-overview.html
