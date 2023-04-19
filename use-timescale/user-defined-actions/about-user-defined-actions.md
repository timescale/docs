---
title: About user-defined actions
excerpt: Write custom functions and procedures, and schedule them to run periodically
products: [cloud, mst, self_hosted]
keywords: [actions]
tags: [user-defined actions, background jobs, scheduled jobs, automation framework]
---

# About user-defined actions

You can create user-defined actions that periodically run custom functions or
procedures on your database.

## PostgreSQL functions

You can use PostgreSQL functions to create database operations that would
typically take several queries or steps. Functions can also be used by other
applications that interact with your database to perform tasks without
additional code.

Your function needs to be wrapped in a `CREATE` statement. You can also use
`CREATE OR REPLACE`, although this is not recommended. This statement also
allows you to define the language of your commands in this statement.
User-defined actions can be written in any language of your choice. This guide uses
the SQL procedural language [PL/pgSQL][plpgsql].

The basic syntax of a function suitable for a user-defined action is:

```sql
CREATE FUNCTION <function_name> (arguments)
RETURNS <return_datatype> AS $<variable_name>$
   DECLARE
      <declaration>;
   BEGIN
      <function_body>;
      RETURN { <variable_name> | value }
   END; LANGUAGE <language>;
```

This is an example of a function returns the total row count of a table
within a database.

<Highlight type="cloud"
header="Free demo dataset"
button="Try Timescale for free">
This example uses the Timescale Allmilk Factory demonstration dataset. You
can use this educational dataset for free by signing up to Timescale.
</Highlight>

Use this code to create the function:

```sql
CREATE FUNCTION totalRecords ()
RETURNS integer AS $total$
declare
 total integer;
BEGIN
   SELECT count(*) into total FROM fill_measurements;
   RETURN total;
END;
$total$ LANGUAGE plpgsql;
```

When you execute this code in psql, it returns `CREATE FUNCTION` to indicate
that it has successfully been created. You can then execute a call to the
function, like this:

```sql
select totalRecords();
```

The result looks like this:

```sql
 totalrecords
--------------
     48600500
(1 row)
```

## The job scheduler

When you have created your function, you need to register it with the job
scheduler to make the function run regularly. You can do with the `add_job` function.
This example adds the `totalRecords` function, and tells it to run every hour:

```sql
SELECT add_job('totalRecords', '1h', config => '{"hypertable":"metr"}');
```

For the `config` value, if you don't need any special configuration parameters,
you can use `NULL`.

You can see a list of all your currently registered jobs by querying the job
scheduler, like this:

```sql
SELECT * FROM timescaledb_information.jobs;
```

The result looks like this:

```sql
 job_id |      application_name      | schedule_interval | max_runtime | max_retries | retry_period |      proc_schema      |    proc_name     |   owner   | scheduled |         config         |          next_start           | hypertable_schema | hypertable_name
--------+----------------------------+-------------------+-------------+-------------+--------------+-----------------------+------------------+-----------+-----------+------------------------+-------------------------------+-------------------+-----------------
      1 | Telemetry Reporter [1]     | 24:00:00          | 00:01:40    |          -1 | 01:00:00     | _timescaledb_internal | policy_telemetry | postgres  | t         |                        | 2022-08-18 06:26:39.524065+00 |                   |
   1000 | User-Defined Action [1000] | 01:00:00          | 00:00:00    |          -1 | 00:05:00     | public                | totalrecords     | tsdbadmin | t         | {"hypertable": "metr"} | 2022-08-17 07:17:24.831698+00 |                   |
(2 rows)
```

## Native job-scheduling policies

TimescaleDB natively includes some job-scheduling policies, such as:

*   [Continuous aggregate policies][caggs] to automatically refresh continuous
    aggregates
*   [Compression policies][compressing] to compress historical data
*   [Retention policies][retention] to drop historical data
*   [Reordering policies][reordering] to reorder data within chunks

If these don't cover your use case, or if you want to expand upon the native
policy features, you can write a user-defined action.

[caggs]: /use-timescale/:currentVersion:/continuous-aggregates/refresh-policies/
[compressing]: /use-timescale/:currentVersion:/compression/
[reordering]: /api/:currentVersion:/hypertable/add_reorder_policy/
[retention]: /use-timescale/:currentVersion:/data-retention/create-a-retention-policy/
[plpgsql]: https://www.postgresql.org/docs/current/plpgsql-overview.html
