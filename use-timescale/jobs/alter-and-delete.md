---
title: Alter and delete jobs
excerpt: When a job has run its course, you can update, reschedule, or delete it. See how to manage your jobs in Timescale Cloud
products: [cloud, mst, self_hosted]
keywords: [actions]
tags: [scheduled jobs, background jobs, automation framework]
---

# Alter and delete $JOBs

Alter an existing $JOB by using [`alter_job`][api-alter_job]. You can change both
the config and the schedule on which the $JOB runs. Delete a $JOB by using
[`delete_job`][api-delete_job].

<Highlight type="note">

To alter or delete a $JOB, you need to know its `job_id`. Find the `job_id` by
querying the `timescaledb_information.jobs` table.

```sql
SELECT * FROM timescaledb_information.jobs;
```

</Highlight>

## Change a $JOB's config

To replace the entire JSON config for a $JOB, call `alter_job` with a new
`config` object. For example, replace the JSON config for a $JOB with ID `1000`:

```sql
SELECT alter_job(1000, config => '{"hypertable":"metrics"}');
```

## Turn off $JOB scheduling 

To turn off automatic scheduling of a $JOB, call `alter_job` and set `scheduled`
to `false`. You can still run the $JOB manually with `run_job`. For example,
turn off the scheduling for a $JOB with ID `1000`:

```sql
SELECT alter_job(1000, scheduled => false);
```

## Re-enable automatic scheduling of a $JOB

To re-enable automatic scheduling of a $JOB, call `alter_job` and set `scheduled`
to `true`. For example, re-enable scheduling for a $JOB with ID `1000`:

```sql
SELECT alter_job(1000, scheduled => true);
```

## Delete a $JOB

Delete a $JOB from the automation framework with [`delete_job`][api-delete_job].
For example, to delete a $JOB with ID `1000`:

```sql
SELECT delete_job(1000);
```

[api-alter_job]: /api/:currentVersion:/actions/alter_job
[api-delete_job]: /api/:currentVersion:/actions/delete_job
