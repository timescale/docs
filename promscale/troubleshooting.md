# Troubleshooting Promscale
This section contains some ideas for troubleshooting common problems experienced
with Promscale.

<!---
* Keep this section in alphabetical order
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
-->

## Backing up Promscale data gives an `out of shared memory` error
<!---
Cause: Promscale creates a table for each metric. pg_dump and pg_restore lock each table when working on it, so they can require a lot of locks in a single transaction, which can quickly grow higher than the maximum number of locks allowed.
Consequence: If the number of locks required exceeds the number allowed, Promscale gives an `out of shared memory` error, and the action is aborted.
Fix: Increase the `max_locks_per_transaction` setting in the PostgreSQL configuration file.
Result: pg_dump and pg_restore can create the required number of locks, and the backup or restore can continue.
For more information, see the [backup and restore documentation][promscale-backup-restore].
-->

## Data is occupying too much space
<!---
Cause: Promscale keeps metric data in chunks. The most recent chunk is kept uncompressed as a cache for faster querying, and chunks are compressed as they age. If your data is taking up more disk space than expected, compression might not be working correctly.
Consequence: If compression is not working correctly, older chunks might not be getting compressed, and taking up too much room on disk.
Fix: To check that compression is working correctly, query the `prom_info.metric` view and make sure that `total_chunks-number_compressed_chunks` is not larger than 2. If compression is not working correctly: Make sure that you have sufficient background workers (i.e., > number of databases + 2) required to do scheduled jobs like compression and retention. If you are using TimescaleDB version less than 2.0.0, make sure that you are running the maintenance cron jobs, and they are returning success.
Consequence: When compression is working correctly, your data is being compressed as it ages.
For more information about compression, see the [Promscale compression documentaion][promscale-compression].
-->

## The PromQL dashboard doesn't show Promscale data
<!---
Cause: Backfilling data which has not been ingested into Prometheus.
Consequence: The PromQL dashboard does not show Promscale data.
Fix: Enable the `read_recent` option for Promscale (How??)
Result: Backfilled data is shown in the PromQL dashboard
For more information, see the [Prometheus remote read documentation][prometheus-remote-read].
-->

## Tracing span data is missing
<!---
Cause: OpenTelemetry Tracing is not recording all Promscale spans. This is usually due to an error in the batch processor.
Consequence: The trace could be attempting to send batches of spans that are larger than allowed, so the span is not sent.
Fix: Check the OpenTelemetry logs for errors like these:
```yml
2021-10-08T12:34:00.360Z        warn    batchprocessor/batch_processor.go:184   Sender failed   {"kind": "processor", "name": "batch", "error": "sending_queue is full"}
```
and:
```yml
2021-10-10T18:49:23.304Z        info    exporterhelper/queued_retry.go:325      Exporting failed. Will retry the request after interval.        {"kind": "exporter", "name": "otlp", "error": "failed to push trace data via OTLP exporter: rpc error: code = DeadlineExceeded desc = context deadline exceeded", "interval": "5.872756134s"}
```
If you are getting these errors, reduce the `send_batch_size` and `send_batch_max_size` in the OpenTelemetry configuration file.
Result: OpenTelemetry can send batches of spans, even if they are large, and the spans are shown as expected in the trace.
For more information, see the [batch processor documentation].
-->


[prometheus-api]: https://prometheus.io/docs/prometheus/latest/querying/api/
[drop_chunks]: https://docs.timescale.com/latest/api#drop_chunks
[prometheus-recording-rules]: https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/
[promscale-ext]: https://github.com/timescale/promscale_extension
[promscale-schema]: https://github.com/timescale/promscale/blob/master/docs/sql_schema.md
[promscale-retention]: https://github.com/timescale/promscale/blob/master/docs/sql_schema.md#data-retention
[prometheus-remote-read]: https://prometheus.io/docs/prometheus/latest/configuration/configuration/#remote_read
[prom-migrator]: https://github.com/timescale/promscale/tree/master/cmd/prom-migrator
[remote-write-integrations]: https://prometheus.io/docs/prometheus/latest/storage/#remote-storage-integrations
[batch-processor]: https://github.com/open-telemetry/opentelemetry-collector/blob/main/processor/batchprocessor/README.md
