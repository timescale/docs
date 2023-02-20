---
title: Send Zipkin traces to Promscale
excerpt: Send Zipkin traces to Promscale
product: promscale
keywords: [Zipkin]
tags: [configure, traces]
---

import PromscaleDeprecation from "versionContent/_partials/_deprecated-promscale.mdx";

# Send Zipkin traces to Promscale

<PromscaleDeprecation />

Promscale natively supports the OpenTelemetry Protocol (OTLP) for
traces. To ingest Zipkin traces to Promscale, use the OpenTelemetry Collector.
The OpenTelemetry Collector converts the Zipkin traces to OpenTelemetry traces.

# Send data using the OpenTelemetry Collector

You can configure the OpenTelemetry Collector to forward Zipkin traces to
Promscale using [Zipkin receiver][zipkin-receiver] and the OpenTelemetry
exporter.

Here's an example configuration file for the OpenTelemetry Collector to forward
traces to Promscale after batch processing the data:

```yaml
receivers:
  zipkin:
exporters:
  otlp:
    endpoint: "<PROMSCALE_HOST>:<gRPC_PORT>"
    tls:
      insecure: true
    sending_queue:
      queue_size: 1000000
    timeout: 10s
processors:
  batch:
    send_batch_size: 4000
    send_batch_max_size: 4000
    timeout: 10s
service:
  pipelines:
    traces:
      receivers: [zipkin]
      exporters: [otlp]
      processors: [batch]
```

Where:

*   `<PROMSCALE_HOST>`: hostname of Promscale.
*   `<gRPC_PORT>`: gRPC port of Promscale. The default port is 9202.

If you are running the OTLP Collector and the Promscale Connector on a
Kubernetes cluster, the endpoint parameter is similar to `endpoint:
"promscale-connector.default.svc.cluster.local:<PORT>"`

The default port exposed by the OpenTelemetry Collector Zipkin receiver is `9411`.
This is the port where you should send your Zipkin traces.

For more information about OpenTelemetry Collector, see the
[OpenTelemetry documentation][otelcol-docs].

[otelcol-docs]: https://opentelemetry.io/docs/collector/
[zipkin-receiver]: https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/zipkinreceiver#zipkin-receiver
