---
title: Alter and delete user-defined actions
excerpt: Alter an existing job or delete it from the automation framework
products: [cloud, mst, self_hosted]
keywords: [actions]
tags: [user-defined actions, scheduled jobs, background jobs, automation framework]
---

# Alter and delete user-defined actions

Alter an existing job by using [`alter_job`][api-alter_job]. You can change both
the config and the schedule on which the job runs. Delete a job by using
[`delete_job`][api-delete_job].

<Highlight type="note">
To alter or delete a job, you need to know its `job_id`. Find the `job_id` by
querying the `timescaledb_information.jobs` table.

```sql
SELECT * FROM timescaledb_information.jobs;
```

</Highlight>

## Change a job's config

To replace the entire JSON config for a job, call `alter_job` with a new
`config` object. For example, replace the JSON config for a job with id `1000`:

```sql
SELECT alter_job(1000, config => '{"hypertable":"metrics"}');
```

## Turn off scheduling of a job

To turn off automatic scheduling of a job, call `alter_job` and set `scheduled`
to `false`. You can still run the job manually with `run_job`. For example,
turn off the scheduling for a job with id `1000`:

```sql
SELECT alter_job(1000, scheduled => false);
```

## Re-enable automatic scheduling of a job

To re-enable automatic scheduling of a job, call `alter_job` and set `scheduled`
to `true`. For example, re-enable scheduling for a job with id `1000`:

```sql
SELECT alter_job(1000, scheduled => true);
```

## Delete a job

Delete a job from the automation framework with [`delete_job`][api-delete_job].
For example, to delete a job with id `1000`:

```sql
SELECT delete_job(1000);
```

[api-alter_job]: /api/:currentVersion:/actions/alter_job
[api-delete_job]: /api/:currentVersion:/actions/delete_job
