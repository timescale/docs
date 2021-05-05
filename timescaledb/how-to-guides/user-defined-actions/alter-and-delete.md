# Altering and Dropping Actions

You can alter the config or scheduling parameters with [`alter_job`][api-alter_job].

Replace the entire JSON config for job with id 1000 with the specified JSON:

```sql
SELECT alter_job(1000, config => '{"hypertable":"metrics"}');
```

Disable automatic scheduling of the job with id 1000. The job can still be run manually
with `run_job`:

```sql
SELECT alter_job(1000, scheduled => false);
```

Reenable automatic scheduling of the job with id 1000:

```sql
SELECT alter_job(1000, scheduled => true);
```

Delete the job with id 1000 from the automation framework with [`delete_job`][api-delete_job]:

```sql
SELECT delete_job(1000);
```


[api-alter_job]: /api/:currentVersion:/actions-and-automation/alter_job
[api-delete_job]: /api/:currentVersion:/actions-and-automation/delete_job
