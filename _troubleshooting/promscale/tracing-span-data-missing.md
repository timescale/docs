---
title: Tracing span data is missing
section: troubleshooting
products: [promscale]
topics: [tracing]
errors:
  - language: yml
    message: |-
      2021-10-08T12:34:00.360Z        warn    batchprocessor/batch_processor.go:184   Sender failed   {"kind": "processor", "name": "batch", "error": "sending_queue is full"}
  - language: yml
    message: |-
      2021-10-10T18:49:23.304Z        info    exporterhelper/queued_retry.go:325      Exporting failed. Will retry the request after interval.        {"kind": "exporter", "name": "otlp", "error": "failed to push trace data via OTLP exporter: rpc error: code = DeadlineExceeded desc = context deadline exceeded", "interval": "5.872756134s"}
keywords: [tracing, spans]
tags: [promscale, tracing, spans]
---

import PromscaleDeprecation from "versionContent/_partials/_deprecated-promscale.mdx";

<!---
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
-->

<PromscaleDeprecation />

If OpenTelemetry Tracing is not recording all Promscale spans, it is usually due
to an error in the batch processor. The trace could be attempting to send
batches of spans that are larger than allowed, so the span is not sent.

To fix this error, check the OpenTelemetry logs for the errors above.

If you are getting these errors, reduce the `send_batch_size` and
`send_batch_max_size` in the OpenTelemetry configuration file. This means that
OpenTelemetry can send batches of spans, even if they are large, and the spans
are shown as expected in the trace.

For more information, see the [batch processor documentation][batch-processor].

[batch-processor]: https://github.com/open-telemetry/opentelemetry-collector/blob/main/processor/batchprocessor/README.md
