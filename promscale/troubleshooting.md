# Troubleshooting Promscale
This section covers some common errors or problems you might run into while using
 Promscale.

<!---
* Keep this section in alphabetical order
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
-->

## Backing up or upgrading Promscale gives an out of shared memory error
Promscale creates a table for each metric. When you run `pg_dump` and
`pg_restore`, they lock each table to work on it. This can require a lot of
locks in a single transaction, which can quickly grow higher than the maximum
number of locks allowed. If the number of locks required exceeds the number
allowed, Promscale gives an `out of shared memory` error, and the action is
aborted.

To fix this error, increase the `max_locks_per_transaction` setting in the
PostgreSQL configuration file, so that `pg_dump` and `pg_restore` can create the
required number of locks, and the backup or restore can continue.

<highlight type="important">
You need to restart PostreSQL to pick up changes to the
`max_locks_per_transaction` parameter.
</highlight>

You can use this query to calculate the new minimum value to use for `max_locks_per_transaction`:

```SQL
WITH max_objects_touched AS (
        SELECT 400 + count(*) as max_objects_touched
        FROM pg_class
                 JOIN pg_namespace n ON n.oid = pg_class.relnamespace
        WHERE n.nspname <> 'pg_catalog'
          AND n.nspname !~ '^pg_toast'
          AND n.nspname <> 'information_schema'
    ),
    max_conns AS (
        SELECT SUM(setting::INTEGER) as max_conns FROM pg_settings WHERE name IN ('max_connections', 'max_prepared_transactions')
    )
SELECT max_objects_touched/max_conns AS max_locks_per_transaction FROM max_objects_touched, max_conns;
```

## Data is occupying too much space
Promscale keeps metric data in chunks. The most recent chunk is kept
uncompressed as a cache for faster querying, and chunks are compressed as they
age. If your data is taking up more disk space than expected, compression might
not be working correctly. If compression is not working correctly, older chunks
might not be getting compressed, and they might be taking up too much room on
disk. To check that compression is working correctly, query the
`prom_info.metric` view and make sure that
`total_chunks-number_compressed_chunks` is not larger than 2.

If compression is not working correctly, make sure that you have enough
background workers to do scheduled jobs like compression and retention. To
calculate the number of background workers you require, start with the number of
databases you have in your environment, plus 2. If you are using TimescaleDB
version 2.0.0 or earlier, make sure that you are running the maintenance `cron`
jobs, and that they are returning success. When compression is working
correctly, your data is being compressed as it ages.

If compression is working properly, then do the following:
*   Check you are using the most recent version of Promscale, to ensure you have
    the latest features.
*   Consider reducing the length of time that you retain data for.
*   Reduce the chunk interval to 4&nbsp;hours or 2&nbsp;hours. This could slow
    down query performance.

## The PromQL dashboard doesn't show Promscale data
Backfilling data which has not been ingested into Prometheus can cause the
PromQL dashboard to not show Promscale data.

To fix this error, enable the `read_recent` option for Promscale in the
Prometheus configuration's `remote_read` section. This ensures that backfilled
data is shown in the PromQL dashboard:
```yml
remote_read:
  - url: "http://<CONNECTOR-ADDRESS>:9201/read"
    read_recent: true
```

For more information, see the
[Prometheus remote read documentation][prometheus-remote-read].

## Tracing span data is missing
If OpenTelemetry Tracing is not recording all Promscale spans, it is usually due
to an error in the batch processor. The trace could be attempting to send
batches of spans that are larger than allowed, so the span is not sent.

To fix this error, check the OpenTelemetry logs for errors like these:
```yml
2021-10-08T12:34:00.360Z        warn    batchprocessor/batch_processor.go:184   Sender failed   {"kind": "processor", "name": "batch", "error": "sending_queue is full"}
```
and:
```yml
2021-10-10T18:49:23.304Z        info    exporterhelper/queued_retry.go:325      Exporting failed. Will retry the request after interval.        {"kind": "exporter", "name": "otlp", "error": "failed to push trace data via OTLP exporter: rpc error: code = DeadlineExceeded desc = context deadline exceeded", "interval": "5.872756134s"}
```

If you are getting these errors, reduce the `send_batch_size` and
`send_batch_max_size` in the OpenTelemetry configuration file. This means that
OpenTelemetry can send batches of spans, even if they are large, and the spans
are shown as expected in the trace.

For more information, see the [batch processor documentation][batch-processor].

[prometheus-remote-read]: https://prometheus.io/docs/prometheus/latest/configuration/configuration/#remote_read
[batch-processor]: https://github.com/open-telemetry/opentelemetry-collector/blob/main/processor/batchprocessor/README.md
